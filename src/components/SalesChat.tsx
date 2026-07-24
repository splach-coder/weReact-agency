'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { usePathname } from '@/i18n/navigation';
import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/config/site';
import { trackEvent, trackWhatsAppLead } from '@/lib/analytics';
import { cleanChatText, tokenizeChatText } from '@/lib/chat-links';
import { consumeNdjsonChatStream } from '@/lib/chat-stream';
import { parseConsentChoice, CONSENT_RESOLVED_EVENT, CONSENT_STORAGE_KEY } from '@/lib/consent';
import { PRELOADER_COMPLETE_EVENT, SITE_MENU_STATE_EVENT } from '@/lib/events';
import { acquireScrollLock, releaseScrollLock } from '@/lib/site-overlay';
import type { ChatStreamEvent } from '@/lib/sales-agent';
import styles from './SalesChat.module.css';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  error?: boolean;
};

type SalesChatProps = {
  locale: string;
};

const copyByLocale = {
  en: {
    launcherLabel: 'Ask WeReact',
    title: 'Plan your website with us',
    welcomeTitle: 'What would you like to build?',
    welcomeText: 'Ask about the right service, an estimated starting budget, timing, or a project in our portfolio.',
    prompts: [
      'How much does a business website cost?',
      'Which service fits my project?',
      'Can I see relevant work?',
    ],
    placeholder: 'Ask about your project…',
    send: 'Send message',
    close: 'Close assistant',
    reset: 'Start a new conversation',
    retry: 'Try again',
    email: 'Email',
    thinking: 'WeReact is preparing a reply',
    unavailable: 'I could not complete that reply. Please try again or contact WeReact directly.',
  },
  fr: {
    launcherLabel: 'Demander à WeReact',
    title: 'Planifiez votre site avec nous',
    welcomeTitle: 'Quel projet souhaitez-vous lancer ?',
    welcomeText: 'Demandez le service adapté, un budget de départ, le délai ou un projet de notre portfolio.',
    prompts: [
      'Quel est le prix d’un site professionnel ?',
      'Quel service correspond à mon projet ?',
      'Puis-je voir des réalisations pertinentes ?',
    ],
    placeholder: 'Parlez-nous de votre projet…',
    send: 'Envoyer le message',
    close: 'Fermer l’assistant',
    reset: 'Nouvelle conversation',
    retry: 'Réessayer',
    email: 'Email',
    thinking: 'WeReact prépare une réponse',
    unavailable: 'Je n’ai pas pu terminer cette réponse. Réessayez ou contactez directement WeReact.',
  },
} as const;

let messageSequence = 0;
function messageId(prefix: string) {
  messageSequence += 1;
  return `${prefix}-${messageSequence}`;
}

function isArabicText(text: string) {
  return /[\u0600-\u06ff]/.test(text);
}

function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 2a9.84 9.84 0 0 0-8.42 14.93L2.05 22l5.2-1.53A9.92 9.92 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.08.91.92-3-.2-.31a8.08 8.08 0 1 1 6.79 3.71Zm4.43-6.06c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.31-.75-1.8-.2-.47-.4-.41-.55-.42h-.46c-.16 0-.42.06-.65.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z"
      />
    </svg>
  );
}

export default function SalesChat({ locale }: SalesChatProps) {
  const currentLocale = locale === 'fr' ? 'fr' : 'en';
  const copy = copyByLocale[currentLocale];
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const panelRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    const consentResolved = () => {
      try {
        return Boolean(parseConsentChoice(window.localStorage.getItem(CONSENT_STORAGE_KEY)));
      } catch {
        return false;
      }
    };
    const preloaderDone = () => document.documentElement.dataset.wereactPreloaderComplete === 'true';
    const updateReady = (event?: Event) => {
      const eventChoice = event instanceof CustomEvent
        ? parseConsentChoice((event as CustomEvent<{ choice?: unknown }>).detail?.choice)
        : null;
      setReady(Boolean(eventChoice || consentResolved()) && preloaderDone());
    };

    updateReady();
    window.addEventListener(PRELOADER_COMPLETE_EVENT, updateReady);
    window.addEventListener(CONSENT_RESOLVED_EVENT, updateReady);
    return () => {
      window.removeEventListener(PRELOADER_COMPLETE_EVENT, updateReady);
      window.removeEventListener(CONSENT_RESOLVED_EVENT, updateReady);
    };
  }, []);

  const closeChat = useCallback((restoreFocus = true) => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStreaming(false);
    setOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  useEffect(() => {
    const closeForMenu = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (detail?.open) closeChat(false);
    };
    window.addEventListener(SITE_MENU_STATE_EVENT, closeForMenu);
    return () => window.removeEventListener(SITE_MENU_STATE_EVENT, closeForMenu);
  }, [closeChat]);

  useEffect(() => {
    if (lastPathnameRef.current !== pathname) {
      lastPathnameRef.current = pathname;
      closeChat(false);
    }
  }, [pathname, closeChat]);

  useEffect(() => {
    if (!open) {
      releaseScrollLock('sales-chat');
      return;
    }

    acquireScrollLock('sales-chat');
    const background = Array.from(document.querySelectorAll<HTMLElement>('#site-header, main, footer'));
    background.forEach((element) => element.setAttribute('inert', ''));
    window.requestAnimationFrame(() => inputRef.current?.focus());

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeChat();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      releaseScrollLock('sales-chat');
      background.forEach((element) => element.removeAttribute('inert'));
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, closeChat]);

  useEffect(() => {
    const container = messagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, streaming]);

  useEffect(() => () => {
    abortRef.current?.abort();
    releaseScrollLock('sales-chat');
  }, []);

  const openChat = () => {
    setOpen(true);
    trackEvent('sales_chat_open', { locale: currentLocale });
  };

  const resetConversation = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setDraft('');
    setStreaming(false);
    setAnnouncement('');
    setLastQuestion('');
    window.requestAnimationFrame(() => inputRef.current?.focus());
    trackEvent('sales_chat_reset', { locale: currentLocale });
  };

  const sendMessage = useCallback(async (question: string, includeUser = true) => {
    const text = question.trim();
    if (!text || streaming) return;

    const assistantId = messageId('assistant');
    setDraft('');
    setLastQuestion(text);
    setAnnouncement('');
    setStreaming(true);
    setMessages((current) => {
      const clean = current.filter((message) => !message.error);
      return [
        ...clean,
        ...(includeUser ? [{ id: messageId('user'), role: 'user' as const, text }] : []),
        { id: assistantId, role: 'assistant' as const, text: '' },
      ];
    });

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    let receivedText = false;
    let streamFailed = false;
    let responseText = '';
    const history = messages
      .filter((message) => !message.error && message.text)
      .map((message) => ({ role: message.role, text: message.text }))
      .slice(-8);
    if (history.at(-1)?.role === 'user' && history.at(-1)?.text === text) history.pop();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: text,
          locale: currentLocale,
          history,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const result = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(result?.error || copy.unavailable);
      }

      await consumeNdjsonChatStream(response.body, (event: ChatStreamEvent) => {
        if (event.type === 'text') {
          receivedText = true;
          responseText += event.text;
          setMessages((current) => current.map((message) => (
            message.id === assistantId
              ? { ...message, text: `${message.text}${event.text}` }
              : message
          )));
        }
        if (event.type === 'error') streamFailed = true;
      });

      if (streamFailed || !receivedText) throw new Error(copy.unavailable);
      setAnnouncement(cleanChatText(responseText));
      trackEvent('sales_chat_message', { locale: currentLocale, outcome: 'answered' });
    } catch (error) {
      if (controller.signal.aborted) {
        setMessages((current) => current.filter((message) => message.id !== assistantId || message.text));
        return;
      }
      const message = error instanceof Error && error.message ? error.message : copy.unavailable;
      setMessages((current) => current.map((item) => (
        item.id === assistantId ? { ...item, text: message, error: true } : item
      )));
      setAnnouncement(message);
      trackEvent('sales_chat_message', { locale: currentLocale, outcome: 'error' });
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setStreaming(false);
    }
  }, [copy.unavailable, currentLocale, messages, streaming]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (draft.trim()) void sendMessage(draft);
    }
  };

  const renderText = (text: string) => tokenizeChatText(cleanChatText(text)).map((part, index) => (
    part.type === 'link' ? (
      <a
        key={`${part.href}-${index}`}
        href={part.href}
        target={part.href.startsWith('http') ? '_blank' : undefined}
        rel={part.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={() => trackEvent('sales_chat_link_click', { destination: new URL(part.href, window.location.origin).protocol })}
      >
        {part.text}
      </a>
    ) : <span key={`text-${index}`}>{part.text}</span>
  ));

  if (!ready) return null;

  return (
    <div className={styles.root}>
      <AnimatePresence initial={false}>
        {!open ? (
          <motion.button
            ref={launcherRef}
            key="launcher"
            type="button"
            className={styles.launcher}
            onClick={openChat}
            aria-label={copy.launcherLabel}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.launcherMark} aria-hidden="true">
              <MessageCircle size={15} strokeWidth={1.8} />
            </span>
            <span className={styles.launcherLabel}>{copy.launcherLabel}</span>
          </motion.button>
        ) : (
          <>
            <motion.button
              key="backdrop"
              type="button"
              className={styles.backdrop}
              onClick={() => closeChat()}
              aria-label={copy.close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              ref={panelRef}
              key="panel"
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="sales-chat-title"
              data-lenis-prevent
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className={styles.header}>
                <div className={styles.identity}>
                  <h2 id="sales-chat-title" className={styles.title}>{copy.title}</h2>
                </div>
                <div className={styles.headerActions}>
                  <button type="button" className={styles.iconButton} onClick={resetConversation} aria-label={copy.reset} title={copy.reset}>
                    <RotateCcw size={17} aria-hidden="true" />
                  </button>
                  <button type="button" className={styles.iconButton} onClick={() => closeChat()} aria-label={copy.close} title={copy.close}>
                    <X size={19} aria-hidden="true" />
                  </button>
                </div>
              </header>

              <div ref={messagesRef} className={styles.messages} data-lenis-prevent>
                {!messages.length ? (
                  <section className={styles.welcome}>
                    <h3 className={styles.welcomeTitle}>{copy.welcomeTitle}</h3>
                    <p className={styles.welcomeText}>{copy.welcomeText}</p>
                    <div className={styles.prompts}>
                      {copy.prompts.map((prompt) => (
                        <button key={prompt} type="button" className={styles.prompt} onClick={() => void sendMessage(prompt)}>
                          <span>{prompt}</span>
                          <ArrowRight size={15} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </section>
                ) : (
                  <div className={styles.thread}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`${styles.messageRow} ${message.role === 'user' ? styles.messageRowUser : ''}`}
                      >
                        <div
                          className={`${styles.message} ${message.role === 'user' ? styles.messageUser : styles.messageAssistant} ${message.error ? styles.messageError : ''}`}
                          dir={isArabicText(message.text) ? 'rtl' : 'auto'}
                        >
                          {message.text ? renderText(message.text) : (
                            <span className={styles.typing} aria-hidden="true"><span /><span /><span /></span>
                          )}
                          {message.error && lastQuestion ? (
                            <button type="button" className={styles.retry} onClick={() => void sendMessage(lastQuestion, false)}>
                              <RefreshCw size={13} aria-hidden="true" />
                              {copy.retry}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <span className="sr-only" aria-live="polite">
                  {streaming ? copy.thinking : announcement}
                </span>
              </div>

              <form className={styles.composer} onSubmit={submit}>
                <div className={styles.inputRow}>
                  <textarea
                    ref={inputRef}
                    className={styles.input}
                    value={draft}
                    maxLength={1200}
                    rows={1}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    placeholder={copy.placeholder}
                    aria-label={copy.placeholder}
                    disabled={streaming}
                  />
                  <button type="submit" className={styles.send} disabled={!draft.trim() || streaming} aria-label={copy.send} title={copy.send}>
                    <Send size={18} aria-hidden="true" />
                  </button>
                </div>
                <div className={styles.composerMeta}>
                  <a
                    href={siteConfig.business.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                    onClick={() => trackWhatsAppLead('sales_chat_whatsapp', { page: 'chat', location: 'composer' })}
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${siteConfig.business.email}`}
                    className={styles.contactLink}
                    onClick={() => trackEvent('sales_chat_contact', { method: 'email', locale: currentLocale })}
                  >
                    <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                    <span>{copy.email}</span>
                  </a>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
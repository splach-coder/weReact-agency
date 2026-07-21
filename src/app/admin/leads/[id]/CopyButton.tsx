'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

type CopyButtonProps = {
  value: string;
  label?: string;
};

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 2a9.5 9.5 0 0 0-8.21 14.28L2.5 21.5l5.36-1.25A9.5 9.5 0 1 0 12 2Zm0 2a7.5 7.5 0 0 1 0 15 7.43 7.43 0 0 1-3.52-.88l-.35-.18-2.84.66.69-2.75-.2-.37A7.5 7.5 0 0 1 12 4Zm-2.32 3.4c-.2-.46-.42-.47-.62-.48h-.53c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.29 0 1.34.98 2.64 1.11 2.82.14.18 1.93 2.94 4.67 4.13.65.28 1.16.45 1.56.58.66.21 1.25.18 1.72.11.53-.08 1.63-.67 1.86-1.31.23-.65.23-1.21.16-1.32-.07-.12-.25-.19-.53-.33-.28-.14-1.63-.8-1.88-.9-.25-.09-.44-.14-.62.14-.19.28-.72.9-.88 1.09-.16.18-.32.21-.6.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.33.42-.49.14-.16.18-.28.28-.46.09-.19.04-.35-.03-.49-.07-.14-.61-1.49-.85-2.04Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CopyButton({ value, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const input = document.createElement('textarea');
      input.value = value;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  }

  return (
    <button
      type="button"
      className="crm-copy-button"
      onClick={copyValue}
      aria-label={`${copied ? 'Copied' : label}: ${value}`}
      title={copied ? 'Copied' : label}
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      <span className="crm-copy-button__status" aria-live="polite">{copied ? 'Copied' : ''}</span>
    </button>
  );
}

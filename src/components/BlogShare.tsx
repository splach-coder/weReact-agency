'use client';

import React from 'react';
import { Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

interface BlogShareProps {
    url: string;
    title: string;
    variant?: 'floating' | 'inline';
}

export default function BlogShare({ url, title, variant = 'floating' }: BlogShareProps) {
    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    const [isVisible, setIsVisible] = React.useState(true);
    const observerRef = React.useRef<IntersectionObserver | null>(null);

    React.useEffect(() => {
        if (variant !== 'floating') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        const footer = document.querySelector('footer');
        if (footer) {
            observer.observe(footer);
        }

        observerRef.current = observer;
        return () => observer.disconnect();
    }, [variant]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-4">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Share Article</span>
                <div className="flex gap-2">
                    <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-sm border border-gray-100 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all duration-300"
                    >
                        <Twitter size={16} />
                    </a>
                    <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-sm border border-gray-100 flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-all duration-300"
                    >
                        <Linkedin size={16} />
                    </a>
                    <button
                        onClick={copyToClipboard}
                        className="w-10 h-10 rounded-sm border border-gray-100 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
                    >
                        <LinkIcon size={16} />
                    </button>
                </div>
            </div>
        );
    }

    if (!isVisible && variant === 'floating') return null;

    return (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-40 animate-in fade-in duration-300">
            <div className="p-3 bg-white rounded-sm shadow-xl border border-gray-100 flex flex-col gap-5 items-center">
                <span className="text-[9px] font-black uppercase tracking-widest vertical-text opacity-30 mb-2">Share</span>
                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#1DA1F2] transition-colors"
                >
                    <Twitter size={18} />
                </a>
                <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#0077B5] transition-colors"
                >
                    <Linkedin size={18} />
                </a>
                <button
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                >
                    <LinkIcon size={18} />
                </button>
            </div>
            <style jsx>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                }
            `}</style>
        </div>
    );
}

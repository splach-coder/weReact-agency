'use client';

import { useState, useEffect } from 'react';

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Wait for fonts to load
        if (document.fonts) {
            document.fonts.ready.then(() => {
                setIsLoaded(true);
            });
        } else {
            // Fallback for browsers that don't support document.fonts
            setTimeout(() => setIsLoaded(true), 100);
        }
    }, []);

    return (
        <>
            {/* Loading screen */}
            <div
                className="fixed inset-0 bg-[var(--color-background-main)] z-[9999] transition-opacity duration-500"
                style={{
                    opacity: isLoaded ? 0 : 1,
                    pointerEvents: isLoaded ? 'none' : 'auto'
                }}
            />

            {/* Content */}
            <div
                className="transition-opacity duration-500"
                style={{ opacity: isLoaded ? 1 : 0 }}
            >
                {children}
            </div>
        </>
    );
}

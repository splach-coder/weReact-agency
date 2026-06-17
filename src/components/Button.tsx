'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wide cursor-pointer transition-all duration-300 gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
        sm: "px-4 py-2 text-xs rounded-md",
        md: "px-6 py-3 text-sm rounded-lg",
        lg: "px-8 py-4 text-base rounded-lg"
    };

    const variants = {
        primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:shadow-lg active:scale-95",
        secondary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/15 hover:border-[var(--color-primary)]/40",
        outline: "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
    };

    const combinedClassName = `${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`;

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={combinedClassName.trim()}
            {...(props as any)}
        >
            {children}
        </motion.button>
    );
}

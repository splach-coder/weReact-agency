import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export default function Button({ variant = 'primary', className = '', children, icon, ...props }: ButtonProps) {
    const baseStyles = "inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] px-7 py-3 text-sm font-black uppercase tracking-[0.12em] transition duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
        primary: "bg-[var(--color-primary)] text-white shadow-[0_14px_40px_rgba(58,90,64,0.18)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-dark)]",
        secondary: "border border-[var(--color-primary)]/25 bg-white/65 text-[var(--color-primary)] hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

    return (
        <button
            className={combinedClassName.trim()}
            {...props}
        >
            {children}
            {icon && <span className="shrink-0">{icon}</span>}
        </button>
    );
}

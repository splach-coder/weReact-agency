import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center px-8 py-3 rounded-[10px] font-medium transition-colors duration-200 cursor-pointer text-base sm:text-lg";

    const variants = {
        primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] shadow-sm",
        secondary: "bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

    return (
        <button
            className={combinedClassName.trim()}
            {...props}
        >
            {children}
        </button>
    );
}

import React from 'react';
import { Check } from 'lucide-react';
import Button from '../Button';
import Link from 'next/link';

export default function Packages() {
    const packages = [
        {
            name: "Starter Website",
            description: "For small businesses getting online for the first time.",
            features: [
                "1 to 3 pages",
                "Clean and modern design",
                "Mobile-friendly",
                "Contact form",
                "Basic SEO setup",
                "Fast delivery"
            ],
            idealFor: "Best for local businesses and freelancers."
        },
        {
            name: "Business Website",
            description: "For businesses that need a stronger online presence.",
            highlight: "Most popular option",
            features: [
                "Up to 5 pages",
                "Custom layout based on your business",
                "Mobile and tablet optimized",
                "Contact form",
                "Basic SEO setup",
                "Performance optimization"
            ],
            idealFor: ""
        },
        {
            name: "Custom Website",
            description: "For businesses with specific needs.",
            features: [
                "Custom number of pages",
                "Tailored structure and content",
                "Advanced features if needed",
                "Scalable design",
                "Personalized support"
            ],
            idealFor: "We discuss your needs before starting."
        }
    ];

    return (
        <section className="py-20 md:py-32 px-6 bg-[var(--color-background-contrast)]">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border ${pkg.highlight ? 'border-[var(--color-primary)] bg-[#F8FAF8]' : 'border-gray-200 bg-white'} flex flex-col h-full`}
                        >
                            {pkg.highlight && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-sm font-medium">
                                    {pkg.highlight}
                                </span>
                            )}

                            <h3 className="text-2xl font-bold mb-2 text-[var(--color-text-main)]">{pkg.name}</h3>
                            <p className="text-[var(--color-text-secondary)] mb-8 min-h-[48px]">{pkg.description}</p>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-[var(--color-text-main)]">
                                        <Check size={20} className="text-[var(--color-primary)] min-w-[20px] mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {pkg.idealFor && (
                                <p className="text-sm text-[var(--color-text-muted)] mt-auto mb-6 italic">{pkg.idealFor}</p>
                            )}

                            <Link href="#contact" className="w-full">
                                <Button
                                    variant={pkg.highlight ? 'primary' : 'secondary'}
                                    className="w-full"
                                >
                                    Get started
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>

                <p className="text-center mt-12 text-[var(--color-text-secondary)]">
                    Not sure which one fits your business? <Link href="#contact" className="text-[var(--color-primary)] font-medium underline decoration-1 underline-offset-4">We’ll help you choose.</Link>
                </p>
            </div>
        </section>
    );
}

'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
    Layout, Smartphone, Search, RefreshCw, FileText,
    Code, Palette, Zap, ArrowRight, Check, Star
} from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
    const heroRef = useRef(null);
    const servicesRef = useRef(null);
    const processRef = useRef(null);
    const pricingRef = useRef(null);

    const isHeroInView = useInView(heroRef, { once: true, margin: "-10%" });
    const isServicesInView = useInView(servicesRef, { once: true, margin: "-10%" });
    const isProcessInView = useInView(processRef, { once: true, margin: "-10%" });
    const isPricingInView = useInView(pricingRef, { once: true, margin: "-10%" });

    const { scrollYProgress } = useScroll({
        target: servicesRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const [activeService, setActiveService] = useState(0);

    const services = [
        {
            icon: Layout,
            title: "Business Websites",
            description: "Professional websites that convert visitors into customers",
            features: [
                "Custom design tailored to your brand",
                "Mobile-responsive layouts",
                "SEO-optimized structure",
                "Fast loading speeds",
                "Content management system"
            ],
            color: "#3A5A40"
        },
        {
            icon: FileText,
            title: "Landing Pages",
            description: "High-converting pages designed for campaigns and promotions",
            features: [
                "Conversion-focused design",
                "A/B testing ready",
                "Lead capture forms",
                "Analytics integration",
                "Fast deployment"
            ],
            color: "#2e4833"
        },
        {
            icon: RefreshCw,
            title: "Website Redesigns",
            description: "Modernize your outdated website with fresh design and technology",
            features: [
                "Modern UI/UX design",
                "Performance optimization",
                "Mobile optimization",
                "Brand refresh",
                "Content migration"
            ],
            color: "#3A5A40"
        },
        {
            icon: Smartphone,
            title: "Mobile Optimization",
            description: "Flawless experiences across all devices and screen sizes",
            features: [
                "Responsive design",
                "Touch-friendly interfaces",
                "Mobile-first approach",
                "Cross-device testing",
                "Progressive web apps"
            ],
            color: "#2e4833"
        },
        {
            icon: Search,
            title: "SEO Foundations",
            description: "Built-in technical structure for better search rankings",
            features: [
                "Technical SEO setup",
                "Meta tags optimization",
                "Schema markup",
                "Site speed optimization",
                "Mobile-friendly structure"
            ],
            color: "#3A5A40"
        },
        {
            icon: Code,
            title: "Custom Development",
            description: "Tailored solutions for unique business requirements",
            features: [
                "Custom functionality",
                "API integrations",
                "Database design",
                "Scalable architecture",
                "Ongoing maintenance"
            ],
            color: "#2e4833"
        }
    ];

    const process = [
        {
            number: "01",
            title: "Discovery",
            description: "We learn about your business, goals, and target audience to create the perfect strategy."
        },
        {
            number: "02",
            title: "Design",
            description: "Our team crafts stunning designs that align with your brand and engage your users."
        },
        {
            number: "03",
            title: "Development",
            description: "We build your website using modern technology, ensuring speed and performance."
        },
        {
            number: "04",
            title: "Launch",
            description: "We test, optimize, and deploy your website, then provide ongoing support."
        }
    ];

    const packages = [
        {
            name: "Starter",
            price: "$2,999",
            description: "Perfect for small businesses and startups",
            features: [
                "5-page website",
                "Mobile responsive",
                "Basic SEO setup",
                "Contact form",
                "1 month support"
            ],
            popular: false
        },
        {
            name: "Professional",
            price: "$5,999",
            description: "Ideal for growing businesses",
            features: [
                "10-page website",
                "Custom design",
                "Advanced SEO",
                "CMS integration",
                "3 months support",
                "Analytics setup"
            ],
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large-scale projects",
            features: [
                "Unlimited pages",
                "Custom functionality",
                "Premium SEO",
                "API integrations",
                "12 months support",
                "Dedicated account manager"
            ],
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--color-background-main)]">
            {/* Hero Section */}
            <section ref={heroRef} className="relative py-20 md:py-32 px-6 bg-[var(--color-primary)] text-[var(--color-background-main)] overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-[1200px] mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 mb-8">
                            <Palette className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-widest">Our Services</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.9] mb-8">
                            What We <br />
                            <span className="text-[var(--color-background-main)]">Create</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto">
                            From stunning websites to powerful digital solutions, we bring your vision to life with creativity and precision.
                        </p>
                    </motion.div>
                </div>

                {/* Watermark */}
                <div className="absolute bottom-0 ms-12 w-full overflow-hidden pointer-events-none opacity-[0.03]">
                    <span className="text-[20vw] font-bold leading-none whitespace-nowrap tracking-tighter text-white">
                        SERVICES
                    </span>
                </div>
            </section>

            {/* Interactive Services Showcase */}
            <section ref={servicesRef} className="py-16 md:py-24 px-6">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12 md:mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-primary)] mb-4 md:mb-6">
                            Our Expertise
                        </h2>
                        <p className="text-base md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                            <span className="hidden lg:inline">Click on each service to explore what we can do for you</span>
                            <span className="lg:hidden">Tap to expand and explore our services</span>
                        </p>
                    </motion.div>

                    {/* Desktop: Two-column layout with sticky details */}
                    <div className="hidden lg:grid grid-cols-2 gap-12">
                        {/* Service Cards */}
                        <div className="space-y-4">
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={isServicesInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => setActiveService(index)}
                                    className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${activeService === index
                                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xl scale-[1.02]'
                                        : 'bg-white border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 hover:shadow-lg'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${activeService === index
                                            ? 'bg-white/20'
                                            : 'bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20'
                                            }`}>
                                            <service.icon
                                                size={28}
                                                strokeWidth={2}
                                                className={activeService === index ? 'text-white' : 'text-[var(--color-primary)]'}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`text-2xl font-bold mb-2 ${activeService === index ? 'text-white' : 'text-[var(--color-primary)}'
                                                }`}>
                                                {service.title}
                                            </h3>
                                            <p className={`text-sm ${activeService === index ? 'text-white/80' : 'text-[var(--color-text-secondary)]'
                                                }`}>
                                                {service.description}
                                            </p>
                                        </div>
                                        <ArrowRight
                                            className={`w-6 h-6 transition-all duration-300 ${activeService === index
                                                ? 'text-white translate-x-1'
                                                : 'text-[var(--color-primary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                                                }`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Service Details - Sticky */}
                        <motion.div
                            key={activeService}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="sticky top-24 h-fit"
                        >
                            <div className="bg-white p-8 md:p-10 rounded-3xl border-2 border-[var(--color-primary)]/20 shadow-xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        {React.createElement(services[activeService].icon, {
                                            size: 32,
                                            strokeWidth: 2,
                                            className: 'text-[var(--color-primary)]'
                                        })}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-[var(--color-primary)]">
                                            {services[activeService].title}
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)]">
                                            {services[activeService].description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <h4 className="text-lg font-bold text-[var(--color-primary)] mb-4">
                                        What's Included:
                                    </h4>
                                    {services[activeService].features.map((feature, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                                <Check size={14} strokeWidth={3} className="text-[var(--color-primary)]" />
                                            </div>
                                            <span className="text-[var(--color-text-main)]">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                <Link
                                    href="/contact"
                                    className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold uppercase text-sm tracking-wider hover:bg-[#2e4833] transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Mobile/Tablet: Accordion-style expandable cards */}
                    <div className="lg:hidden space-y-4">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-2xl border-2 border-[var(--color-primary)]/10 overflow-hidden"
                            >
                                {/* Service Header - Always Visible */}
                                <div
                                    onClick={() => setActiveService(activeService === index ? -1 : index)}
                                    className={`p-4 md:p-6 cursor-pointer transition-all duration-300 ${activeService === index
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-white hover:bg-[var(--color-primary)]/5'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${activeService === index
                                            ? 'bg-white/20'
                                            : 'bg-[var(--color-primary)]/10'
                                            }`}>
                                            <service.icon
                                                size={24}
                                                strokeWidth={2}
                                                className={activeService === index ? 'text-white' : 'text-[var(--color-primary)]'}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-lg md:text-xl font-bold mb-1 ${activeService === index ? 'text-white' : 'text-[var(--color-primary)]'
                                                }`}>
                                                {service.title}
                                            </h3>
                                            <p className={`text-xs md:text-sm line-clamp-1 ${activeService === index ? 'text-white/80' : 'text-[var(--color-text-secondary)]'
                                                }`}>
                                                {service.description}
                                            </p>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: activeService === index ? 90 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ArrowRight
                                                className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ${activeService === index ? 'text-white' : 'text-[var(--color-primary)]'
                                                    }`}
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Expandable Details */}
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: activeService === index ? 'auto' : 0,
                                        opacity: activeService === index ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 md:p-6 pt-0 md:pt-2 border-t border-[var(--color-primary)]/10">
                                        <p className="text-sm md:text-base text-[var(--color-text-secondary)] pt-2 mb-4 md:mb-6">
                                            {service.description}
                                        </p>

                                        <h4 className="text-sm md:text-base font-bold text-[var(--color-primary)] mb-3 md:mb-4">
                                            What's Included:
                                        </h4>
                                        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2 md:gap-3">
                                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Check size={12} strokeWidth={3} className="text-[var(--color-primary)]" />
                                                    </div>
                                                    <span className="text-xs md:text-sm text-[var(--color-text-main)]">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <Link
                                            href="/contact"
                                            className="group w-full flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold uppercase text-xs md:text-sm tracking-wider hover:bg-[#2e4833] transition-all duration-300"
                                        >
                                            Get Started
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section ref={processRef} className="py-16 md:py-24 px-6 bg-[var(--color-primary)] text-white">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                            Our Process
                        </h2>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            A proven approach to delivering exceptional results
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isProcessInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
                            >
                                <div className="text-7xl font-bold text-white/5 absolute top-2 right-4 select-none pointer-events-none">
                                    {step.number}
                                </div>
                                <div className="relative z-10">
                                    <div className="text-sm font-bold uppercase tracking-wider text-white/50 mb-2">
                                        Step {step.number}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                                    <p className="text-white/80 leading-relaxed">{step.description}</p>
                                </div>
                                {index < process.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-white/20" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 bg-[var(--color-background-main)]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center bg-[var(--color-primary)] text-white p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl">
                        <Zap className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
                        <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-base md:text-xl text-white/70 mb-6 md:mb-10 max-w-2xl mx-auto">
                            Let's discuss your project and create something amazing together.
                        </p>
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-white text-[var(--color-primary)] rounded-full font-bold text-sm md:text-lg uppercase tracking-wider hover:bg-[var(--color-background-main)] transition-all duration-300 hover:scale-105"
                        >
                            Start Your Project
                            <ArrowRight className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'hello@wereact.agency',
            href: 'mailto:hello@wereact.agency'
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+1 (555) 123-4567',
            href: 'tel:+15551234567'
        },
        {
            icon: MapPin,
            label: 'Location',
            value: 'San Francisco, CA',
            href: '#'
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-[var(--color-background-main)]">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 px-6 bg-[var(--color-primary)] text-[var(--color-background-main)] overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-[1200px] mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 mb-8">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-sm font-bold uppercase tracking-widest">Let's Talk</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.9] mb-8">
                            Get In <br />
                            <span className="text-[var(--color-background-main)]">Touch</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                            Ready to transform your digital presence? Let's create something extraordinary together.
                        </p>
                    </motion.div>
                </div>

                {/* Watermark */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
                    <span className="text-[20vw] font-bold leading-none whitespace-nowrap tracking-tighter text-white">
                        CONTACT
                    </span>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="py-16 md:py-24 px-6">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-primary)] mb-4">
                                Send us a message
                            </h2>
                            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-[var(--color-primary)]/10 rounded-lg focus:border-[var(--color-primary)] focus:outline-none transition-colors text-[var(--color-text-main)]"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-[var(--color-primary)]/10 rounded-lg focus:border-[var(--color-primary)] focus:outline-none transition-colors text-[var(--color-text-main)]"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-[var(--color-primary)]/10 rounded-lg focus:border-[var(--color-primary)] focus:outline-none transition-colors text-[var(--color-text-main)]"
                                        placeholder="Your Company"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={6}
                                        className="w-full px-6 py-4 bg-white border-2 border-[var(--color-primary)]/10 rounded-lg focus:border-[var(--color-primary)] focus:outline-none transition-colors resize-none text-[var(--color-text-main)]"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="group relative w-full overflow-hidden rounded-lg bg-[var(--color-primary)] text-[var(--color-background-main)] px-8 py-5 flex items-center justify-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
                                >
                                    <span className="text-lg font-bold uppercase tracking-wider z-10">Send Message</span>
                                    <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 z-10" />

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-[#2e4833] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]" />
                                </button>
                            </form>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="space-y-8"
                        >
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-primary)] mb-4">
                                    Contact Information
                                </h2>
                                <p className="text-lg text-[var(--color-text-secondary)] mb-12">
                                    Prefer to reach out directly? Here's how you can contact us.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {contactInfo.map((item, index) => (
                                    <motion.a
                                        key={index}
                                        href={item.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
                                        className="group flex items-start gap-6 p-6 bg-white rounded-2xl border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                                            <item.icon size={24} strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                                                {item.label}
                                            </h3>
                                            <p className="text-xl font-medium text-[var(--color-primary)] group-hover:text-[#2e4833] transition-colors">
                                                {item.value}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                                    </motion.a>
                                ))}
                            </div>

                            {/* CTA Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="mt-12 p-8 bg-[var(--color-primary)] text-[var(--color-background-main)] rounded-2xl"
                            >
                                <h3 className="text-2xl font-bold mb-3">
                                    Not sure where to start?
                                </h3>
                                <p className="text-white/70 mb-6 leading-relaxed">
                                    Schedule a free consultation call and we'll help you define your project scope and goals.
                                </p>
                                <Link
                                    href="mailto:hello@wereact.agency"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-primary)] rounded-lg font-bold uppercase text-sm tracking-wider hover:bg-[var(--color-background-main)] transition-colors"
                                >
                                    Schedule a Call
                                    <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

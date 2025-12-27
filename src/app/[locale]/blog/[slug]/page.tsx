import React from 'react';
import { blogPosts } from '@/data/blog';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { routing } from '@/i18n/routing';
import BlogShare from '@/components/BlogShare';
import { siteConfig } from '@/config/site';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug, locale } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | WeReact Journal`,
        description: post.metaDescription || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.metaDescription || post.excerpt,
            url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
            siteName: 'WeReact Journal',
            images: [{ url: `${siteConfig.url}${post.image}`, width: 1200, height: 630, alt: post.title }],
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.metaDescription || post.excerpt,
            images: [`${siteConfig.url}${post.image}`],
        },
    };
}

export async function generateStaticParams() {
    return routing.locales.flatMap(locale =>
        blogPosts.map(post => ({
            locale,
            slug: post.slug
        }))
    );
}

export default async function BlogPostPage({ params }: Props) {
    const { slug, locale } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
    const postUrl = `${siteConfig.url}/${locale}/blog/${post.slug}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription || post.excerpt,
        image: post.image,
        datePublished: post.date,
        author: { '@type': 'Person', name: post.author },
        publisher: {
            '@type': 'Organization',
            name: 'WeReact',
            logo: { '@type': 'ImageObject', url: 'https://wereact.agency/icon.png' },
        },
        mainEntityOfPage: { '@context': 'https://schema.org', '@type': 'WebPage', '@id': postUrl },
    };

    return (
        <article className="min-h-screen bg-[var(--color-background-main)]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <BlogShare url={postUrl} title={post.title} variant="floating" />

            {/* Post Header - Green Banner */}
            <header className="relative pt-24 pb-16 md:pt-40 md:pb-24 px-6 bg-[var(--color-primary)] text-white overflow-hidden text-center md:text-left">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-sm blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="max-w-[1000px] mx-auto relative z-10">
                    <Link
                        href={`/${locale}/blog`}
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all mb-8 text-[10px] uppercase tracking-[0.3em] font-black group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Journal Index
                    </Link>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                        <span className="px-2 py-0.5 bg-white text-[var(--color-primary)] rounded-sm" style={{ backgroundColor: post.categoryColor }}>{post.category}</span>
                        <span className="flex items-center gap-1.5 opacity-50"><Calendar size={12} /> {post.date}</span>
                        <span className="flex items-center gap-1.5 opacity-50"><Clock size={12} /> {post.readTime}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-8 uppercase font-nohemi">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-8 border-t border-white/10">
                        <div className="w-10 h-10 rounded-sm overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-black uppercase tracking-widest">{post.author}</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-[0.1em] font-bold">Thought Leader</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Container */}
            <div className="max-w-[1200px] mx-auto px-6 -mt-12 relative z-20 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Main Content Column */}
                    <div className="lg:w-[70%]">
                        <div className="bg-white rounded-sm p-6 md:p-12 lg:p-16 shadow-lg border border-gray-100">
                            <div className="relative aspect-video rounded-sm overflow-hidden mb-10 shadow-md">
                                <Image src={post.image} alt={post.title} fill className="object-cover" priority />
                            </div>

                            <div
                                className="prose prose-lg max-w-none 
                                prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-[var(--color-primary)] prose-headings:uppercase
                                prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed prose-p:mb-6 prose-p:text-sm md:prose-p:text-base
                                prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-primary)] prose-blockquote:bg-gray-50 prose-blockquote:p-8 prose-blockquote:rounded-sm prose-blockquote:italic prose-blockquote:text-lg md:prose-blockquote:text-xl
                                prose-strong:text-[var(--color-primary)] prose-strong:font-black
                                prose-li:text-[var(--color-text-secondary)] prose-li:mb-1 prose-li:text-sm
                                prose-img:rounded-sm"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-50 text-[9px] font-black uppercase tracking-widest rounded-sm border border-gray-100">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <BlogShare url={postUrl} title={post.title} variant="inline" />
                            </div>
                        </div>
                    </div>

                    {/* Pro Sidebar */}
                    <aside className="lg:w-[30%] space-y-8">
                        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-6 flex items-center gap-2 uppercase tracking-tighter">
                                <div className="w-1 h-4 bg-[var(--color-primary)] rounded-sm" />
                                Latest Briefings
                            </h3>
                            <div className="space-y-6">
                                {otherPosts.map(p => (
                                    <Link key={p.slug} href={`/${locale}/blog/${p.slug}`} className="group block">
                                        <div className="relative aspect-video rounded-sm overflow-hidden mb-3 bg-gray-100">
                                            <Image src={p.image} alt={p.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-[var(--color-primary)] opacity-40 mb-1">{p.category}</p>
                                        <h4 className="font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors mb-2 leading-tight text-sm">
                                            {p.title}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-[var(--color-primary)] text-[9px] font-black uppercase lg:opacity-0 group-hover:opacity-100 transition-all">
                                            Read <ArrowRight size={12} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[var(--color-primary)] p-8 rounded-sm text-white relative overflow-hidden group shadow-lg">
                            <h3 className="text-2xl font-bold mb-4 tracking-tighter uppercase leading-[0.9]">Architecting Futures</h3>
                            <p className="text-white/50 mb-8 text-sm leading-relaxed">Let's translate insights into high-performance digital assets.</p>
                            <Link
                                href={`/${locale}/contact`}
                                className="inline-flex items-center justify-between w-full p-1.5 pl-6 bg-white text-[var(--color-primary)] rounded-sm group/btn transition-all font-black uppercase text-[9px] tracking-widest"
                            >
                                Contact Us
                                <div className="w-8 h-8 rounded-sm bg-[var(--color-primary)] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowRight size={14} />
                                </div>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </article>
    );
}

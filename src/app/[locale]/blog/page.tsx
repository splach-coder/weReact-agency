import React from 'react';
import { blogPosts, BlogPost } from '@/data/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Our Journal | WeReact - High-End Digital Insights',
    description: 'Explore our latest articles on Next.js performance, premium UX design, and advanced SEO strategies.',
    openGraph: {
        title: 'WeReact Journal - Premium Digital Insights',
        description: 'Deep dives into the tech and design strategies that power modern digital experiences.',
        type: 'website',
        images: [{ url: '/images/blog/performance.png', width: 1200, height: 630, alt: 'WeReact Blog' }]
    }
};

const BentoCard = ({ post, locale, size = 'small' }: { post: BlogPost, locale: string, size?: 'large' | 'small' }) => (
    <Link
        href={`/${locale}/blog/${post.slug}`}
        className={`group relative overflow-hidden rounded-sm bg-gray-900 flex flex-col justify-end ${size === 'large' ? 'h-[400px] md:h-full md:col-span-2 md:row-span-2' : 'h-[250px]'
            }`}
    >
        <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-60 group-hover:opacity-40 transition-all duration-700 group-hover:scale-105"
            priority={size === 'large'}
            sizes={size === 'large' ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="relative p-6 md:p-8 z-10">
            <div
                className="inline-block px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest text-white mb-3"
                style={{ backgroundColor: post.categoryColor || 'var(--color-primary)' }}
            >
                {post.category}
            </div>
            <h3 className={`${size === 'large' ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl'} font-bold text-white tracking-tighter leading-tight group-hover:translate-x-1 transition-transform duration-300`}>
                {post.title}
            </h3>
            {size === 'large' && (
                <p className="mt-3 text-white/60 line-clamp-2 max-w-xl text-sm hidden md:block">
                    {post.excerpt}
                </p>
            )}
        </div>
    </Link>
);

export default async function BlogListingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const featuredPosts = blogPosts.slice(0, 3);

    return (
        <div className="min-h-screen bg-[var(--color-background-main)]">
            {/* Hero Section - Matching About Page */}
            <section className="relative py-20 md:py-32 px-6 bg-[var(--color-primary)] text-[var(--color-background-main)] overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-sm blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-sm blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-[1200px] mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-white/20 bg-white/10 mb-8">
                        <span className="text-xs font-bold uppercase tracking-widest">Our Journal</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9] mb-8 font-nohemi">
                        Insights <br />
                        <span className="text-[var(--color-background-main)]">& Ideas</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                        Deep dives into the tech and design strategies that power modern digital experiences.
                    </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
                    <span className="text-[20vw] font-bold leading-none whitespace-nowrap tracking-tighter text-white">
                        THE BLOG
                    </span>
                </div>
            </section>

            {/* Bento Grid Section */}
            <section className="py-12 md:py-20 px-6">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
                        {featuredPosts[0] && (
                            <BentoCard post={featuredPosts[0]} locale={locale} size="large" />
                        )}
                        {featuredPosts[1] && (
                            <BentoCard post={featuredPosts[1]} locale={locale} size="small" />
                        )}
                        {featuredPosts[2] && (
                            <BentoCard post={featuredPosts[2]} locale={locale} size="small" />
                        )}
                    </div>
                </div>
            </section>

            {/* All Stories Section */}
            <section className="py-16 md:py-24 px-6 border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="text-3xl font-bold mb-12 tracking-tight uppercase font-nohemi">All Stories</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {blogPosts.map((post) => (
                            <article key={post.slug} className="group cursor-pointer">
                                <Link href={`/${locale}/blog/${post.slug}`}>
                                    <div className="relative aspect-video rounded-sm overflow-hidden mb-6 bg-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span
                                                className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white rounded-sm"
                                                style={{ backgroundColor: post.categoryColor || 'var(--color-primary)' }}
                                            >
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
                                            <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--color-primary)] leading-tight group-hover:translate-x-1 transition-transform duration-300">
                                            {post.title}
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)] line-clamp-2 text-xs leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <div className="pt-2 flex items-center gap-1 text-[var(--color-primary)] font-black text-[9px] uppercase tracking-[0.2em]">
                                            Read Article <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 px-6">
                <div className="max-w-[1200px] mx-auto bg-[var(--color-primary)] rounded-sm p-10 md:p-20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-sm blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 max-w-2xl text-white">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-[0.9] mb-6">
                            Join the <br /> <span className="opacity-50 italic">Digital vanguard</span>
                        </h2>
                        <p className="text-base text-white/60 mb-8 max-w-lg font-medium">
                            Receive deep dives into performance and design straight to your inbox. No noise, just engineering excellence.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="your-email@vanguard.com"
                                className="flex-1 bg-white/10 border border-white/20 rounded-sm px-6 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-all"
                            />
                            <button className="px-10 py-3 bg-white text-[var(--color-primary)] rounded-sm font-black uppercase text-[10px] tracking-widest hover:bg-[#E3E3DC] transition-all hover:scale-105 active:scale-95">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

import React from 'react';
import { blogPosts, getLocalizedPost } from '@/data/blog';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { routing } from '@/i18n/routing';
import BlogShare from '@/components/BlogShare';
import { siteConfig } from '@/config/site';
import { createBlogPostingJsonLd, createBreadcrumbJsonLd, createFaqJsonLd, createPageMetadata } from '@/lib/seo';
import { sanitizeHtml } from '@/lib/sanitize';
import { renderInlineLinks } from '@/lib/inline-links';
import { getServiceLandingPage } from '@/data/services';
import { getBlogUi } from '@/data/blog-ui';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const basePost = blogPosts.find((p) => p.slug === slug);

    if (!basePost) return { title: 'Post Not Found' };
    const post = getLocalizedPost(basePost, locale);
    const ui = getBlogUi(locale);

    const metadata = createPageMetadata({
        title: post.metaTitle ?? post.title,
        description: post.metaDescription || post.excerpt,
        path: `/${locale}/blog/${post.slug}`,
        image: post.image,
        locale,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author],
        keywords: [post.category, ui.journal, 'website design Marrakech', 'local SEO Morocco'],
    });

    return {
        ...metadata,
        openGraph: {
            ...metadata.openGraph,
            type: 'article',
            modifiedTime: post.modifiedAt,
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
    const basePost = blogPosts.find((p) => p.slug === slug);

    if (!basePost) {
        notFound();
    }

    const post = getLocalizedPost(basePost, locale);
    const ui = getBlogUi(locale);
    const otherPosts = blogPosts
        .filter((p) => p.slug !== slug)
        .slice(0, 3)
        .map((p) => getLocalizedPost(p, locale));
    const postUrl = `${siteConfig.url}/${locale}/blog/${post.slug}`;
    const relatedService = getServiceLandingPage(post.relatedServiceSlug);

    const jsonLd = createBlogPostingJsonLd(post, locale);
    const faqJsonLd = post.faqs && post.faqs.length > 0 ? createFaqJsonLd(post.faqs) : null;
    const isFr = locale === 'fr';

    const breadcrumbJsonLd = createBreadcrumbJsonLd([
        { name: locale === 'fr' ? 'Accueil' : 'Home', url: `/${locale}` },
        { name: ui.journal, url: `/${locale}/blog` },
        { name: post.title, url: `/${locale}/blog/${post.slug}` },
    ]);

    return (
        <article className="min-h-screen bg-[var(--color-background-main)]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            {faqJsonLd && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            )}

            <BlogShare url={postUrl} title={post.title} locale={locale} variant="floating" />

            {/* Post Header */}
            <header className="relative pt-36 pb-16 md:pt-48 md:pb-24 px-6 bg-[var(--color-background-main)] text-[var(--color-text-main)] overflow-hidden text-center md:text-left">
                <div className="max-w-[1000px] mx-auto relative z-10">
                    <Link
                        href={`/${locale}/blog`}
                        className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-[color,background-color,border-color,opacity,transform,box-shadow] mb-8 text-mono group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                        {ui.back}
                    </Link>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                        <span className="px-2 py-0.5 text-white rounded-sm" style={{ backgroundColor: 'var(--color-primary)' }}>{post.category}</span>
                        <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                            <Calendar size={12} aria-hidden="true" />
                            <time dateTime={post.publishedAt}>{ui.published} {post.date}</time>
                        </span>
                        {post.modifiedAt && post.modifiedAt !== post.publishedAt ? (
                            <span className="text-[var(--color-text-muted)]">
                                <time dateTime={post.modifiedAt}>
                                    {ui.updated} {new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.modifiedAt))}
                                </time>
                            </span>
                        ) : null}
                        <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]"><Clock size={12} aria-hidden="true" /> {post.readTime}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-8 font-nohemi text-[var(--color-text-main)]">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center md:justify-start gap-4 pt-8 border-t border-[rgba(58,90,64,0.15)]">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[rgba(58,90,64,0.1)] flex items-center justify-center">
                            <User size={20} className="text-[var(--color-primary)]" aria-hidden="true" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-main)]">
                                <Link href={`/${locale}/about#author`} title={ui.aboutAuthor} className="underline decoration-[rgba(58,90,64,0.3)] underline-offset-4 hover:text-[var(--color-primary)]">
                                    {post.author}
                                </Link>
                            </p>
                            <p className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.1em] font-bold">{post.authorRole}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Container */}
            <div className="max-w-[1200px] mx-auto px-6 relative z-20 pb-20 pt-4">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Main Content Column */}
                    <div className="lg:w-[70%]">
                        <div className="bg-white rounded-sm p-6 md:p-12 lg:p-16 shadow-lg border border-gray-100">
                            <div className="relative aspect-video rounded-sm overflow-hidden mb-10 shadow-md">
                                <Image src={post.image} alt={post.title} fill className="object-cover" priority />
                            </div>

                            {post.summary && (
                                <section aria-labelledby="article-summary" className="mb-10 border-l-2 border-[var(--color-primary)] bg-[var(--color-background-main)] px-6 py-5">
                                    <h2 id="article-summary" className="text-mono text-[var(--color-primary)]">{isFr ? 'En bref' : 'In short'}</h2>
                                    <p className="mt-3 text-lg leading-relaxed text-[var(--color-text-main)]">{post.summary}</p>
                                </section>
                            )}

                            <div
                                className="prose prose-lg max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[var(--color-text-main)] prose-h2:mt-14 prose-h2:text-3xl prose-h3:text-xl prose-p:leading-relaxed prose-p:text-[var(--color-text-secondary)] prose-a:font-normal prose-a:text-[var(--color-primary)] prose-a:underline prose-a:decoration-[rgba(58,90,64,0.35)] prose-a:underline-offset-4 hover:prose-a:decoration-[var(--color-primary)] prose-blockquote:border-l-2 prose-blockquote:border-[var(--color-primary)] prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-[var(--color-text-main)] prose-strong:font-semibold prose-strong:text-[var(--color-text-main)] prose-li:text-[var(--color-text-secondary)] prose-li:marker:text-[var(--color-primary)] prose-img:rounded-sm"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                            />

                            {post.faqs && post.faqs.length > 0 && (
                                <section aria-labelledby="article-faq" className="mt-14 border-t border-[rgba(58,90,64,0.15)] pt-10">
                                    <h2 id="article-faq" className="text-3xl font-medium tracking-tight text-[var(--color-text-main)]">{isFr ? 'Questions fréquentes' : 'Common questions'}</h2>
                                    <dl className="mt-6 divide-y divide-[rgba(58,90,64,0.12)]">
                                        {post.faqs.map((faq) => (
                                            <div key={faq.question} className="py-5">
                                                <dt className="text-lg font-medium text-[var(--color-text-main)]">{faq.question}</dt>
                                                <dd className="mt-2 leading-relaxed text-[var(--color-text-secondary)]">{renderInlineLinks(faq.answer)}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </section>
                            )}

                            {relatedService && (
                                <aside className="mt-12 border-y border-[rgba(58,90,64,0.15)] py-8">
                                    <p className="text-mono text-[var(--color-primary)]">{ui.nextStep}</p>
                                    <h2 className="mt-3 text-2xl font-bold leading-tight text-[var(--color-text-main)]">{relatedService.copy[locale === 'fr' ? 'fr' : 'en'].title}</h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">{relatedService.copy[locale === 'fr' ? 'fr' : 'en'].description}</p>
                                    <Link href={`/${locale}/${relatedService.slug}`} className="mt-5 inline-flex items-center gap-2 text-mono text-[var(--color-primary)] underline underline-offset-4">
                                        {ui.exploreService} <ArrowRight size={14} aria-hidden="true" />
                                    </Link>
                                </aside>
                            )}
                            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-50 text-[9px] font-black uppercase tracking-widest rounded-sm border border-gray-100">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <BlogShare url={postUrl} title={post.title} locale={locale} variant="inline" />
                            </div>
                        </div>
                    </div>

                    {/* Pro Sidebar */}
                    <aside className="lg:w-[30%] space-y-8">
                        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-6 flex items-center gap-2 uppercase tracking-tighter">
                                <div className="w-1 h-4 bg-[var(--color-primary)] rounded-sm" />
                                {ui.latestBriefings}
                            </h3>
                            <div className="space-y-6">
                                {otherPosts.map(p => (
                                    <Link key={p.slug} href={`/${locale}/blog/${p.slug}`} className="group block">
                                        <div className="relative aspect-video rounded-sm overflow-hidden mb-3 bg-gray-100">
                                            <Image src={p.image} alt={p.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-500" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary-light)] mb-1">{p.category}</p>
                                        <h4 className="font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors mb-2 leading-tight text-sm">
                                            {p.title}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-[var(--color-primary)] text-[9px] font-black uppercase lg:opacity-0 group-hover:opacity-100 transition-[color,background-color,border-color,opacity,transform,box-shadow]">
                                            {ui.readArticle} <ArrowRight size={12} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[var(--color-primary)] p-8 rounded-sm text-white relative overflow-hidden group shadow-lg">
                            <h3 className="text-2xl font-bold mb-4 tracking-tighter uppercase leading-[0.9]">{ui.contactTitle}</h3>
                            <p className="text-white/80 mb-8 text-sm leading-relaxed">{ui.contactCopy}</p>
                            <Link
                                href={`/${locale}/contact`}
                                className="inline-flex items-center justify-between w-full p-1.5 pl-6 bg-white text-[var(--color-primary)] rounded-sm group/btn transition-[color,background-color,border-color,opacity,transform,box-shadow] font-black uppercase text-[9px] tracking-widest"
                            >
                                {ui.contact}
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

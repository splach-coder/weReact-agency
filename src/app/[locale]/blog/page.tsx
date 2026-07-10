import React from 'react';
import { blogPosts, BlogPost } from '@/data/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowUpRight, Calendar, Clock, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Journal | WeReact - Web, SEO, and Growth Notes',
  description: 'Practical notes on web design, local SEO, tourism websites, performance, and content strategy from WeReact in Marrakech.',
  keywords: ['local SEO Morocco', 'website design Marrakech', 'tourism website SEO', 'web design blog Morocco'],
  openGraph: {
    title: 'WeReact Journal',
    description: 'Practical notes for Moroccan brands that need faster, clearer, search-ready websites.',
    type: 'website',
    images: [{ url: '/images/blog/marrakech-web-design-real.webp', width: 1200, height: 630, alt: 'WeReact Journal' }],
  },
};

function ArticleMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
      <span className="text-[var(--color-primary)]">{post.category}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--color-accent-sage)]" aria-hidden="true" />
      <span className="inline-flex items-center gap-1.5">
        <Calendar size={12} aria-hidden="true" />
        {post.date}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock size={12} aria-hidden="true" />
        {post.readTime}
      </span>
    </div>
  );
}

function StoryLink({ post, locale, index }: { post: BlogPost; locale: string; index: number }) {
  return (
    <article className="group border-t border-[rgba(58,90,64,0.14)] py-7 transition-colors hover:border-[rgba(58,90,64,0.35)] md:py-8">
      <Link href={`/${locale}/blog/${post.slug}`} className="grid gap-6 md:grid-cols-[0.18fr_0.82fr] md:gap-10">
        <div className="flex items-start justify-between md:block">
          <span className="text-mono text-[var(--color-accent-sage)]">{String(index + 1).padStart(2, '0')}</span>
          <ArrowUpRight className="text-[var(--color-primary)] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 md:mt-10" size={22} aria-hidden="true" />
        </div>
        <div className="grid gap-6 md:grid-cols-[0.66fr_0.34fr] md:items-start">
          <div>
            <ArticleMeta post={post} />
            <h3 className="mt-4 max-w-3xl font-display text-[clamp(1.7rem,2.8vw,3.35rem)] leading-[0.98] text-[var(--color-text-main)] transition-colors duration-500 group-hover:text-[var(--color-primary)]">
              {post.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-[var(--color-text-secondary)] md:text-base">
              {post.excerpt}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--color-accent-warm)] md:aspect-[3/4]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 28vw"
            />
            <div className="absolute inset-0 bg-[rgba(58,90,64,0.08)]" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function BlogListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [featuredPost, ...otherPosts] = blogPosts;
  const heroImages = blogPosts.slice(0, 3);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--color-background-main)] text-[var(--color-text-main)]">
      <section className="relative isolate px-6 pb-10 pt-28 md:flex md:min-h-[88svh] md:items-center md:px-16 md:pb-10 md:pt-28">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[-0.08em] top-24 select-none text-[16vw] font-black leading-none tracking-tight text-[var(--color-primary)] opacity-[0.035]"
        >
          BLOG
        </span>

        <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.88fr_0.72fr] lg:items-center">
          <div data-depth="4">
            <p className="text-mono mb-5 flex items-center gap-3 text-[var(--color-primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" aria-hidden="true" />
              WeReact Journal
            </p>
            <h1 className="font-display max-w-3xl text-[clamp(2.6rem,5vw,4.9rem)] leading-[0.94] text-[var(--color-text-main)]">
              Ideas for brands that need to be found.
            </h1>
            <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-[var(--color-text-secondary)]">
              Practical notes on web design, local SEO, tourism growth, and content structure from our Marrakech studio.
            </p>
          </div>

          <div data-depth="3" className="relative min-h-[280px] sm:min-h-[320px] lg:min-h-[380px]">
            <div className="absolute left-0 top-8 h-[72%] w-[68%] overflow-hidden rounded-lg border border-[rgba(58,90,64,0.16)] bg-[var(--color-background-contrast)] shadow-[var(--shadow-xl)]">
              {heroImages[0] && (
                <Image src={heroImages[0].image} alt={heroImages[0].title} fill priority className="object-cover" sizes="(max-width: 1024px) 70vw, 34vw" />
              )}
            </div>
            <div className="absolute right-0 top-0 h-[46%] w-[48%] overflow-hidden rounded-lg border border-[rgba(58,90,64,0.16)] bg-[var(--color-background-contrast)] shadow-[var(--shadow-lg)] transition-transform duration-700 hover:-translate-y-2">
              {heroImages[1] && (
                <Image src={heroImages[1].image} alt={heroImages[1].title} fill className="object-cover" sizes="(max-width: 1024px) 46vw, 23vw" />
              )}
            </div>
            <div className="absolute bottom-0 right-[8%] h-[38%] w-[52%] overflow-hidden rounded-lg border border-[rgba(58,90,64,0.16)] bg-[var(--color-background-contrast)] shadow-[var(--shadow-lg)] transition-transform duration-700 hover:translate-y-2">
              {heroImages[2] && (
                <Image src={heroImages[2].image} alt={heroImages[2].title} fill className="object-cover" sizes="(max-width: 1024px) 52vw, 24vw" />
              )}
            </div>
            <div className="absolute bottom-6 left-5 z-10 border border-[rgba(58,90,64,0.18)] bg-[rgba(246,246,242,0.88)] px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur-md">
              <div className="flex items-center gap-3 text-mono text-[var(--color-primary)]">
                <Search size={15} aria-hidden="true" />
                Search-ready notes
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredPost && (
        <section className="px-6 pb-12 md:px-16 md:pb-16">
          <div className="mx-auto grid max-w-7xl gap-8 border-y border-[rgba(58,90,64,0.16)] py-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-12 lg:py-12">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-mono text-[var(--color-primary)]">Featured insight</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,3.2vw,3.9rem)] leading-[0.94] text-[var(--color-text-main)]">
                Start with the problem your visitor already has.
              </h2>
              <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                The journal is intentionally small: fewer posts, stronger intent, and topics that help Moroccan brands earn trust faster.
              </p>
            </aside>

            <div>
              <Link href={`/${locale}/blog/${featuredPost.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-[var(--color-accent-warm)]">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 62vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,246,242,0)_35%,rgba(24,42,28,0.42)_100%)]" aria-hidden="true" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 text-white">
                    <span className="text-mono">Latest</span>
                    <ArrowUpRight size={24} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-6">
                  <ArticleMeta post={featuredPost} />
                  <h3 className="mt-4 max-w-4xl font-display text-[clamp(1.9rem,3vw,3.55rem)] leading-[0.98] text-[var(--color-text-main)] transition-colors duration-500 group-hover:text-[var(--color-primary)]">
                    {featuredPost.title}
                  </h3>
                  <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-[var(--color-text-secondary)]">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-14 md:px-16 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-end justify-between gap-8">
            <p className="text-mono text-[var(--color-primary)]">All notes</p>
            <p className="hidden max-w-sm text-right text-sm leading-relaxed text-[var(--color-text-muted)] md:block">
              Built for scanning first, reading second, and taking action when the idea fits your business.
            </p>
          </div>
          {otherPosts.map((post, index) => (
            <StoryLink key={post.slug} post={post} locale={locale} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-16 md:px-16 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-lg border border-[rgba(58,90,64,0.16)] bg-[var(--color-primary)] p-7 text-white md:grid-cols-[0.68fr_0.32fr] md:p-10 lg:p-12">
          <div>
            <p className="text-mono mb-5 text-[var(--color-accent-sage)]">Need content that sells?</p>
            <h2 className="font-display max-w-4xl text-[clamp(2rem,3.4vw,3.9rem)] leading-[0.98]">
              Turn your expertise into pages people can find.
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-5 md:items-start">
            <p className="text-base font-light leading-relaxed text-white/72">
              We can shape your service pages, local SEO structure, and article ideas around real search intent.
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-3 bg-white px-5 py-4 text-mono text-[var(--color-primary)] transition-transform duration-300 hover:-translate-y-1"
            >
              Start a project
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
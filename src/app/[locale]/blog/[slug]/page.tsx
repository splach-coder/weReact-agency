import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from 'lucide-react';
import BlogShare from '@/components/BlogShare';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';
import { blogPosts } from '@/data/blog';
import { siteConfig } from '@/config/site';
import { routing } from '@/i18n/routing';
import { createPageMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return createPageMetadata({
    title: `${post.title} | WeReact Journal`,
    description: post.metaDescription || post.excerpt,
    path: `/${locale}/blog/${post.slug}`,
    image: post.image,
    locale,
    type: 'article',
    publishedTime: post.date,
    authors: [post.author],
  });
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogPosts.map((post) => ({
      locale,
      slug: post.slug,
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
    image: `${siteConfig.url}${post.image}`,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.business.legalName,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/images/logo.webp` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
  };

  return (
    <article className="min-h-screen bg-[var(--color-background-main)] px-4 pb-16 pt-28 text-[var(--color-primary)] md:px-6 md:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[1fr_0.82fr]">
        <OpsPanel className="p-6 md:p-10">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={15} />
            Journal index
          </Link>
          <div className="mt-7">
            <OpsBadge tone="success">{post.category}</OpsBadge>
            <h1 className="mt-7 text-4xl font-black uppercase leading-[0.9] tracking-normal md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">{post.excerpt}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {post.readTime}
            </span>
            <span className="flex items-center gap-2">
              <User size={14} />
              {post.author}
            </span>
          </div>
        </OpsPanel>

        <OpsPanel className="p-3">
          <div className="relative min-h-[360px] overflow-hidden rounded-[6px] border border-[var(--color-primary)]/12">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </OpsPanel>
      </header>

      <div className="mx-auto mt-10 grid max-w-[1400px] gap-6 lg:grid-cols-[minmax(0,1fr)_360px] md:mt-16">
        <OpsPanel className="p-6 md:p-10">
          <div
            className="greenops-article"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="mt-12 border-t border-[var(--color-primary)]/12 pt-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-[6px] border border-[var(--color-primary)]/12 bg-[var(--color-background-main)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em]">
                    #{tag}
                  </span>
                ))}
              </div>
              <BlogShare url={postUrl} title={post.title} variant="inline" />
            </div>
          </div>
        </OpsPanel>

        <aside className="grid h-fit gap-5">
          <OpsPanel className="p-5">
            <h2 className="text-2xl font-black uppercase leading-none">Latest briefings</h2>
            <div className="mt-6 grid gap-4">
              {otherPosts.map((item) => (
                <Link key={item.slug} href={`/${locale}/blog/${item.slug}`} className="group rounded-[6px] border border-[var(--color-primary)]/12 bg-[var(--color-background-main)] p-4 transition hover:bg-white">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{item.category}</p>
                  <h3 className="mt-2 text-base font-black uppercase leading-tight">{item.title}</h3>
                  <span className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
                    Read
                    <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </OpsPanel>
          <OpsPanel dark className="bg-[var(--color-primary)] p-6 text-white">
            <h2 className="text-3xl font-black uppercase leading-none">Need this thinking on your site?</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">Turn strategy into a fast, polished website with local and technical SEO foundations.</p>
            <Link
              href={`/${locale}/contact`}
              className="mt-6 inline-flex items-center gap-2 rounded-[6px] bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-primary)]"
            >
              Contact WeReact
              <ArrowRight size={14} />
            </Link>
          </OpsPanel>
        </aside>
      </div>
    </article>
  );
}

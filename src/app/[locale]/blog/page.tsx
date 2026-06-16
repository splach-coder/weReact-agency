import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { blogPosts } from '@/data/blog';
import OpsBadge from '@/components/greenops/OpsBadge';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'WeReact Journal | Web Design, SEO and Digital Growth in Morocco',
  description: 'Practical WeReact articles on website design, local SEO, tourism websites, performance, UX, and digital growth for Marrakech and Morocco businesses.',
  path: '/en/blog',
  image: '/images/blog/marrakech-web-design.png',
});

export default async function BlogListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const featured = blogPosts[0];

  return (
    <div className="min-h-screen bg-[var(--color-background-main)] px-4 pb-16 pt-28 text-[var(--color-primary)] md:px-6 md:pt-32">
      <section className="mx-auto max-w-[1400px]">
        <OpsPanel className="p-6 md:p-10">
          <OpsBadge tone="success">Journal / SEO knowledge feed</OpsBadge>
          <h1 className="mt-7 max-w-5xl text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl lg:text-8xl">
            Clear thinking for faster websites and stronger search.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Practical dispatches on local SEO, website design in Marrakech, tourism and hospitality sites in Morocco, performance, UX, and conversion.
          </p>
        </OpsPanel>
      </section>

      {featured && (
        <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
          <Link href={`/${locale}/blog/${featured.slug}`} className="group block">
            <OpsPanel className="p-3">
              <article className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
                <div className="relative min-h-[340px] overflow-hidden rounded-[6px] border border-[var(--color-primary)]/12">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col justify-between p-4 md:p-8">
                  <div>
                    <OpsBadge tone="warning">Featured briefing</OpsBadge>
                    <h2 className="mt-6 text-4xl font-black uppercase leading-[0.9] tracking-normal md:text-6xl">
                      {featured.title}
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)]">{featured.excerpt}</p>
                  </div>
                  <div className="mt-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.14em]">
                    Read briefing
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </OpsPanel>
          </Link>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-[1400px] md:mt-24">
        <SectionHeader
          eyebrow="All briefings"
          title={<>Browse the knowledge system.</>}
          copy="Each article is designed to answer a real business, search, design, or technical question."
          className="mb-10"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group block h-full">
              <OpsPanel className="h-full p-3">
                <article className="flex h-full flex-col">
                  <div className="relative aspect-[1.35/1] overflow-hidden rounded-[6px] border border-[var(--color-primary)]/12">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="grid flex-1 gap-5 p-4">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      <span className="text-[var(--color-primary)]">{post.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black uppercase leading-none transition group-hover:translate-x-1">{post.title}</h2>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">{post.excerpt}</p>
                  </div>
                </article>
              </OpsPanel>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

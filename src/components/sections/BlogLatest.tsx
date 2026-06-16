'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ArrowRight, Clock } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import OpsPanel from '@/components/greenops/OpsPanel';
import SectionHeader from '@/components/greenops/SectionHeader';

export default function BlogLatest() {
  const locale = useLocale();
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Knowledge feed"
            title={<>Briefings for faster, clearer websites.</>}
            copy="Practical notes on performance, design, SEO, local visibility, and conversion."
          />
          <Link
            href={`/${locale}/blog`}
            className="inline-flex w-fit items-center gap-3 rounded-[6px] border border-[var(--color-primary)]/18 bg-white/70 px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]"
          >
            Journal index
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {latestPosts.map((post, index) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group block h-full">
              <OpsPanel className="h-full p-3">
                <article className="flex h-full flex-col">
                  <div className="relative aspect-[1.35/1] overflow-hidden rounded-[6px] border border-[var(--color-primary)]/12">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      priority={index === 0}
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
                    <h3 className="text-2xl font-black uppercase leading-none text-[var(--color-primary)] transition group-hover:translate-x-1">
                      {post.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">{post.excerpt}</p>
                  </div>
                </article>
              </OpsPanel>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

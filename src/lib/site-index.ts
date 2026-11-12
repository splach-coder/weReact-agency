import { siteConfig } from '@/config/site';
import { serviceLandingPages, servicePricing, type ServicePricingTier } from '@/data/services';
import { audienceLandingPages } from '@/data/audiences';
import { projects, type Project } from '@/data/projects';
import { blogPosts, getLocalizedPost } from '@/data/blog';
import { freeTools } from '@/data/tools';
import { getAboutCopy } from '@/data/about';
import { getBlogUi } from '@/data/blog-ui';
import { stripInlineLinks } from '@/lib/inline-links';

/**
 * One index of the public site, built from the data modules. The HTML sitemap
 * (/[locale]/sitemap), the AI info page (/[locale]/ai-info) and /llms.txt all
 * read from here, so a new service, case study or guide shows up everywhere
 * without anyone editing a list by hand.
 */

export type Language = 'en' | 'fr';
export const toLanguage = (locale: string): Language => (locale === 'fr' ? 'fr' : 'en');

/**
 * Date the business facts on the AI info page (siteConfig: address, phone,
 * hours, profiles) were last checked. Bump it when you change those facts; the
 * page's "last updated" date is this or the newest content date, whichever is later.
 */
export const FACT_SHEET_REVIEWED_AT = '2026-11-10';

/** Newest `modifiedAt` across services, audiences, case studies and guides (or the fact review date). */
export function getContentLastModified(): string {
  const dates = [
    FACT_SHEET_REVIEWED_AT,
    ...serviceLandingPages.map((page) => page.modifiedAt),
    ...audienceLandingPages.map((page) => page.modifiedAt),
    ...projects.map((project) => project.modifiedAt),
    ...blogPosts.map((post) => post.modifiedAt),
    ...freeTools.map((tool) => tool.modifiedAt),
  ];
  return dates.reduce((latest, date) => (date > latest ? date : latest));
}

export function formatDate(isoDate: string, locale: string) {
  return new Intl.DateTimeFormat(toLanguage(locale) === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export const pageTitles = {
  sitemap: { en: 'Sitemap', fr: 'Plan du site' },
  aiInfo: { en: 'Information for AI assistants', fr: 'Informations pour les assistants IA' },
} as const;

export const absoluteUrl = (path: string) => `${siteConfig.url}${path}`;

/* ----------------------------------------------------------------------------
 * Case-study relationship, stated the same way as on the case-study pages.
 * ------------------------------------------------------------------------- */

export const relationshipCopy: Record<Project['relationship'], Record<Language, { label: string; explanation: string }>> = {
  'client-work': {
    en: { label: 'Client work', explanation: 'Built by WeReact for a client.' },
    fr: { label: 'Projet client', explanation: 'Réalisé par WeReact pour un client.' },
  },
  'studio-owned': {
    en: { label: 'WeReact studio project', explanation: 'One of WeReact’s own websites, owned by the studio. Not client work.' },
    fr: { label: 'Projet du studio WeReact', explanation: 'Un site appartenant à WeReact. Ce n’est pas un projet client.' },
  },
  'independent-project': {
    en: { label: 'Independent project', explanation: 'Not client work, and not one of the studio-owned sites.' },
    fr: { label: 'Projet indépendant', explanation: 'Ni un projet client, ni un site appartenant au studio.' },
  },
};

/* ----------------------------------------------------------------------------
 * Pricing
 * ------------------------------------------------------------------------- */

/** "from 2,000 MAD" / "à partir de 2 000 MAD", or the quote wording when the tier has no price. */
export function formatTierPrice(tier: ServicePricingTier, locale: string) {
  const language = toLanguage(locale);
  if (tier.fromMad === null) return language === 'fr' ? 'sur devis' : 'on quote';
  const amount = tier.fromMad.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US');
  return language === 'fr' ? `à partir de ${amount} MAD` : `from ${amount} MAD`;
}

export function getPricing(locale: string) {
  const pricing = servicePricing[toLanguage(locale)];
  return {
    ...pricing,
    tiers: pricing.tiers.map((tier) => ({ ...tier, price: formatTierPrice(tier, locale) })),
  };
}

/* ----------------------------------------------------------------------------
 * Sitemap sections
 * ------------------------------------------------------------------------- */

export type SiteLink = {
  /** Locale-prefixed path, e.g. `/fr/web-design-marrakech`. */
  href: string;
  title: string;
  description?: string;
  /** Short context line (relationship, category, date). */
  meta?: string;
};

export type SiteSectionId = 'services' | 'audiences' | 'work' | 'guides' | 'tools' | 'company';

export type SiteSection = {
  id: SiteSectionId;
  title: string;
  links: SiteLink[];
};

const sectionTitles: Record<SiteSectionId, Record<Language, string>> = {
  services: { en: 'Services', fr: 'Services' },
  audiences: { en: 'Who we work with', fr: 'Pour qui nous travaillons' },
  work: { en: 'Case studies', fr: 'Études de cas' },
  guides: { en: 'Guides', fr: 'Guides' },
  tools: { en: 'Free tools', fr: 'Outils gratuits' },
  company: { en: 'Company', fr: 'L’agence' },
};

export function getServiceLinks(locale: string): SiteLink[] {
  const language = toLanguage(locale);
  return serviceLandingPages.map((page) => ({
    href: `/${language}/${page.slug}`,
    title: page.copy[language].title,
    description: stripInlineLinks(page.copy[language].description),
  }));
}

export function getAudienceLinks(locale: string): SiteLink[] {
  const language = toLanguage(locale);
  return audienceLandingPages.map((page) => ({
    href: `/${language}/${page.slug}`,
    title: page.copy[language].title,
    description: stripInlineLinks(page.copy[language].description),
  }));
}

export function getCaseStudyLinks(locale: string): SiteLink[] {
  const language = toLanguage(locale);
  return projects.map((project) => ({
    href: `/${language}/work/${project.id}`,
    title: project.title,
    description: language === 'fr' ? project.summaryFr : project.summary,
    meta: relationshipCopy[project.relationship][language].label,
  }));
}

export function getGuideLinks(locale: string): SiteLink[] {
  const language = toLanguage(locale);
  return blogPosts.map((basePost) => {
    const post = getLocalizedPost(basePost, language);
    return {
      href: `/${language}/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      meta: post.category,
    };
  });
}

export function getToolLinks(locale: string): SiteLink[] {
  const language = toLanguage(locale);
  return freeTools.map((tool) => ({
    href: `/${language}/outils/${tool.slug}`,
    title: tool.copy[language].title,
    description: tool.copy[language].summary,
  }));
}

export function getCompanyLinks(locale: string): SiteLink[] {
  const language = toLanguage(locale);
  const isFr = language === 'fr';
  return [
    { href: `/${language}`, title: isFr ? 'Accueil' : 'Home' },
    { href: `/${language}/about`, title: getAboutCopy(language).title },
    { href: `/${language}/contact`, title: isFr ? 'Contact et devis' : 'Contact and quote' },
    { href: `/${language}/book`, title: isFr ? 'Réserver un appel' : 'Book a call' },
    { href: `/${language}/ai-info`, title: pageTitles.aiInfo[language] },
  ];
}

/** Every public page, grouped. Index pages (work, blog) lead their group. */
export function getSitemapSections(locale: string): SiteSection[] {
  const language = toLanguage(locale);
  const isFr = language === 'fr';
  const title = (id: SiteSectionId) => sectionTitles[id][language];

  return [
    { id: 'services', title: title('services'), links: getServiceLinks(language) },
    { id: 'audiences', title: title('audiences'), links: getAudienceLinks(language) },
    {
      id: 'work',
      title: title('work'),
      links: [
        { href: `/${language}/work`, title: isFr ? 'Toutes les réalisations' : 'All work' },
        ...getCaseStudyLinks(language),
      ],
    },
    {
      id: 'guides',
      title: title('guides'),
      links: [
        { href: `/${language}/blog`, title: getBlogUi(language).journal },
        ...getGuideLinks(language),
      ],
    },
    { id: 'tools', title: title('tools'), links: getToolLinks(language) },
    { id: 'company', title: title('company'), links: getCompanyLinks(language) },
  ];
}

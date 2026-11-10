import { siteConfig } from '@/config/site';
import { getAboutCopy } from '@/data/about';
import { projects } from '@/data/projects';
import { getAreaName } from '@/lib/entities';
import { stripInlineLinks } from '@/lib/inline-links';
import {
  absoluteUrl,
  getAudienceLinks,
  getContentLastModified,
  getGuideLinks,
  getPricing,
  getServiceLinks,
  pageTitles,
  relationshipCopy,
  type SiteLink,
} from '@/lib/site-index';

/** Collapse whitespace and drop inline-link markup so each list item stays on one line. */
const oneLine = (text: string) => stripInlineLinks(text).replace(/\s+/g, ' ').trim();

/** `- [Title](https://…/en/page): description (French: https://…/fr/page)` */
function linkItem(link: SiteLink, note?: string) {
  const frenchHref = link.href.replace(/^\/en(?=\/|$)/, '/fr');
  const description = note ?? link.description;
  const french = `(French: ${absoluteUrl(frenchHref)})`;
  return `- [${oneLine(link.title)}](${absoluteUrl(link.href)}): ${description ? `${oneLine(description)} ` : ''}${french}`;
}

/**
 * /llms.txt in the llmstxt.org format (H1, blockquote summary, H2 sections of
 * markdown links), generated from the same data as the site so it cannot drift.
 * English, with the French URL of each page alongside.
 */
export function buildLlmsTxt(): string {
  const business = siteConfig.business;
  const about = getAboutCopy('en');
  const pricing = getPricing('en');
  const location = `${business.addressDisplay}, ${business.region}, Morocco`;
  const instagram = business.sameAs.find((url) => url.includes('instagram.com'));
  const facebook = business.sameAs.find((url) => url.includes('facebook.com'));
  const googleBusinessProfile = business.sameAs.find((url) => url.includes('maps.google.com'));

  const lines: string[] = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    about.lead,
    '',
    `- Location: ${location}`,
    `- Working languages: ${siteConfig.seo.languages.join(', ')}`,
    `- Areas served: ${business.areaServed.map((area) => getAreaName(area, 'en')).join(', ')}`,
    `- Fact sheet for AI assistants: ${absoluteUrl('/en/ai-info')} (French: ${absoluteUrl('/fr/ai-info')})`,
    `- Last updated: ${getContentLastModified()}`,
    '',
    '## Pricing',
    '',
    ...pricing.tiers.map((tier) =>
      tier.fromMad === null ? `- ${tier.name}: ${oneLine(tier.note)}` : `- ${tier.name}: ${tier.price} (${oneLine(tier.note)})`,
    ),
    `- ${oneLine(pricing.footnote)}`,
    `- ${oneLine(pricing.lead)}`,
    '',
    '## Services',
    '',
    ...getServiceLinks('en').map((link) => linkItem(link)),
    '',
    '## Audience paths',
    '',
    ...getAudienceLinks('en').map((link) => linkItem(link)),
    '',
    '## About and work',
    '',
    linkItem(
      { href: '/en/ai-info', title: pageTitles.aiInfo.en },
      'Plain fact sheet: location, languages, areas served, starting prices, contact, official profiles, and case studies.',
    ),
    linkItem({ href: '/en/about', title: about.title, description: about.description }),
    linkItem({ href: '/en/work', title: 'Case studies' }, `${projects.length} published case studies.`),
    ...projects.map((project) => {
      const relationship = relationshipCopy[project.relationship].en;
      return linkItem(
        { href: `/en/work/${project.id}`, title: project.title },
        `${relationship.label}. ${relationship.explanation} ${project.summary} Live site: ${project.externalUrl}`,
      );
    }),
    linkItem({ href: '/en/book', title: 'Book a call' }, '30-minute call on Google Meet, in French or English.'),
    '',
    '## Guides',
    '',
    ...getGuideLinks('en').map((link) => linkItem(link)),
    '',
    '## Contact',
    '',
    `- Location: ${location}`,
    `- WhatsApp and phone: ${business.phoneDisplay}`,
    `- Email: ${business.email}`,
    `- Hours: ${business.hoursDisplay}`,
    linkItem({ href: '/en/contact', title: 'Contact form' }, 'Project enquiries and quote requests.'),
    ...(googleBusinessProfile ? [`- [Google Business Profile](${googleBusinessProfile}): verified listing`] : []),
    ...(instagram ? [`- [Instagram](${instagram})`] : []),
    ...(facebook ? [`- [Facebook](${facebook})`] : []),
    '',
    '## Sitemap',
    '',
    `- [XML sitemap](${absoluteUrl('/sitemap.xml')})`,
    linkItem({ href: '/en/sitemap', title: pageTitles.sitemap.en }, 'Every page, grouped by topic.'),
    '',
  ];

  return lines.join('\n');
}

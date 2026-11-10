import { siteConfig } from '@/config/site';
import { projects } from './projects';

export const clientProjectCount = projects.filter((project) => project.relationship === 'client-work').length;
const projectCount = projects.length;
const sectorCount = new Set(projects.map((project) => project.category)).size;

export type AboutCopy = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  factsTitle: string;
  facts: readonly { label: string; value: string }[];
  sections: readonly { heading: string; body: readonly string[] }[];
  howWeWorkTitle: string;
  howWeWork: readonly string[];
  ctaTitle: string;
  cta: string;
};

export function getAboutCopy(locale: string): AboutCopy {
  return locale === 'fr'
    ? {
        title: 'À propos de WeReact',
        description: `Studio web basé à Marrakech. ${projectCount} projets livrés pour le tourisme, l'hôtellerie et les entreprises locales au Maroc.`,
        eyebrow: 'Le studio',
        heading: 'Un studio web à Marrakech, concentré sur un seul résultat : des demandes clients.',
        lead: 'WeReact conçoit et développe des sites rapides, bilingues et prêts pour le SEO. Nous travaillons surtout avec le tourisme, l’hôtellerie et les entreprises locales au Maroc — des secteurs où la confiance se gagne sur mobile, en quelques secondes.',
        factsTitle: 'Les faits',
        facts: [
          { label: 'Basé à', value: `${siteConfig.business.city}, Maroc` },
          { label: 'Projets publiés', value: String(projectCount) },
          { label: 'Secteurs couverts', value: String(sectorCount) },
          { label: 'Langues de travail', value: 'Français, anglais' },
          { label: 'Site vitrine', value: 'à partir de 3 500 MAD' },
          { label: 'Délai de réponse', value: 'un jour ouvré' },
        ],
        sections: [
          {
            heading: 'Ce que nous faisons',
            body: [
              'Nous créons des sites vitrines, des boutiques en ligne, des landing pages et des sites de réservation pour le tourisme. Chaque projet inclut des fondations SEO concrètes : structure de page propre, métadonnées, données structurées, sitemap et performance mobile.',
              'Nous ne vendons pas de retainer marketing ni de gestion de réseaux sociaux. Nous construisons le site, nous le rendons rapide et trouvable, et nous vous en laissons la propriété complète.',
            ],
          },
          {
            heading: 'Pourquoi Marrakech',
            body: [
              'Marrakech est un marché où le web compte plus qu’ailleurs : un riad, une agence d’excursions ou un restaurant se fait juger sur son site avant même la première visite, souvent depuis un mobile, souvent en deux langues.',
              'Travailler ici nous a appris ce que les voyageurs et les clients locaux cherchent réellement avant de contacter une entreprise : des prix clairs, des preuves visibles, et un moyen de contact immédiat.',
            ],
          },
          {
            heading: 'Notre transparence sur les prix',
            body: [
              'Nos tarifs de départ sont publiés sur le site : à partir de 3 500 MAD pour un site vitrine, 6 000 MAD pour un e-commerce. Le marché web marocain est souvent opaque sur ce point ; nous préférons annoncer un point de départ honnête puis cadrer un devis précis.',
            ],
          },
        ],
        howWeWorkTitle: 'Comment se déroule un projet',
        howWeWork: [
          'Vous décrivez votre activité, votre objectif et votre audience.',
          'Nous cadrons le périmètre et envoyons un devis précis et gratuit sous un jour ouvré.',
          'Nous construisons le site et partagez des aperçus pendant l’avancement.',
          'Mise en ligne, transfert de propriété, et suivi disponible si besoin.',
        ],
        ctaTitle: 'Parlons de votre projet.',
        cta: 'Demander un devis gratuit',
      }
    : {
        title: 'About WeReact',
        description: `Marrakech-based web studio. ${projectCount} projects delivered for tourism, hospitality, and local businesses across Morocco.`,
        eyebrow: 'The studio',
        heading: 'A Marrakech web studio focused on one outcome: client enquiries.',
        lead: 'WeReact designs and builds fast, bilingual, SEO-ready websites. We work mostly with tourism, hospitality, and local businesses across Morocco — sectors where trust is won on a phone screen in a matter of seconds.',
        factsTitle: 'The facts',
        facts: [
          { label: 'Based in', value: `${siteConfig.business.city}, Morocco` },
          { label: 'Published projects', value: String(projectCount) },
          { label: 'Sectors covered', value: String(sectorCount) },
          { label: 'Working languages', value: 'French, English' },
          { label: 'Showcase website', value: 'from 3,500 MAD' },
          { label: 'Reply time', value: 'one business day' },
        ],
        sections: [
          {
            heading: 'What we do',
            body: [
              'We build showcase websites, online stores, landing pages, and tourism booking sites. Every project includes practical SEO foundations: clean page structure, metadata, structured data, sitemap support, and mobile performance.',
              'We do not sell marketing retainers or social media management. We build the site, make it fast and findable, and hand you full ownership.',
            ],
          },
          {
            heading: 'Why Marrakech',
            body: [
              'Marrakech is a market where the website carries unusual weight: a riad, a tour operator, or a restaurant gets judged on its site before anyone arrives — usually on a phone, often in two languages.',
              'Working here taught us what travellers and local customers actually look for before contacting a business: clear prices, visible proof, and an immediate way to get in touch.',
            ],
          },
          {
            heading: 'Where we stand on pricing',
            body: [
              'Our starting prices are published on the site: from 3,500 MAD for a showcase website, from 6,000 MAD for e-commerce. The Moroccan web market is often opaque about cost; we would rather state an honest starting point and then scope a precise quote.',
            ],
          },
        ],
        howWeWorkTitle: 'How a project runs',
        howWeWork: [
          'You describe your business, your goal, and your audience.',
          'We scope the work and send a precise, free quote within one business day.',
          'We build the site, sharing previews as it takes shape.',
          'Launch, ownership handover, and ongoing care if you want it.',
        ],
        ctaTitle: 'Let’s talk about your project.',
        cta: 'Request a free quote',
      };
}

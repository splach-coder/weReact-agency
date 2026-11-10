/**
 * External identifiers for the places and topics WeReact's structured data
 * refers to. Every Wikidata ID below was looked up with the Wikidata API
 * (wbsearchentities, then wbgetentities to confirm the "instance of" claim and
 * the English / French Wikipedia sitelinks) on 2026-11-10. Do not add an ID
 * from memory: look it up, confirm it, and note it in docs/seo/entity-map.html.
 */

export type WikidataId = `Q${number}`;

export type AreaEntity = {
  type: 'City' | 'Country';
  /** English name, as used in the JSON-LD. */
  name: string;
  /** French display name (the French Wikipedia / Wikidata label). */
  nameFr: string;
  wikidata: WikidataId;
  wikipedia: string;
  wikipediaFr: string;
};

/**
 * Keyed by the names used in `siteConfig.business.areaServed`. Names without an
 * entry here (e.g. "International") are not places and stay plain text.
 */
export const areaEntities: Readonly<Record<string, AreaEntity>> = {
  // Q101625: instance of "big city", country Morocco.
  Marrakech: {
    type: 'City',
    name: 'Marrakech',
    nameFr: 'Marrakech',
    wikidata: 'Q101625',
    wikipedia: 'https://en.wikipedia.org/wiki/Marrakesh',
    wikipediaFr: 'https://fr.wikipedia.org/wiki/Marrakech',
  },
  // Q7903: instance of "city", country Morocco (not the 1942 film, Q132689).
  Casablanca: {
    type: 'City',
    name: 'Casablanca',
    nameFr: 'Casablanca',
    wikidata: 'Q7903',
    wikipedia: 'https://en.wikipedia.org/wiki/Casablanca',
    wikipediaFr: 'https://fr.wikipedia.org/wiki/Casablanca',
  },
  // Q3551: instance of "city" / "national capital", country Morocco (not Rabat, Malta).
  Rabat: {
    type: 'City',
    name: 'Rabat',
    nameFr: 'Rabat',
    wikidata: 'Q3551',
    wikipedia: 'https://en.wikipedia.org/wiki/Rabat',
    wikipediaFr: 'https://fr.wikipedia.org/wiki/Rabat',
  },
  // Q170525: instance of "city" / "urban commune of Morocco".
  Agadir: {
    type: 'City',
    name: 'Agadir',
    nameFr: 'Agadir',
    wikidata: 'Q170525',
    wikipedia: 'https://en.wikipedia.org/wiki/Agadir',
    wikipediaFr: 'https://fr.wikipedia.org/wiki/Agadir',
  },
  // Q80985: instance of "city", country Morocco. The site spells it "Fes";
  // English Wikipedia uses "Fez".
  Fes: {
    type: 'City',
    name: 'Fes',
    nameFr: 'Fès',
    wikidata: 'Q80985',
    wikipedia: 'https://en.wikipedia.org/wiki/Fez,_Morocco',
    wikipediaFr: 'https://fr.wikipedia.org/wiki/F%C3%A8s',
  },
  // Q126148: instance of "city" / "big city". Not Q817275, which is the rural
  // commune Bni Chiker that is also labelled "Tangier" in English.
  Tangier: {
    type: 'City',
    name: 'Tangier',
    nameFr: 'Tanger',
    wikidata: 'Q126148',
    wikipedia: 'https://en.wikipedia.org/wiki/Tangier',
    wikipediaFr: 'https://fr.wikipedia.org/wiki/Tanger',
  },
  // Q1028: instance of "country" / "sovereign state".
  Morocco: {
    type: 'Country',
    name: 'Morocco',
    nameFr: 'Maroc',
    wikidata: 'Q1028',
    wikipedia: 'https://en.wikipedia.org/wiki/Morocco',
    wikipediaFr: 'https://fr.wikipedia.org/wiki/Maroc',
  },
};

export type TopicEntity = {
  name: string;
  wikidata?: WikidataId;
  wikipedia?: string;
  wikipediaFr?: string;
};

/**
 * What the business knows about, for `knowsAbout`. Each topic matches a service
 * or page the site already offers. Topics without a verified Wikidata item
 * stay plain text.
 */
export const knowsAboutTopics: readonly TopicEntity[] = [
  { name: 'Web design', wikidata: 'Q190637', wikipedia: 'https://en.wikipedia.org/wiki/Web_design', wikipediaFr: 'https://fr.wikipedia.org/wiki/Conception_de_site_web' },
  { name: 'Web development', wikidata: 'Q386275', wikipedia: 'https://en.wikipedia.org/wiki/Web_development', wikipediaFr: 'https://fr.wikipedia.org/wiki/Programmation_web' },
  { name: 'Responsive web design', wikidata: 'Q420295', wikipedia: 'https://en.wikipedia.org/wiki/Responsive_web_design', wikipediaFr: 'https://fr.wikipedia.org/wiki/Site_web_r%C3%A9actif' },
  { name: 'Search engine optimization', wikidata: 'Q180711', wikipedia: 'https://en.wikipedia.org/wiki/Search_engine_optimization', wikipediaFr: 'https://fr.wikipedia.org/wiki/Optimisation_pour_les_moteurs_de_recherche' },
  { name: 'Local search engine optimization', wikidata: 'Q30324357', wikipedia: 'https://en.wikipedia.org/wiki/Local_search_engine_optimisation' },
  { name: 'Landing page', wikidata: 'Q1494741', wikipedia: 'https://en.wikipedia.org/wiki/Landing_page', wikipediaFr: 'https://fr.wikipedia.org/wiki/Page_de_renvoi' },
  { name: 'E-commerce', wikidata: 'Q484847', wikipedia: 'https://en.wikipedia.org/wiki/E-commerce', wikipediaFr: 'https://fr.wikipedia.org/wiki/Commerce_en_ligne' },
  { name: 'Search engine marketing', wikidata: 'Q846132', wikipedia: 'https://en.wikipedia.org/wiki/Search_engine_marketing', wikipediaFr: 'https://fr.wikipedia.org/wiki/Search_engine_marketing' },
  { name: 'Google Ads', wikidata: 'Q271982', wikipedia: 'https://en.wikipedia.org/wiki/Google_Ads', wikipediaFr: 'https://fr.wikipedia.org/wiki/Google_Ads' },
  { name: 'Conversion rate optimization', wikidata: 'Q52083677', wikipedia: 'https://en.wikipedia.org/wiki/Conversion_rate_optimization' },
  { name: 'Web analytics', wikidata: 'Q10719477', wikipedia: 'https://en.wikipedia.org/wiki/Web_analytics', wikipediaFr: 'https://fr.wikipedia.org/wiki/Audience_d%27un_site_web' },
  { name: 'Website localization', wikidata: 'Q7978836', wikipedia: 'https://en.wikipedia.org/wiki/Website_localization' },
  // Wikidata item exists, but there is no English or French Wikipedia article.
  { name: 'Website maintenance', wikidata: 'Q17634596' },
  // No matching Wikidata item: plain text.
  { name: 'Tourism and hospitality websites' },
];

export function wikidataUrl(id: WikidataId) {
  return `https://www.wikidata.org/wiki/${id}`;
}

/** Wikidata, then English and French Wikipedia, for `sameAs`. */
export function entitySameAs(entity: { wikidata?: WikidataId; wikipedia?: string; wikipediaFr?: string }) {
  return [
    ...(entity.wikidata ? [wikidataUrl(entity.wikidata)] : []),
    ...(entity.wikipedia ? [entity.wikipedia] : []),
    ...(entity.wikipediaFr ? [entity.wikipediaFr] : []),
  ];
}

/** The area's display name in the given locale; unknown areas keep their configured name. */
export function getAreaName(area: string, locale: string) {
  const entity = areaEntities[area];
  if (!entity) return area;
  return locale === 'fr' ? entity.nameFr : entity.name;
}

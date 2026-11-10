import assert from 'node:assert/strict';
import test from 'node:test';
import { getServiceLandingPage, serviceLandingPages, servicePricing } from '@/data/services';
import { getAudienceLandingPage } from '@/data/audiences';
import { getProjectById } from '@/data/projects';
import { blogPosts, getLocalizedPost } from '@/data/blog';
import { siteConfig } from '@/config/site';
import {
  ENTITY_IDS,
  createAboutPageJsonLd,
  createBlogPostingJsonLd,
  createBusinessJsonLd,
  createFaqJsonLd,
  createLocalizedAlternates,
  createPricingJsonLd,
  createProjectJsonLd,
  createServiceJsonLd,
  createServicePageJsonLd,
  createWebPageJsonLd,
  createWebsiteJsonLd,
} from './seo';

const BUSINESS_ID = 'https://www.wereact.agency/#business';

test('creates a localized Service schema for a landing page', () => {
  const page = getServiceLandingPage('web-design-marrakech');
  assert.ok(page);
  const schema = createServicePageJsonLd(page, 'fr');
  assert.equal(schema['@type'], 'Service');
  assert.equal(schema.url, 'https://www.wereact.agency/fr/web-design-marrakech');
});

test('creates FAQPage schema from factual page answers', () => {
  const page = getServiceLandingPage('seo-landing-pages');
  assert.ok(page);
  const schema = createFaqJsonLd(page.copy.en.faqs);
  assert.equal(schema['@type'], 'FAQPage');
  assert.equal(schema.mainEntity.length, page.copy.en.faqs.length);
});

test('FAQPage schema never carries inline link markup', () => {
  const schema = createFaqJsonLd([
    { question: 'What does it cost?', answer: 'See the [pricing guide](/en/blog/combien-coute-site-web-maroc) first.' },
  ]);
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, 'See the pricing guide first.');
});

test('uses a final English URL as x-default', () => {
  const alternates = createLocalizedAlternates('/blog');
  assert.equal(alternates.en, 'https://www.wereact.agency/en/blog');
  assert.equal(alternates.fr, 'https://www.wereact.agency/fr/blog');
  assert.equal(alternates['x-default'], 'https://www.wereact.agency/en/blog');
});

test('creates factual CreativeWork schema without review claims', () => {
  const project = getProjectById('flying-tandem');
  assert.ok(project);
  const schema = createProjectJsonLd(project, 'en');
  assert.equal(schema['@type'], 'CreativeWork');
  assert.equal(schema.creator['@id'], 'https://www.wereact.agency/#business');
  assert.equal(schema.url, 'https://www.wereact.agency/en/work/flying-tandem');
  assert.ok(!('review' in schema));
  assert.ok(!('aggregateRating' in schema));
});

test('uses stable business and website identifiers', () => {
  const business = createBusinessJsonLd();
  const website = createWebsiteJsonLd();
  assert.equal(business['@id'], 'https://www.wereact.agency/#business');
  assert.equal(website.publisher['@id'], business['@id']);
  assert.equal(website.about['@id'], business['@id']);
  assert.equal(business.email, 'hello@wereact.agency');
});

test('keeps the entity identifiers stable', () => {
  assert.deepEqual(ENTITY_IDS, {
    business: 'https://www.wereact.agency/#business',
    website: 'https://www.wereact.agency/#website',
    logo: 'https://www.wereact.agency/#logo',
  });
});

test('declares the logo once, as an ImageObject with its own @id', () => {
  const business = createBusinessJsonLd();
  assert.equal(business.logo['@type'], 'ImageObject');
  assert.equal(business.logo['@id'], 'https://www.wereact.agency/#logo');
  assert.equal(business.logo.url, 'https://www.wereact.agency/images/logo.webp');
});

test('describes served areas as cities and a country linked to Wikidata', () => {
  const business = createBusinessJsonLd();
  const marrakech = business.areaServed.find((area) => typeof area === 'object' && area.name === 'Marrakech');
  assert.ok(marrakech && typeof marrakech === 'object');
  assert.equal(marrakech['@type'], 'City');
  assert.ok(marrakech.sameAs.includes('https://www.wikidata.org/wiki/Q101625'));
  assert.ok(marrakech.sameAs.includes('https://en.wikipedia.org/wiki/Marrakesh'));

  const morocco = business.areaServed.find((area) => typeof area === 'object' && area.name === 'Morocco');
  assert.ok(morocco && typeof morocco === 'object');
  assert.equal(morocco['@type'], 'Country');
  assert.ok(morocco.sameAs.includes('https://www.wikidata.org/wiki/Q1028'));

  // Every configured area is represented; "International" is not a place and stays text.
  assert.equal(business.areaServed.length, siteConfig.business.areaServed.length);
  assert.ok(business.areaServed.includes('International'));
});

test('lists knowsAbout topics as Things with Wikidata links, plain text otherwise', () => {
  const business = createBusinessJsonLd();
  const seo = business.knowsAbout.find((topic) => typeof topic === 'object' && topic.name === 'Search engine optimization');
  assert.ok(seo && typeof seo === 'object');
  assert.equal(seo['@type'], 'Thing');
  assert.ok(seo.sameAs.includes('https://www.wikidata.org/wiki/Q180711'));
  for (const topic of business.knowsAbout) {
    if (typeof topic === 'object') assert.ok(topic.sameAs.every((url) => url.startsWith('https://')));
  }
});

test('keeps the verified profiles and map, and adds no unverifiable claims', () => {
  const business = createBusinessJsonLd();
  assert.ok(business.sameAs.includes('https://maps.google.com/?cid=906947470338054436'));
  assert.equal(business.hasMap, siteConfig.business.googleMapsUrl);
  for (const key of ['founder', 'employee', 'review', 'aggregateRating', 'foundingDate']) {
    assert.ok(!(key in business), `business schema must not declare ${key}`);
  }
});

test('lists service landing pages in the business offer catalog by their @id', () => {
  const business = createBusinessJsonLd({ locale: 'fr', servicePages: serviceLandingPages });
  const offered = business.hasOfferCatalog.itemListElement.map((offer) => offer.itemOffered);
  assert.equal(offered.length, serviceLandingPages.length);
  const marrakech = offered.find((service) => 'url' in service && service.url === 'https://www.wereact.agency/fr/web-design-marrakech');
  assert.ok(marrakech && '@id' in marrakech);
  assert.equal(marrakech['@id'], 'https://www.wereact.agency/fr/web-design-marrakech#service');
  assert.equal(marrakech['@id'], createServicePageJsonLd(getServiceLandingPage('web-design-marrakech')!, 'fr')['@id']);
});

test('every other node references the business by @id instead of repeating it', () => {
  const service = getServiceLandingPage('web-design-marrakech');
  const audience = getAudienceLandingPage('website-design-moroccan-businesses');
  const studioProject = getProjectById('trust-drivers');
  assert.ok(service && audience && studioProject);
  const post = getLocalizedPost(blogPosts[0], 'fr');
  const pageUrl = 'https://www.wereact.agency/en/web-design-marrakech';

  const nodes = [
    createServiceJsonLd('en'),
    createServicePageJsonLd(service, 'en'),
    createServicePageJsonLd(audience, 'fr'),
    createPricingJsonLd(servicePricing.en.tiers, 'en', pageUrl)!,
    createProjectJsonLd(studioProject, 'en'),
    createBlogPostingJsonLd(post, 'fr'),
    createAboutPageJsonLd('en', 'About WeReact', 'About'),
    createWebPageJsonLd({ type: 'AboutPage', path: '/en/ai-info', name: 'AI info', description: 'Facts', locale: 'en' }),
  ];

  for (const node of nodes) {
    const json = JSON.stringify(node);
    assert.ok(json.includes(`{"@id":"${BUSINESS_ID}"}`), `${node['@type']} does not reference the business`);
    // The business address and phone live only in createBusinessJsonLd().
    assert.ok(!json.includes('PostalAddress'), `${node['@type']} repeats the business address`);
    assert.ok(!json.includes(siteConfig.business.email), `${node['@type']} repeats the business email`);
  }
});

test('links a priced service page to its pricing catalog', () => {
  const priced = getServiceLandingPage('web-design-marrakech');
  const unpriced = getServiceLandingPage('seo-landing-pages');
  assert.ok(priced && unpriced);
  const pricedSchema = createServicePageJsonLd(priced, 'en');
  assert.deepEqual('hasOfferCatalog' in pricedSchema && pricedSchema.hasOfferCatalog, { '@id': 'https://www.wereact.agency/en/web-design-marrakech#pricing' });
  assert.ok(!('hasOfferCatalog' in createServicePageJsonLd(unpriced, 'en')));
});

test('states studio ownership honestly on project schema', () => {
  const studio = createProjectJsonLd(getProjectById('trust-drivers')!, 'en');
  const client = createProjectJsonLd(getProjectById('flying-tandem')!, 'en');
  assert.equal(studio.copyrightHolder?.['@id'], BUSINESS_ID);
  assert.ok(!('copyrightHolder' in client));
});

test('creates a BlogPosting with the business as author and publisher', () => {
  const post = getLocalizedPost(blogPosts[0], 'fr');
  const schema = createBlogPostingJsonLd(post, 'fr');
  assert.equal(schema['@type'], 'BlogPosting');
  assert.equal(schema.url, `https://www.wereact.agency/fr/blog/${post.slug}`);
  assert.equal(schema.headline, blogPosts[0].fr?.title ?? blogPosts[0].title);
  assert.equal(schema.author['@id'], BUSINESS_ID);
  assert.equal(schema.publisher['@id'], BUSINESS_ID);
  assert.equal(schema.isPartOf['@id'], 'https://www.wereact.agency/#website');
});

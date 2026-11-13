import assert from 'node:assert/strict';
import test from 'node:test';
import { caseStudies, getCaseStudy } from './case-studies';
import { projects } from './projects';
import { serviceLandingPages } from './services';

test('every project has a case study, and every case study a project', () => {
  assert.deepEqual(
    caseStudies.map((study) => study.id).sort(),
    projects.map((project) => project.id).sort()
  );
});

test('French case studies carry their own French text, not the English copy', () => {
  for (const study of caseStudies) {
    const { en, fr } = study.copy;
    for (const field of ['tagline', 'description', 'challenge', 'solution'] as const) {
      assert.notEqual(fr[field], en[field], `${study.id}: ${field} is the same in both languages`);
    }
    assert.equal(fr.results.length, en.results.length, `${study.id}: results differ in length`);
    assert.equal(fr.features.length, 3, `${study.id}: the page shows three feature icons`);
    assert.equal(en.features.length, 3, `${study.id}: the page shows three feature icons`);
    assert.ok(fr.metrics.length >= 2 && en.metrics.length >= 2, `${study.id}: the hero needs two metrics`);
  }
});

test('each case study links to an existing service page', () => {
  const slugs = new Set(serviceLandingPages.map((page) => page.slug));
  for (const study of caseStudies) {
    assert.ok(slugs.has(study.serviceSlug as never), `${study.id} links to missing page ${study.serviceSlug}`);
  }
  assert.equal(getCaseStudy('not-a-project'), undefined);
});

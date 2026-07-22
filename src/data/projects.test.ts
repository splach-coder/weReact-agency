import assert from 'node:assert/strict';
import test from 'node:test';
import { projects } from './projects';

test('labels every project relationship and avoids unsupported metrics', () => {
  for (const project of projects) {
    assert.ok(['client-work', 'studio-owned', 'independent-project'].includes(project.relationship));
    assert.match(project.modifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(project.caseStudy.challenge.length > 30);
    assert.ok(project.externalUrl.startsWith('https://'));
    assert.doesNotMatch(project.metrics.map((metric) => metric.value).join(' '), /%/);
  }
});

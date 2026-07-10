#!/usr/bin/env node

/**
 * Schema Build Script
 *
 * Resolves cross-file $ref pointers in source schemas (schemas/src/) into
 * self-contained schemas (schemas/). Shared type definitions from
 * shared_types.json are inlined into each schema's $defs.
 *
 * Usage: node scripts/build-schemas.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'schemas', 'src');
const OUT_DIR = path.join(ROOT, 'schemas');
const SHARED_TYPES_FILE = 'shared_types.json';
const CROSS_REF_PATTERN = /^shared_types\.json#\/\$defs\/(.+)$/;

// ---------------------------------------------------------------------------
// 1. Read shared types
// ---------------------------------------------------------------------------

const sharedTypesPath = path.join(SRC_DIR, SHARED_TYPES_FILE);
if (!fs.existsSync(sharedTypesPath)) {
  console.error(`Error: ${sharedTypesPath} not found.`);
  process.exit(1);
}

const sharedTypes = JSON.parse(fs.readFileSync(sharedTypesPath, 'utf8'));
const sharedDefs = sharedTypes.$defs || {};

// ---------------------------------------------------------------------------
// 2. Discover source schemas
// ---------------------------------------------------------------------------

const sourceFiles = fs.readdirSync(SRC_DIR)
  .filter(f => f.endsWith('.json') && f !== SHARED_TYPES_FILE)
  .sort();

if (sourceFiles.length === 0) {
  console.error('Error: No source schemas found in ' + SRC_DIR);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 3. Build each schema
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Custom JSON formatter
//
// Matches v2 formatting conventions:
// - 2-space indent
// - Arrays of primitives rendered on a single line
// - Arrays of objects/arrays rendered multi-line
// - Empty objects {} on one line
// - Empty arrays [] on one line
// ---------------------------------------------------------------------------

function formatJson(value) {
  return formatValue(value, '') + '\n';
}

function formatValue(value, indent) {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return formatArray(value, indent);
  return formatObject(value, indent);
}

function formatArray(arr, indent) {
  if (arr.length === 0) return '[]';

  // If every element is a primitive, render on a single line.
  const allPrimitive = arr.every(el => el === null || typeof el !== 'object');
  if (allPrimitive) {
    return '[' + arr.map(el => formatValue(el, '')).join(', ') + ']';
  }

  // Otherwise render multi-line.
  const child = indent + '  ';
  const items = arr.map(el => child + formatValue(el, child));
  return '[\n' + items.join(',\n') + '\n' + indent + ']';
}

function formatObject(obj, indent) {
  const keys = Object.keys(obj);
  if (keys.length === 0) return '{}';

  const child = indent + '  ';
  const entries = keys.map(key => {
    return child + JSON.stringify(key) + ': ' + formatValue(obj[key], child);
  });
  return '{\n' + entries.join(',\n') + '\n' + indent + '}';
}

// ---------------------------------------------------------------------------
// 3. Build each schema
// ---------------------------------------------------------------------------

const errors = [];

for (const filename of sourceFiles) {
  const sourcePath = path.join(SRC_DIR, filename);
  const outputPath = path.join(OUT_DIR, filename);

  const schema = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  // Track which shared types are needed, in order of first encounter.
  const neededTypes = [];
  const seenTypes = new Set();

  /**
   * Walk a JSON tree, replacing cross-file $ref with local $ref and
   * recording which shared types are referenced.
   */
  function resolveRefs(obj) {
    if (obj === null || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      for (const item of obj) resolveRefs(item);
      return;
    }

    if (typeof obj.$ref === 'string') {
      const match = obj.$ref.match(CROSS_REF_PATTERN);
      if (match) {
        const typeName = match[1];
        obj.$ref = '#/$defs/' + typeName;
        if (!seenTypes.has(typeName)) {
          seenTypes.add(typeName);
          neededTypes.push(typeName);
        }
      }
    }

    for (const key of Object.keys(obj)) {
      if (key === '$ref') continue; // $ref is a string, not an object
      resolveRefs(obj[key]);
    }
  }

  // Walk the schema trees that may contain cross-file $ref.
  if (schema.input_schema) resolveRefs(schema.input_schema);
  if (schema.output_schema) resolveRefs(schema.output_schema);

  // Transitive resolution: shared types that reference other shared types.
  // Process the queue — new entries may be appended during iteration.
  let idx = 0;
  while (idx < neededTypes.length) {
    const typeName = neededTypes[idx];
    if (!sharedDefs[typeName]) {
      errors.push(filename + ': references "' + typeName + '" which does not exist in ' + SHARED_TYPES_FILE);
      idx++;
      continue;
    }
    // Deep clone and resolve cross-file $ref within the type definition.
    const clone = JSON.parse(JSON.stringify(sharedDefs[typeName]));
    resolveRefs(clone);
    idx++;
  }

  // Inject shared types into $defs.
  if (neededTypes.length > 0) {
    // Ensure $defs exists. If it already exists (e.g. empty {}), preserve it.
    if (!schema.$defs) {
      schema.$defs = {};
    }
    for (const typeName of neededTypes) {
      // Clone the canonical definition from shared_types.json.
      // Any cross-file $ref within it have already been resolved above,
      // but we clone fresh and resolve again to produce a clean copy.
      const typeDef = JSON.parse(JSON.stringify(sharedDefs[typeName]));
      resolveRefs(typeDef);
      schema.$defs[typeName] = typeDef;
    }
  }

  // Write the resolved schema.
  const output = formatJson(schema);
  fs.writeFileSync(outputPath, output, 'utf8');
}

// ---------------------------------------------------------------------------
// 4. Validate output
// ---------------------------------------------------------------------------

for (const filename of sourceFiles) {
  const outputPath = path.join(OUT_DIR, filename);
  const content = fs.readFileSync(outputPath, 'utf8');

  // Check 1: Valid JSON.
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    errors.push(filename + ': invalid JSON — ' + e.message);
    continue;
  }

  // Checks 2-3: No cross-file $ref remaining.
  if (content.includes('shared_types.json#')) {
    errors.push(filename + ': contains unresolved cross-file $ref');
  }

  // Check 4: Every local $ref resolves to a $defs entry.
  function checkLocalRefs(obj) {
    if (obj === null || typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      for (const item of obj) checkLocalRefs(item);
      return;
    }
    if (typeof obj.$ref === 'string') {
      const localMatch = obj.$ref.match(/^#\/\$defs\/(.+)$/);
      if (localMatch) {
        const typeName = localMatch[1];
        if (!parsed.$defs || !parsed.$defs[typeName]) {
          errors.push(filename + ': unresolved local $ref "#/$defs/' + typeName + '"');
        }
      }
    }
    for (const key of Object.keys(obj)) {
      if (key === '$ref') continue;
      checkLocalRefs(obj[key]);
    }
  }
  checkLocalRefs(parsed);
}

// ---------------------------------------------------------------------------
// 5. Report
// ---------------------------------------------------------------------------

if (errors.length > 0) {
  console.error('Build failed with ' + errors.length + ' error(s):');
  for (const err of errors) {
    console.error('  - ' + err);
  }
  process.exit(1);
}

console.log('Built ' + sourceFiles.length + ' schemas successfully.');
process.exit(0);

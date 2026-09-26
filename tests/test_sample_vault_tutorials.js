const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING LORD SPEY SAMPLE VAULT & TUTORIAL SUITE ===\n');

// 1. Mock LocalStorage & DOM
const mockLocalStorage = {};
global.localStorage = {
  getItem: k => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

// Load Storage & Markdown
const storageCode = fs.readFileSync(path.join(__dirname, '..', 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

const Markdown = require('../js/markdown.js');
global.Markdown = Markdown;

// Test 1: Starter Vault Initialization & Verification
console.log('--- 1. Verifying Starter Vault Completeness ---');
Storage.loadStarterVault();
const notes = Storage.getAllNotes();
assert.strictEqual(notes.length, 9, 'Starter vault must contain exactly 9 notes');

const prologue = notes.find(n => n.id === 'demo-chap-prologue');
const chap1 = notes.find(n => n.id === 'demo-chap-1');
assert(prologue, 'Prologue note must exist');
assert(chap1, 'Chapter 1 note must exist');

// Verify Chapter Formatting
console.log('Checking Chapter I formatting features:');
assert(chap1.body.includes('* * *'), 'Chapter I must contain scene breaks (* * *)');
assert(chap1.body.includes('—'), 'Chapter I must contain dialogue dashes (—)');
assert(chap1.body.includes('> [!WARNING]'), 'Chapter I must contain callout');
assert(chap1.body.includes('| Garrison Defense Sector'), 'Chapter I must contain markdown table');
assert(chap1.body.includes('[^1]'), 'Chapter I must contain footnote reference');
assert(chap1.body.includes('~~surrender the celestial archives~~'), 'Chapter I must contain strikethrough (~~)');
assert(chap1.body.includes('==Our sacred oath to the stars is non-negotiable=='), 'Chapter I must contain highlight (==)');
console.log('✓ Chapter I formatting (scene breaks, em-dashes, callouts, tables, footnotes, strikethrough, highlights) verified');

// Verify Prologue Formatting
console.log('Checking Prologue formatting features:');
assert(prologue.body.includes('* * *'), 'Prologue must contain scene breaks (* * *)');
assert(prologue.body.includes('—'), 'Prologue must contain dialogue dashes (—)');
assert(prologue.body.includes('> [!NOTE]') && prologue.body.includes('> [!QUOTE]'), 'Prologue must contain callouts');
assert(prologue.body.includes('| Celestial Sphere'), 'Prologue must contain table');
assert(prologue.body.includes('[^1]'), 'Prologue must contain footnote');
assert(prologue.body.includes('~~the ancient treaties will protect us~~'), 'Prologue must contain strikethrough');
assert(prologue.body.includes('==the third star bleeds crimson across the snow=='), 'Prologue must contain highlight');
console.log('✓ Prologue formatting verified');

// Test 2: Wiki-Links & Constellation Resolution
console.log('\n--- 2. Verifying Wiki-Links & Resolution ---');
// Subtitle resolution
const obsGate = Storage.findNoteByTitle('The Obsidian Gate');
assert(obsGate, 'findNoteByTitle should resolve subtitle "The Obsidian Gate"');
assert.strictEqual(obsGate.id, 'demo-chap-1', 'Should resolve to Chapter I note');

const veilEmbers = Storage.findNoteByTitle('The Veil of Embers');
assert(veilEmbers, 'findNoteByTitle should resolve subtitle "The Veil of Embers"');
assert.strictEqual(veilEmbers.id, 'demo-chap-prologue', 'Should resolve to Prologue note');

// Character-to-note resolution
const corvus = Storage.findNoteByTitle('Lord Commander Corvus');
assert(corvus, 'findNoteByTitle should resolve "Lord Commander Corvus" via character codex');
assert.strictEqual(corvus.id, 'demo-lore-order', 'Should resolve to The Order of Lore');

const malakor = Storage.findNoteByTitle('High Inquisitor Malakor');
assert(malakor, 'findNoteByTitle should resolve "High Inquisitor Malakor" via character codex');
assert.strictEqual(malakor.id, 'demo-world-bastion', 'Should resolve to The Sunken Bastion');

const lyra = Storage.findNoteByTitle('Scholar Lyra');
assert(lyra, 'findNoteByTitle should resolve "Scholar Lyra" via character codex');
assert.strictEqual(lyra.id, 'demo-lore-astrolabe', 'Should resolve to The Star Astrolabe');

const vespera = Storage.findNoteByTitle('Vespera');
assert(vespera, 'findNoteByTitle should resolve "Vespera" via character codex');
assert.strictEqual(vespera.id, 'demo-chap-prologue', 'Should resolve to Prologue');

console.log('✓ Smart wiki title resolution (exact, subtitle after colon, and codex character) verified');

// Backlinks verification
const chap1Backlinks = Storage.getBacklinks('Chapter I: The Obsidian Gate');
assert(chap1Backlinks.some(n => n.id === 'demo-chap-prologue'), 'Chapter I must have backlink from Prologue via [[The Obsidian Gate]]');

const orderBacklinks = Storage.getBacklinks('The Order of Lore');
assert(orderBacklinks.length > 0, 'The Order of Lore must have backlinks from notes mentioning it or Corvus');
console.log(`✓ Backlinks cleanly resolved (${chap1Backlinks.length} for Chapter I, ${orderBacklinks.length} for Order of Lore)`);

// Test 3: World Map Pins & Terrains
console.log('\n--- 3. Verifying World Map Pins & Terrain Tags ---');
const pins = Storage.getAllMapPins();
assert.strictEqual(pins.length, 6, 'Starter vault should contain 6 map pins');
pins.forEach(pin => {
  assert(pin.terrain && pin.terrain.length > 0, `Pin ${pin.id} must have a terrain tag`);
  assert(pin.description && pin.description.length > 0, `Pin ${pin.id} must have a description`);
  assert(pin.x >= 0 && pin.x <= 100, `Pin ${pin.id} X coordinate out of range`);
  assert(pin.y >= 0 && pin.y <= 100, `Pin ${pin.id} Y coordinate out of range`);
});
console.log('✓ All 6 map pins verified with coordinates, descriptions, and terrain tags');

// Test 4: Chronology Timeline Events
console.log('\n--- 4. Verifying Chronology Timeline Events ---');
const events = Storage.getTimelineEvents();
assert.strictEqual(events.length, 5, 'Starter vault should contain 5 timeline events');
const eras = new Set(events.map(e => e.era));
assert(eras.size >= 3, 'Timeline must span at least 3 distinct epochs');
console.log(`✓ 5 Timeline events verified spanning ${eras.size} distinct epochs (${Array.from(eras).join(', ')})`);

// Test 5: Character Codex & Psychological Profiles
console.log('\n--- 5. Verifying Character Codex Profiles & Web ---');
const characters = Storage.getAllCharacters();
assert.strictEqual(characters.length, 4, 'Starter vault should contain exactly 4 characters');
characters.forEach(c => {
  assert(c.aliases && c.aliases.length > 0, `Character ${c.name} must have aliases`);
  assert(c.psychProfile && c.psychProfile.length > 0, `Character ${c.name} must have psychProfile`);
  assert(c.bio.includes('Alias:') && c.bio.includes('Psychological Profile:'), `Character ${c.name} bio must include alias and psychological profile`);
});

const relationships = Storage.getAllRelationships();
assert(relationships.length >= 4, 'Starter vault must contain at least 4 relationships');
console.log(`✓ 4 Character dossiers verified with aliases, psychological profiles, and ${relationships.length} relationship web links`);

// Test 6: HTML Markup & Button Verification
console.log('\n--- 6. Verifying HTML Markup for Tutorials & Empty States ---');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert(indexHtml.includes('id="menu-empty-section"'), 'index.html must contain #menu-empty-section');
assert(indexHtml.includes('id="menu-empty-btn-sample"'), 'index.html must contain #menu-empty-btn-sample');
assert(indexHtml.includes('id="menu-empty-btn-guide"'), 'index.html must contain #menu-empty-btn-guide');
assert(indexHtml.includes('id="dashboard-btn-tutorial"'), 'index.html must contain #dashboard-btn-tutorial');
assert(indexHtml.includes('id="map-empty-prompt"'), 'index.html must contain #map-empty-prompt');
assert(indexHtml.includes('id="map-btn-empty-sample"'), 'index.html must contain #map-btn-empty-sample');
assert(indexHtml.includes('id="map-btn-empty-drop"'), 'index.html must contain #map-btn-empty-drop');
assert(indexHtml.includes('id="settings-btn-tour-wiki"'), 'index.html must contain #settings-btn-tour-wiki');
assert(indexHtml.includes('Step 1 of 8'), 'index.html tutorial badge must start at Step 1 of 8');
console.log('✓ All HTML empty state and tutorial trigger elements verified');

console.log('\n=== ALL SAMPLE VAULT & TUTORIAL TESTS PASSED (100%) ===\n');

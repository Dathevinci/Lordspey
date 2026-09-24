const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING LORD SPEY FEEDBACK ENHANCEMENTS TEST SUITE ===\n');

// 1. Mock LocalStorage & Setup Environment
const mockLocalStorage = {};
global.localStorage = {
  getItem: k => (k in mockLocalStorage ? mockLocalStorage[k] : null),
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

const storageCode = fs.readFileSync(path.join(__dirname, 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8');

// ── 1. Customizable Themes & Writing Focus Mode ──
console.log('--- 1. Customizable App Themes & Writing Focus Mode ---');

// Storage base theme methods
assert.strictEqual(Storage.getBaseTheme(), 'dark', 'Default base theme must be dark');
Storage.setBaseTheme('sepia');
assert.strictEqual(Storage.getBaseTheme(), 'sepia', 'Storage must persist sepia theme');
Storage.setBaseTheme('light');
assert.strictEqual(Storage.getBaseTheme(), 'light', 'Storage must persist light theme');
Storage.setBaseTheme('dark');
assert.strictEqual(Storage.getBaseTheme(), 'dark', 'Storage must persist dark theme');

// Storage custom accent color
assert.strictEqual(Storage.getCustomAccentColor(), '#ef4444', 'Default custom accent color must be #ef4444');
Storage.setCustomAccentColor('#a855f7');
assert.strictEqual(Storage.getCustomAccentColor(), '#a855f7', 'Storage must persist custom accent color');
Storage.setCustomAccentColor('#ef4444');
assert.strictEqual(Storage.getCustomAccentColor(), '#ef4444', 'Storage must allow resetting custom accent color');

// HTML Markup for themes
assert(htmlContent.includes('data-base-theme="dark"'), 'Missing dark base theme swatch card');
assert(htmlContent.includes('data-base-theme="light"'), 'Missing light base theme swatch card');
assert(htmlContent.includes('data-base-theme="sepia"'), 'Missing sepia base theme swatch card');
assert(htmlContent.includes('id="setting-custom-accent"'), 'Missing setting-custom-accent input');
assert(htmlContent.includes('id="setting-custom-accent-hex"'), 'Missing setting-custom-accent-hex text input');
assert(htmlContent.includes('id="btn-apply-custom-accent"'), 'Missing btn-apply-custom-accent button');

// Writing Focus Mode
assert(htmlContent.includes('id="setting-focus-autohide"'), 'Missing setting-focus-autohide toggle');
assert(cssContent.includes('.format-bar.focus-autohidden'), 'Missing .format-bar.focus-autohidden CSS rule');
assert(cssContent.includes('[data-theme="sepia"]'), 'Missing sepia theme CSS variables');
assert(cssContent.includes('[data-theme="light"]'), 'Missing light theme CSS variables');
console.log('✓ Base themes (Light, Dark, Sepia), custom accent color, and Focus Mode verified');

// ── 2. World Building & Mapping Shapes & Enhanced Tools ──
console.log('\n--- 2. World Building & Mapping Shapes & Enhanced Tools ---');

// Storage Map Shape
assert.strictEqual(Storage.getMapShape(), 'landscape', 'Default map shape must be landscape');
Storage.saveMapShape('square');
assert.strictEqual(Storage.getMapShape(), 'square', 'Map shape square must persist');
Storage.saveMapShape('vertical');
assert.strictEqual(Storage.getMapShape(), 'vertical', 'Map shape vertical must persist');
Storage.saveMapShape('oval');
assert.strictEqual(Storage.getMapShape(), 'oval', 'Map shape oval must persist');
Storage.saveMapShape('landscape');
assert.strictEqual(Storage.getMapShape(), 'landscape', 'Map shape landscape must persist');

// Storage Map Regions CRUD
assert.deepStrictEqual(Storage.getAllMapRegions(), [], 'Initial map regions must be empty array');
const region1 = Storage.saveMapRegion({
  name: 'Verdant Marches',
  shape: 'polygon',
  color: '#22c55e',
  points: [{ x: 20, y: 30 }, { x: 35, y: 25 }, { x: 40, y: 45 }],
  description: 'Ancestral elven forest lands'
});
assert(region1.id, 'Saved region must have an ID');
assert.strictEqual(Storage.getAllMapRegions().length, 1, 'Map regions count should be 1');
assert.strictEqual(Storage.getAllMapRegions()[0].name, 'Verdant Marches');

const region2 = Storage.saveMapRegion({
  name: 'Bleeding Chasm Sanctuary',
  shape: 'circle',
  color: '#ef4444',
  radius: 80,
  points: [{ x: 60, y: 60 }],
  description: 'Restricted magical crater'
});
assert.strictEqual(Storage.getAllMapRegions().length, 2, 'Map regions count should be 2');

Storage.deleteMapRegion(region1.id);
assert.strictEqual(Storage.getAllMapRegions().length, 1, 'Map regions count after delete should be 1');
assert.strictEqual(Storage.getAllMapRegions()[0].id, region2.id);

// Map Pin Enhanced Attributes
const pin = Storage.saveMapPin({
  title: 'High Citadel',
  x: 50,
  y: 50,
  category: 'settlement',
  pinType: 'citadel',
  pinColor: '#3b82f6',
  description: 'Capital seat of the High Council'
});
assert.strictEqual(pin.pinType, 'citadel', 'Pin should preserve pinType');
assert.strictEqual(pin.pinColor, '#3b82f6', 'Pin should preserve pinColor');

// HTML Markup for Map enhancements
assert(htmlContent.includes('id="map-shape-select"'), 'Missing map-shape-select');
assert(htmlContent.includes('id="btn-map-draw-region"'), 'Missing btn-map-draw-region');
assert(htmlContent.includes('id="map-zoom-level"'), 'Missing map-zoom-level display');
assert(htmlContent.includes('id="map-regions-svg"'), 'Missing map-regions-svg');
assert(htmlContent.includes('id="map-region-modal"'), 'Missing map-region-modal');
assert(htmlContent.includes('id="map-region-detail-modal"'), 'Missing map-region-detail-modal');
assert(htmlContent.includes('id="map-modal-pin-type"'), 'Missing map-modal-pin-type selector');
assert(htmlContent.includes('id="map-modal-pin-color"'), 'Missing map-modal-pin-color input');

// CSS Rules for shapes and regions
assert(cssContent.includes('[data-shape="landscape"]'), 'CSS missing landscape shape rule');
assert(cssContent.includes('[data-shape="square"]'), 'CSS missing square shape rule');
assert(cssContent.includes('[data-shape="vertical"]'), 'CSS missing vertical shape rule');
assert(cssContent.includes('[data-shape="oval"]'), 'CSS missing oval shape rule');
assert(cssContent.includes('.map-region-poly'), 'CSS missing map region poly styles');
assert(cssContent.includes('.map-region-circle'), 'CSS missing map region circle styles');
console.log('✓ World Map shapes, territory regions CRUD & SVG markup, and pin enhancements verified');

// ── 3. Multi-Section & Flexible Folder Structure ──
console.log('\n--- 3. Multi-Section & Flexible Folder Structure ---');

// Storage Sections CRUD
assert.deepStrictEqual(Storage.getAllSections(), [], 'Initial sections must be empty array');
const sec1 = Storage.saveSection({ name: 'Act I: The Gathering Storm', order: 1 });
const sec2 = Storage.saveSection({ name: 'Act II: The Fractured Realm', order: 2 });
assert(sec1.id && sec2.id, 'Sections must have IDs');
assert.strictEqual(Storage.getAllSections().length, 2, 'Should have 2 sections');

// Save note with custom section
const noteWithSec = Storage.saveNote({
  title: 'Chapter 1: Omens',
  category: 'chapter',
  section: 'Act I: The Gathering Storm',
  content: 'The ravens circled...'
});
assert.strictEqual(noteWithSec.section, 'Act I: The Gathering Storm', 'Note must retain section attribute');

Storage.deleteSection(sec1.id);
assert.strictEqual(Storage.getAllSections().length, 1, 'Sections count should be 1 after delete');

// HTML Markup for + New Note dropdown
assert(htmlContent.includes('id="new-note-dropdown"'), 'Missing new-note-dropdown container');
assert(htmlContent.includes('data-create-type="chapter"'), 'Missing chapter dropdown item');
assert(htmlContent.includes('data-create-type="character"'), 'Missing character dropdown item');
assert(htmlContent.includes('data-create-type="world"'), 'Missing worldbuilding dropdown item');
assert(htmlContent.includes('data-create-type="draft"'), 'Missing general draft dropdown item');
assert(htmlContent.includes('id="modal-note-section"'), 'Missing modal-note-section input');
assert(htmlContent.includes('id="modal-field-section"'), 'Missing modal-field-section in note modal');

// CSS Rules for dropdown and section headers
assert(cssContent.includes('.new-note-dropdown'), 'CSS missing .new-note-dropdown');
assert(cssContent.includes('.nav-subsection-header'), 'CSS missing .nav-subsection-header');
console.log('✓ Multi-section folder structure & + New Note dropdown verified');

// ── 4. Galaxy Graph Manual Nodes & Custom Links ──
console.log('\n--- 4. Galaxy Graph Manual Nodes & Custom Links ---');

// Storage Graph Nodes CRUD
assert.deepStrictEqual(Storage.getGraphNodes(), [], 'Initial manual graph nodes must be empty array');
const gNode = Storage.saveGraphNode({
  title: 'The Prophecy of Embers',
  type: 'theme',
  description: 'Recurring destiny motif throughout acts',
  color: '#a855f7'
});
assert(gNode.id, 'Graph node must have an ID');
assert.strictEqual(Storage.getGraphNodes().length, 1, 'Graph nodes count should be 1');

// Storage Graph Links CRUD
assert.deepStrictEqual(Storage.getGraphLinks(), [], 'Initial manual graph links must be empty array');
const gLink = Storage.saveGraphLink({
  source: gNode.id,
  target: noteWithSec.id,
  label: 'foreshadows',
  type: 'directed'
});
assert(gLink.id, 'Graph link must have an ID');
assert.strictEqual(Storage.getGraphLinks().length, 1, 'Graph links count should be 1');
assert.strictEqual(Storage.getGraphLinks()[0].label, 'foreshadows');

Storage.deleteGraphLink(gLink.id);
assert.strictEqual(Storage.getGraphLinks().length, 0, 'Graph links count should be 0 after delete');

Storage.deleteGraphNode(gNode.id);
assert.strictEqual(Storage.getGraphNodes().length, 0, 'Graph nodes count should be 0 after delete');

// HTML Markup for Manual Graph Nodes & Links
assert(htmlContent.includes('id="btn-graph-add-node"'), 'Missing btn-graph-add-node');
assert(htmlContent.includes('id="btn-graph-connect"'), 'Missing btn-graph-connect');
assert(htmlContent.includes('id="graph-entity-modal"'), 'Missing graph-entity-modal');
assert(htmlContent.includes('id="graph-link-modal"'), 'Missing graph-link-modal');
assert(htmlContent.includes('id="graph-node-detail-modal"'), 'Missing graph-node-detail-modal');

// CSS Badges for manual graph entities
assert(cssContent.includes('.badge-theme'), 'CSS missing .badge-theme');
assert(cssContent.includes('.badge-arc'), 'CSS missing .badge-arc');
assert(cssContent.includes('.badge-faction'), 'CSS missing .badge-faction');
assert(cssContent.includes('.badge-concept'), 'CSS missing .badge-concept');
console.log('✓ Galaxy Graph manual nodes (Theme, Arc, Faction, Concept) and custom links verified');

// ── 5. Codex Character Image Upload & Standalone Dossier ──
console.log('\n--- 5. Codex Character Image Upload & Standalone Dossier ---');

const mockImageB64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
const charProfile = Storage.saveCharacter({
  name: 'Lady Aurelia',
  archetype: 'protagonist',
  faction: 'House of Sun',
  role: 'Grand Inquisitor',
  bio: 'A stern wielder of ancient solar glyphs',
  image: mockImageB64
});
assert.strictEqual(charProfile.image, mockImageB64, 'Character profile must preserve image string');

const retrievedChar = Storage.getCharacters().find(c => c.id === charProfile.id);
assert.strictEqual(retrievedChar.image, mockImageB64, 'Retrieved character must have image string');

// HTML Markup for Codex Image Upload & Details
assert(htmlContent.includes('id="codex-image-dropzone"'), 'Missing codex-image-dropzone');
assert(htmlContent.includes('id="codex-input-image"'), 'Missing codex-input-image');
assert(htmlContent.includes('id="codex-image-preview"'), 'Missing codex-image-preview');
assert(htmlContent.includes('id="btn-codex-remove-image"'), 'Missing btn-codex-remove-image');
assert(htmlContent.includes('id="codex-detail-modal"'), 'Missing codex-detail-modal');

// CSS rules for character portraits
assert(cssContent.includes('.char-image-dropzone'), 'CSS missing .char-image-dropzone');
assert(cssContent.includes('.codex-card-avatar-img'), 'CSS missing .codex-card-avatar-img');
assert(cssContent.includes('.codex-detail-avatar-img'), 'CSS missing .codex-detail-avatar-img');
console.log('✓ Codex character portrait upload dropzone and standalone dossier verified');

// ── 6. Standalone Modules & Embedded Detail Modals ──
console.log('\n--- 6. Embedded Detail Modals & Non-Navigating Inspection ---');

assert(htmlContent.includes('id="map-region-detail-modal"'), 'Missing map-region-detail-modal');
assert(htmlContent.includes('id="timeline-event-detail-modal"'), 'Missing timeline-event-detail-modal');
assert(htmlContent.includes('id="codex-detail-modal"'), 'Missing codex-detail-modal');
assert(htmlContent.includes('id="graph-node-detail-modal"'), 'Missing graph-node-detail-modal');
assert(htmlContent.includes('id="btn-map-edit-pin"'), 'Missing btn-map-edit-pin for standalone pin modal editing');

// Verify that all detail modals have distinct close/back buttons
assert(htmlContent.includes('id="btn-map-region-detail-close"'), 'Missing btn-map-region-detail-close');
assert(htmlContent.includes('id="btn-timeline-detail-close"'), 'Missing btn-timeline-detail-close');
assert(htmlContent.includes('id="btn-codex-detail-close"'), 'Missing btn-codex-detail-close');
assert(htmlContent.includes('id="btn-graph-detail-close"'), 'Missing btn-graph-detail-close');
console.log('✓ All 4 standalone embedded detail modals and inspection controls verified');

// ── 7. .spey Project Package & Vault Backup Preservation ──
console.log('\n--- 7. .spey Project Package & Deep Worldbuilding Round-trip ---');

// Setup worldbuilding state
Storage.saveMapShape('vertical');
Storage.saveMapRegion({ name: 'The Outer Isles', shape: 'polygon', points: [{x:10,y:10}] });
Storage.saveGraphNode({ title: 'Fate', type: 'theme' });
Storage.saveSection({ name: 'Part III', order: 3 });

const speyPkg = Storage.exportSpeyPackage();
assert(speyPkg, 'Export to spey must produce package object');
assert.strictEqual(speyPkg.mapShape, 'vertical', 'Spey package must retain mapShape');
assert(speyPkg.mapRegions.length >= 1, 'Spey package must retain mapRegions');
assert(speyPkg.graphNodes.length >= 1, 'Spey package must retain graphNodes');
assert(speyPkg.sections.length >= 1, 'Spey package must retain sections');

// Clear and Import spey
global.localStorage.clear();
const importRes = Storage.importSpeyPackage(speyPkg, 'replace');
assert(importRes.success, 'Spey replace import must succeed');
assert.strictEqual(Storage.getMapShape(), 'vertical', 'Imported map shape must match');
assert(Storage.getAllMapRegions().some(r => r.name === 'The Outer Isles'), 'Imported map region must exist');
assert(Storage.getGraphNodes().some(n => n.title === 'Fate'), 'Imported graph node must exist');
assert(Storage.getAllSections().some(s => s.name === 'Part III'), 'Imported section must exist');

console.log('✓ .spey package export/import preserves all feedback additions flawlessly');

console.log('\n=== ALL FEEDBACK ENHANCEMENTS TESTS PASSED (100%) ===\n');

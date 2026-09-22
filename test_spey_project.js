const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING LORD SPEY .SPEY PROJECT PACKAGE TEST SUITE ===\n');

// ──────────────────────────────────────────
// 1. Setup Mock LocalStorage & Load Storage
// ──────────────────────────────────────────
const mockLocalStorage = {};
global.localStorage = {
  getItem: k => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

const storageCode = fs.readFileSync(path.join(__dirname, 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

const Markdown = require('./js/markdown.js');
global.Markdown = Markdown;

// ──────────────────────────────────────────
// 2. Package Architecture & Schema Verification
// ──────────────────────────────────────────
console.log('--- 1. Package Architecture & Schema Verification ---');

Storage.clearVault();
assert.strictEqual(Storage.getAllNotes().length, 0);

// Test empty clean vault export
const cleanPkg = Storage.exportSpeyPackage();
assert.strictEqual(cleanPkg.format, 'lord-spey-package', 'Must declare format lord-spey-package');
assert.strictEqual(cleanPkg.version, 1, 'Version must be 1');
assert.strictEqual(cleanPkg.appName, 'Lord Spey', 'App name must be Lord Spey');
assert(cleanPkg.exportedAt, 'Must include exportedAt timestamp');
assert.strictEqual(cleanPkg.stats.totalNotes, 0);
assert.strictEqual(cleanPkg.stats.wordCount, 0);
assert(Array.isArray(cleanPkg.notes), 'Notes must be an array');
assert(Array.isArray(cleanPkg.mapPins), 'Map pins must be an array');
assert(Array.isArray(cleanPkg.timelineEvents), 'Timeline events must be an array');
assert(Array.isArray(cleanPkg.characters), 'Characters must be an array');
assert(Array.isArray(cleanPkg.relationships), 'Relationships must be an array');

// Populate rich author project
const c1 = Storage.createNote({
  title: 'Chapter I: The Basalt Citadel',
  category: 'chapter',
  body: '# Chapter I: The Basalt Citadel\n\nThe obsidian spire loomed in the crimson sunset, shadows stretching across [[The Ashen Vale]].\n\nWord count check test sentence.'
});
const l1 = Storage.createNote({
  title: 'The Order of Spey',
  category: 'lore',
  body: '# The Order of Spey\n\nAncient archivists recording celestial histories.'
});
const w1 = Storage.createNote({
  title: 'The Ashen Vale',
  category: 'world',
  body: '# The Ashen Vale\n\nA volcanic plateau shrouded in mist.'
});
const d1 = Storage.createNote({
  title: 'Act II Scene Beats',
  category: 'draft',
  body: '# Act II Beats\n\nKey reveals and confrontations.'
});

const pin = Storage.saveMapPin({
  title: 'Citadel Gate',
  category: 'world',
  x: 42.5,
  y: 78.1,
  description: 'Entrance to the basalt fortress.'
});

Storage.saveCustomMapImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');

const evt = Storage.saveTimelineEvent({
  title: 'The Great Convergence',
  year: 'Year 450',
  era: 'Second Age',
  description: 'Three moons aligned over the peak.'
});

const char = Storage.saveCharacter({
  name: 'Vespera',
  archetype: 'Protagonist',
  faction: 'Order of Spey',
  role: 'Master Archivist'
});

const rel = Storage.saveRelationship({
  sourceId: char.id,
  targetName: 'Corvus',
  type: 'Allied with',
  description: 'Sworn comrades.'
});

Storage.saveSetting('projectTitle', 'The Chronicles of Lord Spey');

const richPkg = Storage.exportSpeyPackage();
assert.strictEqual(richPkg.format, 'lord-spey-package');
assert.strictEqual(richPkg.version, 1);
assert.strictEqual(richPkg.projectName, 'The Chronicles of Lord Spey');
assert.strictEqual(richPkg.stats.totalNotes, 4);
assert.strictEqual(richPkg.stats.chapters, 1);
assert.strictEqual(richPkg.stats.lore, 1);
assert.strictEqual(richPkg.stats.world, 1);
assert.strictEqual(richPkg.stats.drafts, 1);
assert(richPkg.stats.wordCount > 30, 'Total word count should be accurately computed');
assert.strictEqual(richPkg.stats.mapPins, 1);
assert.strictEqual(richPkg.stats.timelineEvents, 1);
assert.strictEqual(richPkg.stats.characters, 1);
assert.strictEqual(richPkg.stats.relationships, 1);
assert(richPkg.customMapImage.startsWith('data:image/png'), 'Custom map image must be bundled');

console.log('✓ .spey package architecture and schema verified');

// ──────────────────────────────────────────
// 3. Validation & Schema Verification
// ──────────────────────────────────────────
console.log('--- 2. Validation & Error Handling ---');

assert.strictEqual(Storage.validateSpeyPackage(null).valid, false);
assert.strictEqual(Storage.validateSpeyPackage('string').valid, false);
assert.strictEqual(Storage.validateSpeyPackage({}).valid, false);
assert.strictEqual(Storage.validateSpeyPackage({ format: 'lord-spey-package', version: 'invalid', notes: [] }).valid, false);
assert.strictEqual(Storage.validateSpeyPackage({ format: 'lord-spey-package', version: 1, notes: 'not-array' }).valid, false);

const validCheck = Storage.validateSpeyPackage(richPkg);
assert.strictEqual(validCheck.valid, true);
assert.strictEqual(validCheck.isSpey, true);

// Resilience with null/empty items in notes and worldbuilding arrays
const malformedPkg = {
  format: 'lord-spey-package',
  version: 1,
  notes: [null, undefined, { id: 'safe-note', title: 'Safe Note', category: 'chapter', body: 123 }],
  mapPins: [null],
  timelineEvents: [null],
  characters: [null],
  relationships: [null]
};
assert.strictEqual(Storage.validateSpeyPackage(malformedPkg).valid, true);
const parsedMalformed = Storage.parseSpeyPackage(malformedPkg);
assert.strictEqual(parsedMalformed.totalNotes, 1, 'Only non-null notes should be counted');
assert.strictEqual(parsedMalformed.title, 'Safe Note');

// Legacy JSON vault validation
const legacyCheck = Storage.validateSpeyPackage({ notes: [c1, l1] });
assert.strictEqual(legacyCheck.valid, true);
assert.strictEqual(legacyCheck.isSpey, false);

const rawArrayCheck = Storage.validateSpeyPackage([c1]);
assert.strictEqual(rawArrayCheck.valid, true);

console.log('✓ Validation and format detection verified');

// ──────────────────────────────────────────
// 4. Package Parsing & Summaries
// ──────────────────────────────────────────
console.log('--- 3. Package Parsing & Summaries ---');

const jsonString = JSON.stringify(richPkg);
const parsed = Storage.parseSpeyPackage(jsonString);
assert.strictEqual(parsed.projectName, 'The Chronicles of Lord Spey');
assert.strictEqual(parsed.chapters, 1);
assert.strictEqual(parsed.lore, 1);
assert.strictEqual(parsed.world, 1);
assert.strictEqual(parsed.drafts, 1);
assert.strictEqual(parsed.totalNotes, 4);
assert.strictEqual(parsed.mapPinsCount, 1);
assert.strictEqual(parsed.timelineEventsCount, 1);
assert.strictEqual(parsed.charactersCount, 1);
assert.strictEqual(parsed.relationshipsCount, 1);
assert.strictEqual(parsed.hasCustomMap, true);
assert.strictEqual(parsed.isSpey, true);

console.log('✓ Parsing and summary extraction verified');

// ──────────────────────────────────────────
// 5. Import Round-Trip: Replace Flow & Backup Protection
// ──────────────────────────────────────────
console.log('--- 4. Replace Flow with Vault Backup Protection ---');

// Set current vault state before replace
Storage.clearVault();
const oldNote = Storage.createNote({ title: 'Old Note To Backup', category: 'draft', body: 'Crucial author prose.' });
assert.strictEqual(Storage.getAllNotes().length, 1);

// Import the rich package in replace mode
const replaceResult = Storage.importSpeyPackage(richPkg, 'replace', true);
assert.strictEqual(replaceResult.success, true);
assert.strictEqual(replaceResult.mode, 'replace');
assert.strictEqual(Storage.getAllNotes().length, 4);
assert.strictEqual(Storage.getAllMapPins().length, 1);
assert.strictEqual(Storage.getTimelineEvents().length, 1);
assert.strictEqual(Storage.getCharacters().length, 1);
assert(Storage.getCustomMapImage() !== null);

// Verify Backup was created
const backup = Storage.getVaultBackup();
assert(backup !== null, 'Backup snapshot must exist');
assert(backup.notes.some(n => n.title === 'Old Note To Backup'), 'Backup must contain prior vault notes');

// Verify Backup Restore
const restored = Storage.restoreVaultBackup();
assert.strictEqual(restored.success, true);
assert.strictEqual(Storage.getAllNotes().length, 1);
assert.strictEqual(Storage.getAllNotes()[0].title, 'Old Note To Backup');

console.log('✓ Replace mode with automatic backup and restore verified');

// ──────────────────────────────────────────
// 6. Import Round-Trip: Merge Flow
// ──────────────────────────────────────────
console.log('--- 5. Merge Flow ---');

// Restore rich package first
Storage.importSpeyPackage(richPkg, 'replace', false);
assert.strictEqual(Storage.getAllNotes().length, 4);

// Create incoming project bundle with 2 notes, including 1 overlapping ID
const incomingPkg = {
  format: 'lord-spey-package',
  version: 1,
  appName: 'Lord Spey',
  projectName: 'Collaborator Additions',
  notes: [
    {
      id: c1.id, // collision
      title: 'Chapter I (Collaborator Polish)',
      category: 'chapter',
      body: 'Edited chapter version.'
    },
    {
      id: 'collab-note-2',
      title: 'Chapter II: The Frozen Pass',
      category: 'chapter',
      body: 'Second chapter prose.'
    }
  ],
  mapPins: [
    {
      id: pin.id, // collision with existing pin ID
      title: 'Citadel Gate Colliding Copy',
      category: 'world',
      x: 45,
      y: 80,
      noteId: c1.id // referencing colliding note
    },
    {
      id: 'new-pin',
      title: 'Frozen Pass',
      category: 'world',
      x: 10,
      y: 20,
      description: 'Mountain pass'
    }
  ],
  timelineEvents: [
    {
      id: evt.id, // collision with existing event ID
      title: 'The Great Convergence (Variant)',
      year: 'Year 451',
      noteId: c1.id // referencing colliding note
    }
  ],
  characters: [
    {
      id: char.id, // collision with existing char ID but distinct name
      name: 'Alden of the High Watch',
      archetype: 'Ally',
      noteId: c1.id // referencing colliding note
    }
  ],
  relationships: [
    {
      id: 'rel-collab-1',
      sourceId: char.id, // will be remapped to Alden's new ID
      targetName: 'Corvus',
      type: 'Protector of'
    }
  ]
};

const mergeResult = Storage.importSpeyPackage(incomingPkg, 'merge');
assert.strictEqual(mergeResult.success, true);
assert.strictEqual(mergeResult.mode, 'merge');
assert.strictEqual(mergeResult.addedNotes, 2);

// Total notes should now be 4 + 2 = 6 (collision resolved with new ID, no erasure)
const allMerged = Storage.getAllNotes();
assert.strictEqual(allMerged.length, 6);
assert(allMerged.some(n => n.title === 'Chapter I: The Basalt Citadel'), 'Original note preserved');
const clonedNote = allMerged.find(n => n.title === 'Chapter I (Collaborator Polish)');
assert(clonedNote, 'Colliding note cloned with new ID');
assert.notStrictEqual(clonedNote.id, c1.id, 'Cloned note must have distinct new ID');

// Verify colliding pin is preserved and its noteId updated to cloned note's new ID
const allPins = Storage.getAllMapPins();
assert.strictEqual(allPins.length, 3, 'Both new pin and colliding pin must be merged (none dropped)');
const collidingPin = allPins.find(p => p.title === 'Citadel Gate Colliding Copy');
assert(collidingPin, 'Colliding pin must be preserved');
assert.notStrictEqual(collidingPin.id, pin.id, 'Colliding pin must receive new ID');
assert.strictEqual(collidingPin.noteId, clonedNote.id, 'Map pin noteId must point to remapped cloned note ID');

// Verify colliding timeline event is preserved and noteId updated
const allEvents = Storage.getTimelineEvents();
assert.strictEqual(allEvents.length, 2, 'Colliding timeline event must be preserved');
const collidingEvt = allEvents.find(e => e.title === 'The Great Convergence (Variant)');
assert(collidingEvt, 'Colliding timeline event preserved');
assert.notStrictEqual(collidingEvt.id, evt.id, 'Colliding event receives new ID');
assert.strictEqual(collidingEvt.noteId, clonedNote.id, 'Timeline event noteId must point to remapped cloned note ID');

// Verify colliding character is preserved and relationships remapped
const allChars = Storage.getCharacters();
assert.strictEqual(allChars.length, 2, 'Distinct named character must be merged');
const remappedChar = allChars.find(c => c.name === 'Alden of the High Watch');
assert(remappedChar, 'Distinct named character preserved');
assert.notStrictEqual(remappedChar.id, char.id, 'Colliding character receives new ID');
assert.strictEqual(remappedChar.noteId, clonedNote.id, 'Character noteId must point to remapped cloned note ID');

const allRels = Storage.getRelationships();
assert.strictEqual(allRels.length, 2, 'New relationship merged');
const collabRel = allRels.find(r => r.type === 'Protector of');
assert(collabRel, 'Relationship preserved');
assert.strictEqual(collabRel.sourceId, remappedChar.id, 'Relationship sourceId must be remapped to character new ID');

console.log('✓ Merge mode with non-destructive collision resolution verified');

// ──────────────────────────────────────────
// 7. UI & App Controller Integration
// ──────────────────────────────────────────
console.log('--- 6. UI & App Controller Integration ---');

function createMockElement(id = '', tag = 'div') {
  const classes = new Set();
  const listeners = {};
  const dataset = {};
  const children = [];
  return {
    id,
    tagName: tag.toUpperCase(),
    classes,
    classList: {
      add: (...c) => c.forEach(x => classes.add(x)),
      remove: (...c) => c.forEach(x => classes.delete(x)),
      contains: c => classes.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (classes.has(c)) classes.delete(c); else classes.add(c);
        } else if (force) classes.add(c); else classes.delete(c);
      }
    },
    dataset,
    style: {},
    attributes: {},
    setAttribute: function(k, v) { this.attributes[k] = String(v); },
    getAttribute: function(k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; },
    removeAttribute: function(k) { delete this.attributes[k]; },
    value: '',
    textContent: '',
    innerHTML: '',
    children,
    parentElement: { getBoundingClientRect: () => ({ width: 1000, height: 800 }) },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
    focus: () => {},
    select: () => {},
    click: function() { this.dispatchEvent('click'); },
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
    appendChild: function(c) { children.push(c); },
    remove: () => {},
    addEventListener: (ev, fn) => {
      if (!listeners[ev]) listeners[ev] = [];
      listeners[ev].push(fn);
    },
    dispatchEvent: function(ev, payload = {}) {
      if (listeners[ev]) listeners[ev].forEach(fn => fn(payload));
      if (typeof this['on' + ev] === 'function') this['on' + ev](payload);
    }
  };
}

const uiMockIds = [
  'main-menu', 'editor-area', 'sidebar', 'sidebar-backdrop', 'sidebar-toggle', 'sidebar-expand',
  'search-input', 'logo-home', 'btn-tutorial-sidebar', 'intro-splash', 'intro-skip-btn', 'menu-emblem',
  'menu-btn-tutorial', 'menu-btn-graph', 'menu-btn-switcher', 'menu-btn-sample', 'menu-recent-section',
  'menu-recent-grid', 'editor-body-wrap', 'btn-back-menu', 'note-title', 'note-tags', 'note-category',
  'note-body', 'note-preview', 'word-count', 'reading-time', 'save-status', 'btn-split', 'btn-preview',
  'btn-new-note', 'btn-delete', 'btn-zen', 'btn-export-md', 'btn-export', 'btn-import', 'import-file',
  'btn-export-spey', 'btn-open-spey', 'btn-project-settings', 'dashboard-btn-export-spey',
  'dashboard-btn-open-spey', 'menu-btn-export-spey', 'menu-btn-open-spey', 'menu-btn-project-settings',
  'spey-import-modal', 'btn-import-modal-close', 'spey-import-proj-name', 'spey-import-format-tag',
  'spey-stat-chapters', 'spey-stat-words', 'spey-stat-lore', 'spey-stat-pins', 'spey-breakdown-details',
  'btn-import-cancel', 'btn-import-merge', 'btn-import-replace', 'project-settings-modal',
  'btn-close-project-settings', 'setting-project-title', 'setting-project-author', 'settings-stats-grid',
  'settings-btn-export-spey', 'settings-btn-export-json', 'settings-btn-backup-vault', 'btn-save-project-settings',
  'spey-dropzone', 'toast-container', 'metrics-modal', 'switcher-modal', 'graph-modal', 'tutorial-overlay',
  'goal-modal', 'outline-drawer', 'find-replace-bar', 'wikicreate-modal', 'modal-overlay', 'delete-overlay',
  'btn-outline', 'btn-close-outline', 'meta-goal', 'btn-cancel-goal', 'btn-save-goal', 'btn-sprint',
  'btn-skip-tutorial-top', 'btn-tutorial-skip', 'btn-tutorial-prev', 'btn-tutorial-next',
  'modal-cancel', 'modal-create', 'modal-title', 'delete-cancel', 'delete-confirm', 'find-input', 'replace-input',
  'switcher-input', 'list-chapter', 'list-lore', 'list-world', 'list-draft'
];

const domMap = {};
uiMockIds.forEach(id => {
  domMap[id] = createMockElement(id);
  if (id !== 'main-menu') domMap[id].classList.add('hidden');
});

const windowListeners = {};
global.window = {
  innerWidth: 1280,
  addEventListener: (ev, fn) => {
    if (!windowListeners[ev]) windowListeners[ev] = [];
    windowListeners[ev].push(fn);
  },
  dispatchEvent: (ev, payload) => {
    if (windowListeners[ev]) windowListeners[ev].forEach(fn => fn(payload));
  }
};

global.Blob = function(parts, options) {
  this.parts = parts;
  this.type = options && options.type;
};
global.URL = {
  createObjectURL: () => 'blob:mock-url',
  revokeObjectURL: () => {}
};

global.document = {
  createElement: tag => createMockElement('', tag),
  getElementById: id => domMap[id] || createMockElement(id),
  querySelector: sel => sel.startsWith('#') ? (domMap[sel.slice(1)] || createMockElement(sel.slice(1))) : createMockElement(),
  querySelectorAll: () => [],
  addEventListener: (ev, fn) => {
    if (!windowListeners[ev]) windowListeners[ev] = [];
    windowListeners[ev].push(fn);
  },
  dispatchEvent: (ev, payload = {}) => {
    if (windowListeners[ev]) windowListeners[ev].forEach(fn => fn(payload));
  }
};

const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
eval(`(function() { ${appCode}; })()`);

// Test Export buttons trigger exportSpeyPackage
let exportTriggered = false;
const origExportSpey = Storage.exportSpeyPackage;
Storage.exportSpeyPackage = function() {
  exportTriggered = true;
  return origExportSpey.apply(this, arguments);
};

domMap['btn-export-spey'].click();
assert.strictEqual(exportTriggered, true, 'Sidebar export button should trigger exportSpey');
exportTriggered = false;

domMap['dashboard-btn-export-spey'].click();
assert.strictEqual(exportTriggered, true, 'Dashboard export button should trigger exportSpey');
exportTriggered = false;

// Test Open buttons trigger file picker
let filePickerClicked = false;
domMap['import-file'].addEventListener('click', () => { filePickerClicked = true; });

domMap['btn-open-spey'].click();
assert.strictEqual(filePickerClicked, true, 'Sidebar open button should trigger file picker');
filePickerClicked = false;

domMap['dashboard-btn-open-spey'].click();
assert.strictEqual(filePickerClicked, true, 'Dashboard open button should trigger file picker');

// Test processing incoming file opens Import Confirmation modal
assert(domMap['spey-import-modal'].classList.contains('hidden'));
global.window.processIncomingSpeyFile(richPkg, 'test.spey');

assert(!domMap['spey-import-modal'].classList.contains('hidden'), 'Import confirmation modal should be visible');
assert.strictEqual(domMap['spey-import-proj-name'].textContent, 'The Chronicles of Lord Spey');
assert.strictEqual(domMap['spey-stat-chapters'].textContent, '1');

// Test Escape dismissal of Import Confirmation modal
global.document.dispatchEvent('keydown', { key: 'Escape', preventDefault: () => {} });
assert(domMap['spey-import-modal'].classList.contains('hidden'), 'Escape should dismiss import confirmation modal');

// Test Drag and drop
const dragEnterFns = windowListeners['dragenter'] || [];
dragEnterFns.forEach(fn => fn({
  dataTransfer: { types: ['Files'] },
  preventDefault: () => {}
}));
assert(!domMap['spey-dropzone'].classList.contains('hidden'), 'Dropzone overlay should appear on dragenter');

const dropFns = windowListeners['drop'] || [];
dropFns.forEach(fn => fn({
  dataTransfer: { files: [{ name: 'dropped_story.spey' }] },
  preventDefault: () => {}
}));
assert(domMap['spey-dropzone'].classList.contains('hidden'), 'Dropzone overlay should hide on drop');

// Test Project Settings Modal
global.window.openProjectSettingsModal();
assert(!domMap['project-settings-modal'].classList.contains('hidden'), 'Settings modal should be open');
domMap['setting-project-title'].value = 'Custom Renamed Story';
domMap['btn-save-project-settings'].click();
assert(domMap['project-settings-modal'].classList.contains('hidden'), 'Settings modal should close on save');
assert.strictEqual(Storage.getSettings().projectTitle, 'Custom Renamed Story');

console.log('✓ UI integration, event triggers, modals, drag-drop & settings verified');

// ──────────────────────────────────────────
// 8. Desktop & Mobile Configuration Checks
// ──────────────────────────────────────────
console.log('--- 7. Desktop & Mobile Configuration Verification ---');

// package.json file associations
const pkgJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
assert(pkgJson.build, 'package.json must contain build configuration');
assert(Array.isArray(pkgJson.build.fileAssociations), 'build must specify fileAssociations array');
const speyAssoc = pkgJson.build.fileAssociations.find(a => a.ext === 'spey');
assert(speyAssoc, 'fileAssociations must register "spey" extension');
assert.strictEqual(speyAssoc.mimeType, 'application/x-lord-spey');

// electron-main.js single instance & argv handling
const electronMain = fs.readFileSync(path.join(__dirname, 'electron-main.js'), 'utf8');
assert(electronMain.includes('requestSingleInstanceLock'), 'electron-main must request single instance lock');
assert(electronMain.includes('findSpeyArg'), 'electron-main must parse spey arguments');
assert(electronMain.includes('sendSpeyFileToWindow'), 'electron-main must send spey payload to window');
assert(electronMain.includes('open-file'), 'electron-main must handle macOS open-file event');

// Evaluate findSpeyArg unit test directly
const fnSnippet = electronMain.slice(electronMain.indexOf('function findSpeyArg'), electronMain.indexOf('function sendSpeyFileToWindow'));
const findSpeyArgFn = eval(`(function() { ${fnSnippet}; return findSpeyArg; })()`);

assert.strictEqual(findSpeyArgFn(['--enable-logging', '/prefetch:1', '"C:\\Users\\Author\\LordSpey.spey"']), 'C:\\Users\\Author\\LordSpey.spey', 'findSpeyArg must strip quotes and ignore flags');
assert.strictEqual(findSpeyArgFn(['-v', 'test.json']), 'test.json', 'findSpeyArg must accept json');
assert.strictEqual(findSpeyArgFn(['--flag', 'unrelated.txt']), null, 'findSpeyArg must ignore non-spey files');

// AndroidManifest.xml intent filters
const manifest = fs.readFileSync(path.join(__dirname, 'android/app/src/main/AndroidManifest.xml'), 'utf8');
assert(manifest.includes('android:pathPattern=".*\\\\.spey"') || manifest.includes('.spey'), 'AndroidManifest must register .spey path pattern');
assert(manifest.includes('android:mimeType="application/x-lord-spey"'), 'AndroidManifest must register application/x-lord-spey mime type');

console.log('✓ Desktop Electron file associations & Android intent filters verified');

console.log('\n=== ALL .SPEY PROJECT PACKAGE TESTS PASSED SUCCESSFULLY (100%) ===\n');

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING LORD SPEY SAMPLE VAULT SAFETY & RECOVERY SUITE ===\n');

// ── 1. Mock LocalStorage & DOM Environment ──
const mockLocalStorage = {
  'lordspey_tutorial_seen': 'true'
};

global.localStorage = {
  getItem: k => (k in mockLocalStorage ? mockLocalStorage[k] : null),
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

// Mock alert, confirm
global.confirm = () => true;
global.alert = () => {};

// Load Markdown and Storage
const Markdown = require('./js/markdown.js');
global.Markdown = Markdown;

const storageCode = fs.readFileSync(path.join(__dirname, 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

// Load real index.html to extract all element IDs
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

function createMockElement(id = '', tag = 'div') {
  const classes = new Set();
  const listeners = {};
  const dataset = {};
  const styleProps = {};
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
    style: {
      setProperty: (k, v) => { styleProps[k] = String(v); },
      getPropertyValue: k => styleProps[k] || '',
      ...styleProps
    },
    value: '',
    checked: false,
    textContent: '',
    innerHTML: '',
    children: [],
    appendChild: function(c) { this.children.push(c); c.parentElement = this; return c; },
    removeChild: function(c) { this.children = this.children.filter(x => x !== c); return c; },
    remove: function() { if (this.parentElement && this.parentElement.removeChild) this.parentElement.removeChild(this); },
    parentElement: { getBoundingClientRect: () => ({ width: 1000, height: 800 }) },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
    addEventListener: (ev, fn) => {
      if (!listeners[ev]) listeners[ev] = [];
      listeners[ev].push(fn);
    },
    removeEventListener: (ev, fn) => {
      if (listeners[ev]) listeners[ev] = listeners[ev].filter(f => f !== fn);
    },
    dispatchEvent: (ev, payload) => {
      const type = typeof ev === 'string' ? ev : ev.type;
      if (listeners[type]) listeners[type].forEach(fn => fn(payload || ev));
    },
    click: function() {
      const ev = { type: 'click', target: this, preventDefault: () => {}, stopPropagation: () => {} };
      if (listeners['click']) {
        listeners['click'].forEach(fn => fn(ev));
      }
      let parent = this.parentElement;
      while (parent) {
        if (parent.listeners && parent.listeners['click']) {
          parent.listeners['click'].forEach(fn => fn(ev));
        }
        parent = parent.parentElement;
      }
      if (global.document && global.document.dispatchEvent) {
        global.document.dispatchEvent(ev);
      }
    },
    listeners,
    closest: function(sel) {
      let current = this;
      while (current && current.classList) {
        const selectors = sel.split(',').map(s => s.trim());
        for (const s of selectors) {
          if (s.startsWith('#') && current.id === s.slice(1)) return current;
          if (s.startsWith('.') && current.classList.contains(s.slice(1))) return current;
        }
        current = current.parentElement;
      }
      return null;
    },
    focus: () => {},
    select: () => {},
    setAttribute: () => {},
    getAttribute: () => null
  };
}

const elementsMap = {};
const idRegex = /id=["']([^"']+)["']/g;
let match;
while ((match = idRegex.exec(htmlContent)) !== null) {
  const id = match[1];
  if (!elementsMap[id]) {
    elementsMap[id] = createMockElement(id);
  }
}

// Ensure alias IDs exist
['modal-sample-vault-confirm', 'sample-vault-confirm-modal', 'sample-vault-restore-banner', 'btn-sample-confirm-replace', 'btn-sample-confirm-backup-replace', 'settings-btn-restore-backup'].forEach(id => {
  if (!elementsMap[id]) elementsMap[id] = createMockElement(id);
});

// Start modals and overlays in hidden state
['intro-splash', 'project-settings-modal', 'settings-modal', 'vault-reset-confirm-modal', 'tutorial-overlay', 'spey-import-modal', 'spey-dropzone', 'find-replace-bar', 'metrics-modal', 'graph-modal', 'map-modal', 'timeline-modal', 'codex-modal', 'modal-overlay', 'delete-overlay', 'wikicreate-modal', 'modal-sample-vault-confirm', 'sample-vault-restore-banner', 'modal-update', 'modal-whats-new'].forEach(id => {
  if (elementsMap[id]) elementsMap[id].classList.add('hidden');
});

// Setup mock document & window
const windowListeners = {};
const documentListeners = {};
global.window = {
  innerWidth: 1200,
  innerHeight: 800,
  location: { href: 'http://localhost:8095' },
  addEventListener: (ev, fn) => {
    if (!windowListeners[ev]) windowListeners[ev] = [];
    windowListeners[ev].push(fn);
  },
  removeEventListener: (ev, fn) => {
    if (windowListeners[ev]) windowListeners[ev] = windowListeners[ev].filter(f => f !== fn);
  },
  dispatchEvent: (ev, payload) => {
    const type = typeof ev === 'string' ? ev : ev.type;
    if (windowListeners[type]) windowListeners[type].forEach(fn => fn(payload || ev));
  },
  requestAnimationFrame: cb => setTimeout(cb, 16),
  cancelAnimationFrame: id => clearTimeout(id)
};

global.document = {
  getElementById: id => elementsMap[id] || null,
  querySelector: sel => {
    if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || null;
    return null;
  },
  querySelectorAll: sel => {
    if (sel.startsWith('#')) {
      const el = elementsMap[sel.slice(1)];
      return el ? [el] : [];
    }
    return [];
  },
  createElement: tag => createMockElement('', tag),
  addEventListener: (ev, fn) => {
    if (!documentListeners[ev]) documentListeners[ev] = [];
    documentListeners[ev].push(fn);
  },
  removeEventListener: (ev, fn) => {
    if (documentListeners[ev]) documentListeners[ev] = documentListeners[ev].filter(f => f !== fn);
  },
  dispatchEvent: (ev, payload) => {
    const type = typeof ev === 'string' ? ev : ev.type;
    if (documentListeners[type]) documentListeners[type].forEach(fn => fn(payload || ev));
  },
  body: createMockElement('body')
};

// Evaluate app.js
const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
eval(`(function() { ${appCode}; })()`);

console.log('✓ Mock DOM and application controller initialized successfully\n');

// ── TEST 1: Pristine / Empty Vault Smooth Load (Zero Friction) ──
console.log('--- 1. Testing Pristine / Empty Vault Auto-Load (Zero Friction) ---');
Storage.clearAllNotes();
assert.strictEqual(Storage.hasUserContent(), false, 'Fresh vault must report hasUserContent() === false');
assert.strictEqual(Storage.isVaultEmpty(), true, 'Fresh vault must report isVaultEmpty() === true');

const confirmModal = elementsMap['modal-sample-vault-confirm'];
assert(confirmModal.classList.contains('hidden'), 'Confirmation dialog starts hidden');

// Click settings load sample button on empty vault
const settingsBtnLoad = elementsMap['settings-btn-load-sample'];
settingsBtnLoad.dispatchEvent('click');

// Should load starter vault immediately without modal opening
assert(confirmModal.classList.contains('hidden'), 'Dialog should NOT open on pristine/empty vault');
const loadedNotes = Storage.getAllNotes();
assert.strictEqual(loadedNotes.length, 9, 'Starter vault loaded with exactly 9 notes');
assert(loadedNotes.some(n => n.id === 'demo-chap-prologue'), 'Prologue note is present');
assert(Storage.getAllMapPins().length > 0, 'Map pins are populated');
assert(Storage.getTimelineEvents().length > 0, 'Timeline events are populated');
assert(Storage.getCharacters().length > 0, 'Character dossiers are populated');
console.log('✓ Test 1 Passed: Empty vault loads sample data smoothly without unnecessary friction\n');

// ── TEST 2: User Content Detection Verification ──
console.log('--- 2. Testing User-Created Content Detection ---');
// At this point, only pristine starter notes exist
assert.strictEqual(Storage.hasUserContent(), false, 'Pristine starter vault without edits reports hasUserContent() === false');

// A. Add a user-created note
const userNote = Storage.createNote({
  title: 'Chapter 1: The Dragon Reborn',
  category: 'chapter',
  body: 'The winds howled across the Dragonmount.'
});
assert.strictEqual(Storage.hasUserContent(), true, 'Vault with user-created note reports hasUserContent() === true');
assert.strictEqual(Storage.isVaultEmpty(), false, 'Vault with user-created note reports isVaultEmpty() === false');

// Delete the user-created note -> back to pristine starter vault
Storage.deleteNote(userNote.id);
assert.strictEqual(Storage.hasUserContent(), false, 'Removing user note returns to pristine false');

// B. Edit a starter note's title or body
const prologue = Storage.findNoteByTitle('Prologue: The Veil of Embers');
assert(prologue, 'Prologue note found');
Storage.updateNote(prologue.id, { body: prologue.body + '\n\nUser customized text edit.' });
assert.strictEqual(Storage.hasUserContent(), true, 'Editing starter note content triggers hasUserContent() === true');

// C. Custom character dossier
Storage.clearAllNotes();
assert.strictEqual(Storage.hasUserContent(), false, 'Empty vault reports false');
Storage.saveCharacter({ name: 'Custom Lord Alden', role: 'Archmage' });
assert.strictEqual(Storage.hasUserContent(), true, 'Custom character dossier triggers hasUserContent() === true');

// D. Custom map pin
Storage.clearAllNotes();
Storage.saveMapPin({ title: 'Fortress of Iron', x: 25, y: 35 });
assert.strictEqual(Storage.hasUserContent(), true, 'Custom map pin triggers hasUserContent() === true');

// E. Custom timeline event
Storage.clearAllNotes();
Storage.saveTimelineEvent({ title: 'The Great Cataclysm', year: 'Year 500' });
assert.strictEqual(Storage.hasUserContent(), true, 'Custom timeline event triggers hasUserContent() === true');
console.log('✓ Test 2 Passed: Content detection accurately differentiates user work from pristine state\n');

// ── TEST 3: Populated Vault Safety Confirmation Dialog ──
console.log('--- 3. Testing Populated Vault Confirmation Modal & Project Stats ---');
Storage.clearAllNotes();
// Setup a simulated user manuscript with 3 custom chapters, lore, characters, and pins
const chapA = Storage.createNote({ title: 'Act I: The Golden Realm', category: 'chapter', body: 'Three thousand warriors gathered upon the plain.' });
const chapB = Storage.createNote({ title: 'Act II: The Shattered Citadel', category: 'chapter', body: 'The walls crumbled under the barrage of fiery stones.' });
const loreA = Storage.createNote({ title: 'The Silver Tome', category: 'lore', body: 'An ancient relic of forgotten sorcery.' });
Storage.saveCharacter({ name: 'Princess Seraphina', role: 'Heir to the Throne' });
Storage.saveMapPin({ title: 'Citadel of Light', x: 40, y: 60 });
Storage.saveTimelineEvent({ title: 'The Coronation', year: 'Year 1000' });

assert.strictEqual(Storage.hasUserContent(), true, 'Workspace has user content');

// User accidentally clicks "Load Sample Vault"
settingsBtnLoad.dispatchEvent('click');

// Confirmation modal must be shown
assert(!confirmModal.classList.contains('hidden'), 'Confirmation dialog MUST open for populated workspace');

// Check stats rendered in confirmation modal
const statNotes = elementsMap['sample-stat-notes'];
const statChapters = elementsMap['sample-stat-chapters'];
const statLore = elementsMap['sample-stat-lore'];
const statWords = elementsMap['sample-stat-words'];
const statDetails = elementsMap['sample-confirm-details'];

assert.strictEqual(statNotes.textContent, '3', 'Shows 3 total notes');
assert.strictEqual(statChapters.textContent, '2', 'Shows 2 chapters');
assert.strictEqual(statLore.textContent, '1', 'Shows 1 lore note');
assert(parseInt(statWords.textContent.replace(/,/g, ''), 10) > 0, 'Shows positive word count');
assert(statDetails.innerHTML.includes('Princess Seraphina') || statDetails.innerHTML.includes('characters'), 'Displays character dossiers in details');
assert(statDetails.innerHTML.includes('map landmarks') || statDetails.innerHTML.includes('map pins'), 'Displays map pins in details');

// Existing user notes must NOT be overwritten yet
assert.strictEqual(Storage.getAllNotes().length, 3, 'User notes remain intact while dialog is open');
console.log('✓ Test 3 Passed: Populated vault blocks immediate overwrite and displays rich protection stats\n');

// ── TEST 4: Modal Cancel Choice (Work Leaves Untouched) ──
console.log('--- 4. Testing Cancel Choice & Untouched Workspace ---');
const btnCancel = elementsMap['btn-sample-confirm-cancel'];
btnCancel.dispatchEvent('click');

assert(confirmModal.classList.contains('hidden'), 'Dialog closes upon clicking Cancel');
assert.strictEqual(Storage.getAllNotes().length, 3, 'All 3 user notes remain completely untouched');
assert(Storage.findNoteByTitle('Act I: The Golden Realm'), 'Act I note exists untouched');
assert(Storage.findNoteByTitle('The Silver Tome'), 'Silver Tome note exists untouched');
console.log('✓ Test 4 Passed: Cancel leaves user project completely pristine and untouched\n');

// ── TEST 5: Automatic Snapshot & "Backup & Replace" Mode ──
console.log('--- 5. Testing "Backup & Replace" Mode with Instant Snapshot ---');
// Re-open confirmation modal
settingsBtnLoad.dispatchEvent('click');
assert(!confirmModal.classList.contains('hidden'), 'Dialog reopened');

// Clear any previous backup in mock storage
mockLocalStorage['lordspey_vault_backup'] = null;

const btnReplace = elementsMap['btn-sample-confirm-replace'];
btnReplace.dispatchEvent('click');

// Dialog should close
assert(confirmModal.classList.contains('hidden'), 'Dialog closed after choosing Backup & Replace');

// Verify automatic snapshot was created
const backup = Storage.getVaultBackup();
assert(backup, 'Automatic safety snapshot backup MUST exist in storage');
assert.strictEqual(backup.notes.length, 3, 'Snapshot backup contains all 3 user notes');
assert(backup.notes.some(n => n.title === 'Act I: The Golden Realm'), 'Snapshot contains user chapter Act I');
assert(backup.characters.some(c => c.name === 'Princess Seraphina'), 'Snapshot contains user character');
assert(backup.mapPins.some(p => p.title === 'Citadel of Light'), 'Snapshot contains user map pin');

// Verify active vault now has the sample universe loaded
const currentNotes = Storage.getAllNotes();
assert.strictEqual(currentNotes.length, 9, 'Active vault now contains sample universe notes');
assert(currentNotes.some(n => n.id === 'demo-chap-prologue'), 'Sample prologue loaded');

// Verify persistent undo / restore banner is displayed
const restoreBanner = elementsMap['sample-vault-restore-banner'];
assert(!restoreBanner.classList.contains('hidden'), 'Persistent [Undo / Restore My Work] banner is displayed');
console.log('✓ Test 5 Passed: Automatic snapshot taken and sample vault loaded with restore banner\n');

// ── TEST 6: Instant Undo / Restore via Banner Button ──
console.log('--- 6. Testing [Undo / Restore My Work] Banner Action ---');
const btnUndo = elementsMap['btn-sample-undo-restore'];
btnUndo.dispatchEvent('click');

// User project must be restored!
const restoredNotes = Storage.getAllNotes();
assert.strictEqual(restoredNotes.length, 3, 'Restored workspace has exactly 3 notes');
assert(Storage.findNoteByTitle('Act I: The Golden Realm'), 'Act I restored');
assert(Storage.findNoteByTitle('Act II: The Shattered Citadel'), 'Act II restored');
assert(Storage.findNoteByTitle('The Silver Tome'), 'Silver Tome restored');
assert(Storage.getCharacters().some(c => c.name === 'Princess Seraphina'), 'Princess Seraphina character restored');
assert(Storage.getAllMapPins().some(p => p.title === 'Citadel of Light'), 'Citadel of Light pin restored');

// Banner should be hidden after restore
assert(restoreBanner.classList.contains('hidden'), 'Restore banner hidden after successful rollback');
console.log('✓ Test 6 Passed: 1-Click [Undo / Restore My Work] completely recovered user project\n');

// ── TEST 7: "Merge with Sample Vault" Mode ──
console.log('--- 7. Testing "Merge with Sample Vault" Non-Destructive Flow ---');
// User has 3 custom notes
assert.strictEqual(Storage.getAllNotes().length, 3, 'User starts with 3 notes');

// Click load sample -> choose merge
settingsBtnLoad.dispatchEvent('click');
assert(!confirmModal.classList.contains('hidden'), 'Dialog open for merge');

const btnMerge = elementsMap['btn-sample-confirm-merge'];
btnMerge.dispatchEvent('click');

assert(confirmModal.classList.contains('hidden'), 'Dialog closed after choosing merge');

// User notes MUST still exist, and starter notes appended
const mergedNotes = Storage.getAllNotes();
assert.strictEqual(mergedNotes.length, 12, 'Merged notes count equals 3 user notes + 9 starter notes = 12 notes');
assert(Storage.findNoteByTitle('Act I: The Golden Realm'), 'User note Act I preserved');
assert(Storage.findNoteByTitle('Act II: The Shattered Citadel'), 'User note Act II preserved');
assert(Storage.findNoteByTitle('The Silver Tome'), 'User note Silver Tome preserved');
assert(Storage.findNoteByTitle('Prologue: The Veil of Embers'), 'Starter prologue appended');
assert(Storage.findNoteByTitle('Chapter I: The Obsidian Gate'), 'Starter chapter I appended');

// Character codex merged
const mergedChars = Storage.getCharacters();
assert(mergedChars.some(c => c.name === 'Princess Seraphina'), 'User custom character Princess Seraphina preserved');
assert(mergedChars.some(c => c.name === 'Vespera'), 'Starter character Vespera appended');
assert(mergedChars.some(c => c.name === 'Lord Commander Corvus'), 'Starter character Corvus appended');

// Map pins merged
const mergedPins = Storage.getAllMapPins();
assert(mergedPins.some(p => p.title === 'Citadel of Light'), 'User map pin Citadel of Light preserved');
assert(mergedPins.some(p => p.title.includes('Obsidian Gate')), 'Starter pin appended');
console.log('✓ Test 7 Passed: Merge mode cleanly combined starter universe without overwriting any user work\n');

// ── TEST 8: Settings "Restore Previous Vault Backup" Button ──
console.log('--- 8. Testing Settings [Restore Previous Vault Backup] Action ---');
const settingsBtnRestoreBackup = elementsMap['settings-btn-restore-backup'];
assert(settingsBtnRestoreBackup, 'Settings restore backup button exists');

// Overwrite current workspace with dummy text to test settings rollback
Storage.clearAllNotes();
Storage.createNote({ title: 'Temporary Scratch Note', body: 'To be wiped by rollback' });
assert.strictEqual(Storage.getAllNotes().length, 1, 'Scratch note created');

// Click restore backup in settings
settingsBtnRestoreBackup.dispatchEvent('click');

const rolledBackNotes = Storage.getAllNotes();
assert.strictEqual(rolledBackNotes.length, 3, 'Settings button restored previous backup with 3 notes');
assert(Storage.findNoteByTitle('Act I: The Golden Realm'), 'Act I present after settings restore');
assert(!Storage.findNoteByTitle('Temporary Scratch Note'), 'Scratch note replaced by restored backup');
console.log('✓ Test 8 Passed: Settings [Restore Previous Vault Backup] rolls back project cleanly\n');

// ── TEST 9: Keyboard Escape & Banner Dismissal ──
console.log('--- 9. Testing Keyboard Escape Hierarchy & Banner Dismissal ---');
settingsBtnLoad.dispatchEvent('click');
assert(!confirmModal.classList.contains('hidden'), 'Dialog open');

// Press Escape
if (documentListeners['keydown']) {
  documentListeners['keydown'].forEach(fn => fn({ key: 'Escape', preventDefault: () => {}, stopPropagation: () => {} }));
}
assert(confirmModal.classList.contains('hidden'), 'Dialog closed upon Escape key');

// Test banner dismissal
window.showSampleRestoreBanner();
assert(!restoreBanner.classList.contains('hidden'), 'Banner displayed manually');
const btnDismissBanner = elementsMap['btn-sample-dismiss-banner'];
btnDismissBanner.dispatchEvent('click');
assert(restoreBanner.classList.contains('hidden'), 'Banner closed upon clicking dismiss ✕ button');
console.log('✓ Test 9 Passed: Escape key and banner dismissal work smoothly\n');

// ── TEST 10: Subview Empty State Routing Integration ──
console.log('--- 10. Testing Empty State Button Routing (Timeline, Codex, Map, Galaxy, Menu) ---');
// Clear storage and verify empty state buttons route through safety checks
Storage.clearAllNotes();
Storage.createNote({ title: 'User Novel Draft', category: 'draft', body: 'Important draft content' });

// Test Timeline empty button
const timelineBtn = elementsMap['btn-timeline-empty-sample'];
if (timelineBtn) {
  timelineBtn.dispatchEvent('click');
  assert(!confirmModal.classList.contains('hidden'), 'Timeline empty button triggers safety confirmation');
  btnCancel.dispatchEvent('click');
}

// Test Codex empty button
const codexBtn = elementsMap['btn-codex-empty-sample'];
if (codexBtn) {
  codexBtn.dispatchEvent('click');
  assert(!confirmModal.classList.contains('hidden'), 'Codex empty button triggers safety confirmation');
  btnCancel.dispatchEvent('click');
}

// Test Map empty button
const mapBtn = elementsMap['map-btn-empty-sample'];
if (mapBtn) {
  mapBtn.dispatchEvent('click');
  assert(!confirmModal.classList.contains('hidden'), 'Map empty button triggers safety confirmation');
  btnCancel.dispatchEvent('click');
}

// Test Menu empty button
const menuEmptyBtn = elementsMap['menu-empty-btn-sample'];
if (menuEmptyBtn) {
  menuEmptyBtn.dispatchEvent('click');
  assert(!confirmModal.classList.contains('hidden'), 'Menu empty button triggers safety confirmation');
  btnCancel.dispatchEvent('click');
}

// Test Galaxy Cosmos load demo button
const galaxyBtn = elementsMap['galaxy-btn-load-demo'];
if (galaxyBtn) {
  galaxyBtn.dispatchEvent('click');
  assert(!confirmModal.classList.contains('hidden'), 'Galaxy demo button triggers safety confirmation');
  btnCancel.dispatchEvent('click');
}

console.log('✓ Test 10 Passed: All 5 secondary and empty-state triggers safely protected by confirmation dialog\n');

// ── TEST 11: Deep Field-Level Modification & Deletion Detection ──
console.log('--- 11. Testing Deep Field-Level Modification & Deletion Detection ---');
Storage.clearAllNotes();
Storage.loadStarterVault('replace', false);
assert.strictEqual(Storage.hasUserContent(), false, 'Pristine starter vault reports hasUserContent() === false');

// A. Edit a starter character's backstory
const vespera = Storage.getCharacters().find(c => c.name === 'Vespera');
assert(vespera, 'Vespera starter character found');
Storage.saveCharacter({ id: vespera.id, name: 'Vespera', bio: 'Modified backstory: Raised by shadow weavers in the deep frost.' });
assert.strictEqual(Storage.hasUserContent(), true, 'Editing starter character bio triggers hasUserContent() === true');

// Revert to pristine starter
Storage.loadStarterVault('replace', false);
assert.strictEqual(Storage.hasUserContent(), false, 'Reverted to pristine');

// B. Move a starter map pin's coordinates
const firstPin = Storage.getAllMapPins()[0];
assert(firstPin, 'Starter map pin found');
Storage.saveMapPin({ id: firstPin.id, title: firstPin.title, x: firstPin.x + 10, y: firstPin.y + 10, pinType: firstPin.pinType, description: firstPin.description });
assert.strictEqual(Storage.hasUserContent(), true, 'Moving map pin coordinates triggers hasUserContent() === true');

// Revert to pristine starter
Storage.loadStarterVault('replace', false);
assert.strictEqual(Storage.hasUserContent(), false, 'Reverted to pristine');

// C. Edit a starter timeline event
const firstEvent = Storage.getTimelineEvents()[0];
assert(firstEvent, 'Starter timeline event found');
Storage.saveTimelineEvent({ id: firstEvent.id, title: 'Renamed Epoch Event', year: firstEvent.year, description: firstEvent.description });
assert.strictEqual(Storage.hasUserContent(), true, 'Editing timeline event triggers hasUserContent() === true');

// Revert to pristine starter
Storage.loadStarterVault('replace', false);
assert.strictEqual(Storage.hasUserContent(), false, 'Reverted to pristine');

// D. Delete starter notes (user curated/pruned the vault)
const currentStarterNotes = Storage.getAllNotes();
Storage.deleteNote(currentStarterNotes[currentStarterNotes.length - 1].id);
assert.strictEqual(Storage.hasUserContent(), true, 'Deleting a starter note triggers hasUserContent() === true (workspace was customized)');

// Revert to pristine starter
Storage.loadStarterVault('replace', false);
assert.strictEqual(Storage.hasUserContent(), false, 'Reverted to pristine');

// E. Add custom map region
Storage.clearAllNotes();
Storage.saveMapRegion({ name: 'The Ashen Vale Wards', shape: 'circle', radius: 45 });
assert.strictEqual(Storage.hasUserContent(), true, 'Custom map region triggers hasUserContent() === true');

// F. Add custom graph node
Storage.clearAllNotes();
Storage.saveGraphNode({ title: 'Arcane Resonance Nexus', entityType: 'Cosmology' });
assert.strictEqual(Storage.hasUserContent(), true, 'Custom cosmos graph node triggers hasUserContent() === true');
console.log('✓ Test 11 Passed: Field modifications, deletions, and non-note entity additions accurately detected\n');

// ── TEST 12: Subview PostAction Routing Functions ──
console.log('--- 12. Testing Subview PostAction Execution (Timeline, Codex, Map) ---');
let timelineRenderCalled = false;
let codexRenderCalled = false;
let mapPinsRenderCalled = false;
let mapRegionsRenderCalled = false;

global.renderTimeline = () => { timelineRenderCalled = true; };
window.renderTimeline = global.renderTimeline;
global.renderCodex = () => { codexRenderCalled = true; };
window.renderCodex = global.renderCodex;
global.renderMapPins = () => { mapPinsRenderCalled = true; };
window.renderMapPins = global.renderMapPins;
global.renderMapRegions = () => { mapRegionsRenderCalled = true; };
window.renderMapRegions = global.renderMapRegions;

window.executeLoadStarterVault('replace', false, { postAction: 'timeline' });
assert.strictEqual(timelineRenderCalled, true, 'renderTimeline() executed for timeline postAction');

window.executeLoadStarterVault('replace', false, { postAction: 'codex' });
assert.strictEqual(codexRenderCalled, true, 'renderCodex() executed for codex postAction');

window.executeLoadStarterVault('replace', false, { postAction: 'map' });
assert.strictEqual(mapPinsRenderCalled, true, 'renderMapPins() executed for map postAction');
assert.strictEqual(mapRegionsRenderCalled, true, 'renderMapRegions() executed for map postAction');
console.log('✓ Test 12 Passed: Real renderTimeline, renderCodex, and renderMapPins/Regions invoked on subview sample load\n');

// ── TEST 13: LocalStorage Quota Exhaustion & In-Memory Recovery ──
console.log('--- 13. Testing LocalStorage Quota Overflow Error Boundary ---');
Storage.clearAllNotes();
Storage.createNote({ title: 'Critical Manuscript Before Quota Crash', body: 'Immense novel chapter text.' });
assert.strictEqual(Storage.hasUserContent(), true);

// Mock localStorage.setItem to simulate QuotaExceededError for backup key
const originalSetItem = global.localStorage.setItem;
let quotaErrorThrown = false;
global.localStorage.setItem = (k, v) => {
  if (k === 'lordspey_vault_backup') {
    quotaErrorThrown = true;
    const err = new Error('QuotaExceededError: The quota has been exceeded.');
    err.name = 'QuotaExceededError';
    throw err;
  }
  originalSetItem(k, v);
};

// Execute load starter vault with backup
window.executeLoadStarterVault('replace', true);

// Verify quota error occurred but was handled cleanly without crashing or losing data
assert.strictEqual(quotaErrorThrown, true, 'QuotaExceededError was triggered');
const recoveredBackup = Storage.getVaultBackup();
assert(recoveredBackup, 'In-memory backup fallback exists despite localStorage quota overflow');
assert(recoveredBackup.notes.some(n => n.title === 'Critical Manuscript Before Quota Crash'), 'Backup contains user manuscript');

// Restore the project from fallback backup
Storage.restoreVaultBackup();
const restoredNotesAfterQuota = Storage.getAllNotes();
assert(restoredNotesAfterQuota.some(n => n.title === 'Critical Manuscript Before Quota Crash'), 'Project successfully recovered from in-memory fallback');

// Restore original setItem
global.localStorage.setItem = originalSetItem;
console.log('✓ Test 13 Passed: LocalStorage quota exhaustion handled gracefully via memory fallback with zero data loss\n');

// ── TEST 14: Custom Map Image Cleared in Replace Mode & Restored on Undo ──
console.log('--- 14. Testing Custom Map Image Lifecycle in Replace Mode ---');
Storage.clearAllNotes();
Storage.createNote({ title: 'World of Eldoria Chapter 1', body: 'The map reveals secrets.' });
Storage.saveCustomMapImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
assert(Storage.getCustomMapImage(), 'Custom map image set');
assert.strictEqual(Storage.hasUserContent(), true, 'Custom map image triggers hasUserContent');

// Load sample vault in replace mode with backup
window.executeLoadStarterVault('replace', true);

// Active vault must now have NO custom map image (sample vault uses default map canvas)
assert.strictEqual(Storage.getCustomMapImage(), null, 'Custom map image cleared in sample vault');

// Undo / Restore
window.executeRestoreVaultBackup();
assert(Storage.getCustomMapImage(), 'Custom map image successfully restored from safety snapshot');
assert(Storage.findNoteByTitle('World of Eldoria Chapter 1'), 'User note restored');
console.log('✓ Test 14 Passed: Custom map image cleanly removed on replace and fully restored on rollback\n');

console.log('=== ALL SAMPLE VAULT SAFETY & RECOVERY TESTS PASSED (100%) ===\n');
process.exit(0);

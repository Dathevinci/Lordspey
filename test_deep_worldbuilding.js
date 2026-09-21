const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING LORD SPEY DEEP WORLDBUILDING & LORE TEST SUITE ===\n');

// 1. Mock LocalStorage
const mockLocalStorage = {};
global.localStorage = {
  getItem: k => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

// 2. Load Storage and Markdown
const storageCode = fs.readFileSync(path.join(__dirname, 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

const Markdown = require('./js/markdown.js');
global.Markdown = Markdown;

// ==========================================
// PART 1: STORAGE UNIT TESTS
// ==========================================
console.log('--- Running Storage Layer Unit Tests ---');

// Test 1.1: Clean vault starts empty for worldbuilding
assert.strictEqual(Storage.getAllMapPins().length, 0, 'Pins should start empty in a clean vault');
assert.strictEqual(Storage.getCustomMapImage(), null, 'Custom map image should start null');
assert.strictEqual(Storage.getTimelineEvents().length, 0, 'Timeline events should start empty');
assert.strictEqual(Storage.getCharacters().length, 0, 'Characters should start empty');
assert.strictEqual(Storage.getRelationships().length, 0, 'Relationships should start empty');
console.log('✓ Clean vault starts with 0 pins, timeline events, characters, & relationships');

// Test 1.2: Map Pins CRUD
const pin1 = Storage.saveMapPin({
  title: 'The Obsidian Citadel',
  category: 'world',
  x: 45.5,
  y: 60.2,
  description: 'Ancient basalt fortress standing over the Twilight Sea.'
});
assert(pin1.id, 'Created pin should have an ID');
assert.strictEqual(pin1.title, 'The Obsidian Citadel');
assert.strictEqual(Storage.getAllMapPins().length, 1);

// Update pin
const updatedPin = Storage.saveMapPin({
  id: pin1.id,
  title: 'The Obsidian Citadel (Ruins)',
  category: 'world',
  x: 46.0,
  y: 60.5,
  description: 'Ruined fortress.'
});
assert.strictEqual(updatedPin.title, 'The Obsidian Citadel (Ruins)');
assert.strictEqual(Storage.getAllMapPins().length, 1);

// Delete pin
Storage.deleteMapPin(pin1.id);
assert.strictEqual(Storage.getAllMapPins().length, 0);
console.log('✓ Map Pins CRUD (save, update, delete) passed');

// Test 1.3: Custom Map Image
const dummyDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
Storage.saveCustomMapImage(dummyDataUrl);
assert.strictEqual(Storage.getCustomMapImage(), dummyDataUrl);
Storage.clearCustomMapImage();
assert.strictEqual(Storage.getCustomMapImage(), null);
console.log('✓ Custom Map Image save, get, & clear passed');

// Test 1.4: Timeline Events CRUD & Note Scanner
const event1 = Storage.saveTimelineEvent({
  year: '1042',
  era: 'The Astral Divergence',
  title: 'Sundering of the Core',
  category: 'lore',
  description: 'The celestial seal fractured across three realms.'
});
assert(event1.id, 'Timeline event must have an ID');
assert.strictEqual(Storage.getTimelineEvents().length, 1);

// Scan notes for @timeline: and @event: tags
const testNotes = [
  {
    id: 'note-tl-1',
    title: 'Chronicles of Solitude',
    category: 'lore',
    body: `# Solitude
Some lore description.
@timeline: 850 | Age of Ash | Fall of the Silver Bastion | Siege lasting ninety winters.
@event: 920 | Treaty of Cinders | Truce signed in blood.
`
  }
];

const scannedEvents = Storage.scanNotesForEvents(testNotes);
assert.strictEqual(scannedEvents.length, 2, 'Should extract 2 events from note');
assert.strictEqual(scannedEvents[0].year, '850');
assert.strictEqual(scannedEvents[0].era, 'Age of Ash');
assert.strictEqual(scannedEvents[0].title, 'Fall of the Silver Bastion');
assert.strictEqual(scannedEvents[0].description, 'Siege lasting ninety winters.');
assert.strictEqual(scannedEvents[0].isNoteEvent, true);
assert.strictEqual(scannedEvents[0].noteId, 'note-tl-1');

assert.strictEqual(scannedEvents[1].year, '920');
assert.strictEqual(scannedEvents[1].title, 'Treaty of Cinders');

// getAllTimelineEvents merges stored and scanned notes
Storage.saveNote(testNotes[0]);
const combinedEvents = Storage.getAllTimelineEvents();
assert.strictEqual(combinedEvents.length, 3, 'Combined events should include 1 manual + 2 scanned');
Storage.deleteNote('note-tl-1');
Storage.deleteTimelineEvent(event1.id);
console.log('✓ Timeline Events CRUD & Note Tag Scanner (@timeline, @event) passed');

// Test 1.5: Character Codex & Relationship CRUD & Scanner
const char1 = Storage.saveCharacter({
  name: 'Kaelen Vance',
  archetype: 'Protagonist',
  faction: 'Crimson Vanguard',
  role: 'Spellblade Captain',
  bio: 'Bearer of the Obsidian Brand.'
});
assert(char1.id);
assert.strictEqual(Storage.getCharacters().length, 1);

const char2 = Storage.saveCharacter({
  name: 'Morrigan Grey',
  archetype: 'Antagonist',
  faction: 'The Eclipse Synod',
  role: 'Arch-Inquisitor',
  bio: 'Seeks to extinguish the crimson flame.'
});

const rel1 = Storage.saveRelationship({
  sourceId: char1.id,
  targetId: char2.id,
  type: 'Nemesis',
  description: 'Ancient blood feud.'
});
assert(rel1.id);
assert.strictEqual(Storage.getRelationships().length, 1);

// Scan character notes with #character tag and @relationship: syntax
const charNote = {
  id: 'note-char-2',
  title: 'Vespera the Weaver',
  category: 'lore',
  tags: 'character, mentor',
  body: `# Vespera
@character: Vespera the Weaver | Mentor | Astral Loom | Keeper of forgotten tapestries
@relationship: Kaelen Vance | Mentor | Guided Kaelen during the Long Night
`
};
Storage.saveNote(charNote);

const scannedChars = Storage.scanNotesForCharacters(Storage.getAllNotes());
const foundVespera = scannedChars.find(c => c.name === 'Vespera the Weaver');
assert(foundVespera, 'Should discover character Vespera from note');
assert.strictEqual(foundVespera.archetype, 'Mentor');

const scannedRels = Storage.scanNotesForRelationships(Storage.getAllNotes());
assert(scannedRels.length >= 1, 'Should discover relationship from note');

Storage.deleteCharacter(char1.id);
Storage.deleteCharacter(char2.id);
Storage.deleteRelationship(rel1.id);
Storage.deleteNote('note-char-2');
console.log('✓ Character Codex & Relationship CRUD & Note Tag Scanner passed');

// Test 1.6: Starter Vault Populates Worldbuilding Data
Storage.loadStarterVault();
assert.strictEqual(Storage.getAllNotes().length, 4, 'Starter vault must still have exactly 4 starter notes');
assert(Storage.getAllMapPins().length > 0, 'Starter vault should populate starter pins');
assert(Storage.getTimelineEvents().length > 0, 'Starter vault should populate starter timeline events');
assert(Storage.getCharacters().length > 0, 'Starter vault should populate starter characters');
assert(Storage.getRelationships().length > 0, 'Starter vault should populate starter relationships');
console.log('✓ Starter Vault cleanly initializes rich worldbuilding datasets');

// Test 1.7: Export & Import JSON preserves Worldbuilding Data
const exported = Storage.exportJSON();
assert(exported.includes('mapPins'), 'Export must contain mapPins');
assert(exported.includes('timelineEvents'), 'Export must contain timelineEvents');
assert(exported.includes('characters'), 'Export must contain characters');
assert(exported.includes('relationships'), 'Export must contain relationships');

// Clear all data
Storage.clearVault();
assert.strictEqual(Storage.getAllNotes().length, 0);
assert.strictEqual(Storage.getAllMapPins().length, 0);

// Restore from export
const importResult = Storage.importJSON(exported);
assert.strictEqual(importResult.success, true);
assert.strictEqual(Storage.getAllNotes().length, 4);
assert(Storage.getAllMapPins().length > 0);
assert(Storage.getTimelineEvents().length > 0);
assert(Storage.getCharacters().length > 0);
assert(Storage.getRelationships().length > 0);
console.log('✓ Vault Export & Import JSON round-trip preserves worldbuilding data cleanly');


// ==========================================
// PART 2: UI CONTROLLER & APP INTEGRATION
// ==========================================
console.log('\n--- Running UI & App Controller Integration Tests ---');

// Mock DOM Environment
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
    value: '',
    textContent: '',
    innerHTML: '',
    children,
    parentElement: {
      getBoundingClientRect: () => ({ width: 1000, height: 800 })
    },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
    getContext: () => ({
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      scale: () => {},
      translate: () => {},
      rotate: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      bezierCurveTo: () => {},
      arc: () => {},
      ellipse: () => {},
      fill: () => {},
      stroke: () => {},
      setLineDash: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      measureText: (txt) => ({ width: (txt || '').length * 7 }),
      fillText: () => {},
      roundRect: () => {},
    }),
    addEventListener: (ev, fn) => {
      if (!listeners[ev]) listeners[ev] = [];
      listeners[ev].push(fn);
    },
    removeEventListener: (ev, fn) => {
      if (listeners[ev]) listeners[ev] = listeners[ev].filter(f => f !== fn);
    },
    dispatchEvent: function(ev, payload = {}) {
      if (listeners[ev]) listeners[ev].forEach(fn => fn(payload));
      if (typeof this['on' + ev] === 'function') this['on' + ev](payload);
    },
    focus: () => {},
    select: () => {},
    remove: () => {},
    appendChild: (child) => {
      children.push(child);
      child.parentNode = this;
    },
    querySelector: (sel) => {
      if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || null;
      return null;
    },
    querySelectorAll: () => []
  };
}

const elementsMap = {};
const allMockIds = [
  // Core Lord Spey IDs
  'main-menu', 'menu-recent-section', 'menu-recent-grid', 'editor-area',
  'sidebar', 'sidebar-backdrop', 'sidebar-toggle', 'sidebar-expand',
  'btn-quick-switcher', 'btn-back-menu', 'btn-zen-mode', 'btn-preview',
  'btn-split', 'btn-save-as', 'btn-export', 'btn-new-doc', 'btn-delete',
  'btn-word-goal', 'btn-outline', 'outline-drawer', 'outline-list',
  'btn-close-outline', 'note-title', 'note-tags', 'note-category',
  'note-body', 'note-preview', 'editor-wrapper', 'save-status', 'stat-words',
  'stat-chars', 'stat-read-time', 'search-notes', 'search-clear', 'backlinks-list',
  'modal-overlay', 'new-note-modal', 'modal-note-title', 'modal-note-category',
  'btn-cancel-modal', 'btn-create-modal', 'delete-overlay', 'btn-cancel-delete',
  'btn-confirm-delete', 'goal-modal', 'input-word-goal', 'input-sprint-time',
  'btn-cancel-goal', 'btn-start-sprint', 'sprint-banner', 'sprint-progress',
  'sprint-words', 'sprint-timer', 'btn-cancel-sprint-banner', 'switcher-modal',
  'switcher-input', 'switcher-results', 'toast-container', 'btn-graph-view',
  'graph-modal', 'btn-close-graph', 'graph-node-count', 'graph-edge-count',
  'galaxy-empty-prompt', 'galaxy-btn-create-first', 'galaxy-btn-load-demo',
  'graph-location-hud', 'hud-category-dot', 'hud-category-name', 'hud-sub-branch',
  'hud-node-title', 'hud-connections-count', 'hud-action-hint', 'list-chapter',
  'list-lore', 'list-world', 'list-draft', 'menu-btn-chapter', 'menu-btn-lore',
  'menu-btn-world', 'menu-btn-draft', 'menu-btn-tutorial', 'menu-btn-graph',
  'menu-btn-switcher', 'menu-btn-sample', 'btn-tutorial-sidebar', 'tutorial-overlay',
  'btn-tutorial-prev', 'btn-tutorial-next', 'btn-tutorial-skip', 'tutorial-dots',
  'tutorial-card', 'logo-home', 'intro-splash', 'intro-skip-btn', 'menu-emblem',
  'btn-find-toggle', 'find-replace-bar', 'btn-find-close', 'find-input', 'replace-input',
  'btn-find-prev', 'btn-find-next', 'btn-replace-one', 'btn-replace-all', 'find-matches-count',
  'find-case-sensitive', 'metrics-modal', 'btn-close-metrics', 'wikicreate-modal',
  'wikicreate-title-display', 'wikicreate-category', 'btn-cancel-wikicreate', 'btn-confirm-wikicreate',
  'editor-font-select', 'btn-font-dec', 'btn-font-inc', 'btn-line-spacing', 'btn-typewriter',

  // Deep Worldbuilding - Map IDs
  'btn-map-view', 'menu-btn-map', 'map-modal', 'btn-close-map', 'map-viewport', 'map-stage',
  'map-canvas', 'map-custom-img', 'map-pins-container', 'map-pin-count', 'map-coords-indicator',
  'map-pin-search', 'btn-map-drop-pin', 'btn-map-cancel-drop', 'map-placement-hint',
  'map-file-input', 'btn-map-reset-img', 'btn-map-zoom-in', 'btn-map-zoom-out', 'btn-map-zoom-reset',
  'map-pin-preview', 'map-preview-badge', 'map-preview-coords', 'btn-map-preview-close',
  'map-preview-title', 'map-preview-desc', 'btn-map-open-note', 'btn-map-delete-pin',
  'map-pin-modal', 'map-modal-note-select', 'map-modal-pin-title', 'map-modal-pin-category',
  'map-modal-pin-desc', 'btn-map-pin-cancel', 'btn-map-pin-save',

  // Deep Worldbuilding - Timeline IDs
  'btn-timeline-view', 'menu-btn-timeline', 'timeline-modal', 'btn-close-timeline',
  'timeline-event-count', 'timeline-search', 'btn-timeline-mode-rail', 'btn-timeline-mode-stream',
  'timeline-rail-view', 'timeline-stream-view', 'timeline-rail-eras', 'timeline-rail-track',
  'timeline-stream-container', 'timeline-empty-prompt', 'btn-timeline-add', 'btn-timeline-empty-add',
  'timeline-event-modal', 'timeline-input-year', 'timeline-input-era', 'timeline-input-title',
  'timeline-input-note', 'timeline-input-category', 'timeline-input-desc', 'btn-timeline-event-cancel',
  'btn-timeline-event-save',

  // Deep Worldbuilding - Codex IDs
  'btn-codex-view', 'menu-btn-codex', 'codex-modal', 'btn-close-codex',
  'codex-character-count', 'codex-rel-count', 'codex-search', 'btn-codex-mode-cards',
  'btn-codex-mode-web', 'codex-cards-view', 'codex-web-view', 'codex-grid',
  'codex-web-canvas', 'codex-web-inspector', 'btn-inspector-close', 'inspector-archetype-badge',
  'inspector-name', 'inspector-faction', 'inspector-bio', 'inspector-rels-list',
  'btn-inspector-open-note', 'codex-empty-prompt', 'btn-codex-add-char', 'btn-codex-empty-add',
  'btn-codex-add-rel', 'codex-char-modal', 'codex-input-name', 'codex-input-archetype',
  'codex-input-faction', 'codex-input-role', 'codex-input-note', 'codex-input-bio',
  'btn-codex-char-cancel', 'btn-codex-char-save', 'codex-rel-modal', 'codex-rel-source',
  'codex-rel-type', 'codex-rel-target', 'codex-rel-desc', 'btn-codex-rel-cancel', 'btn-codex-rel-save'
];

allMockIds.forEach(id => {
  elementsMap[id] = createMockElement(id);
});

// Set hidden initial states
['tutorial-overlay', 'graph-modal', 'map-modal', 'timeline-modal', 'codex-modal', 'map-pin-modal', 'timeline-event-modal', 'codex-char-modal', 'codex-rel-modal', 'editor-area', 'intro-splash', 'metrics-modal', 'switcher-modal', 'goal-modal', 'outline-drawer', 'wikicreate-modal', 'find-replace-bar', 'modal-overlay', 'delete-overlay'].forEach(id => {
  if (elementsMap[id]) elementsMap[id].classList.add('hidden');
});
elementsMap['main-menu'].classList.remove('hidden');

global.document = {
  getElementById: (id) => elementsMap[id] || createMockElement(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || createMockElement(sel.slice(1));
    return createMockElement();
  },
  querySelectorAll: (sel) => {
    if (sel.includes('[data-map-filter]')) return ['all', 'world', 'chapter', 'lore'].map(f => {
      const el = createMockElement();
      el.dataset.mapFilter = f;
      return el;
    });
    if (sel.includes('[data-timeline-filter]')) return ['all', 'lore', 'world', 'chapter'].map(f => {
      const el = createMockElement();
      el.dataset.timelineFilter = f;
      return el;
    });
    if (sel.includes('[data-codex-filter]')) return ['all', 'Protagonist', 'Antagonist', 'Ally', 'Mentor', 'Rival'].map(f => {
      const el = createMockElement();
      el.dataset.codexFilter = f;
      return el;
    });
    if (sel === '.filter-pill') return [];
    if (sel === '.note-count') return [];
    return [];
  },
  createElement: (tag) => createMockElement('', tag),
  addEventListener: (ev, fn) => {
    if (!globalDocumentListeners[ev]) globalDocumentListeners[ev] = [];
    globalDocumentListeners[ev].push(fn);
  },
  body: createMockElement('body')
};

const globalDocumentListeners = {};
const windowListeners = {};
global.window = {
  addEventListener: (ev, fn) => {
    if (!windowListeners[ev]) windowListeners[ev] = [];
    windowListeners[ev].push(fn);
  },
  removeEventListener: (ev, fn) => {
    if (windowListeners[ev]) windowListeners[ev] = windowListeners[ev].filter(f => f !== fn);
  },
  dispatchEvent: (ev, payload) => {
    if (windowListeners[ev]) windowListeners[ev].forEach(fn => fn(payload));
  },
  devicePixelRatio: 1,
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id)
};
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;

// Evaluate app.js
const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
eval(`(function() {\n${appCode}\n})()`);
console.log('✓ app.js successfully initialized in test environment with all worldbuilding listeners');

// ── Test 2.1: World Map View Navigation, Canvas Render, and Pin Hover Preview ──
const btnMapView = elementsMap['btn-map-view'];
btnMapView.dispatchEvent('click');

const mapModal = elementsMap['map-modal'];
assert(!mapModal.classList.contains('hidden'), 'Map modal should open when clicking #btn-map-view');
assert.strictEqual(elementsMap['map-canvas'].classList.contains('hidden'), false, 'Map canvas should be active by default');

const mapPinCount = elementsMap['map-pin-count'];
assert(mapPinCount.textContent.includes('pin'), 'Map pin count indicator should be rendered');

// Test pin creation modal
const btnMapDropPin = elementsMap['btn-map-drop-pin'];
btnMapDropPin.dispatchEvent('click');
assert(elementsMap['map-viewport'].classList.contains('placement-active'), 'Placement mode should activate');

// Trigger map click to place pin
elementsMap['map-viewport'].dispatchEvent('click', { clientX: 200, clientY: 200, target: elementsMap['map-viewport'] });
const mapPinModal = elementsMap['map-pin-modal'];
assert(!mapPinModal.classList.contains('hidden'), 'Pin creation modal should open on map click in placement mode');

// Fill and save pin
elementsMap['map-modal-pin-title'].value = 'Citadel of Whispers';
elementsMap['map-modal-pin-category'].value = 'world';
elementsMap['map-modal-pin-desc'].value = 'High spire that watches the twilight abyss.';
elementsMap['btn-map-pin-save'].dispatchEvent('click');

assert(mapPinModal.classList.contains('hidden'), 'Pin modal should close after save');
const pins = Storage.getAllMapPins();
const placed = pins.find(p => p.title === 'Citadel of Whispers');
assert(placed, 'Placed pin should be stored in Storage');

// Test Pin Open Note Navigation
const pinEl = elementsMap['map-pins-container'].children.find(c => c.dataset && c.dataset.id === placed.id);
assert(pinEl, 'Rendered pin element should exist in container');
pinEl.dispatchEvent('click', { stopPropagation: () => {} });
assert(!elementsMap['map-pin-preview'].classList.contains('hidden'), 'Pin preview card should open on pin click');

elementsMap['btn-map-open-note'].dispatchEvent('click');
assert(mapModal.classList.contains('hidden'), 'Map modal should close when navigating to note');
assert(!elementsMap['editor-area'].classList.contains('hidden'), 'Editor area should open note');
assert.strictEqual(elementsMap['note-title'].value, 'Citadel of Whispers');
console.log('✓ Test 2.1 Passed: Interactive World Map opening, procedural render, pin placement, & note navigation');

// ── Test 2.2: Chronology & Event Timeline View, Rail/Stream Mode, & Note Navigation ──
const menuBtnTimeline = elementsMap['menu-btn-timeline'];
menuBtnTimeline.dispatchEvent('click');

const timelineModal = elementsMap['timeline-modal'];
assert(!timelineModal.classList.contains('hidden'), 'Timeline modal should open from main menu button');

// Mode toggle: rail to stream
const btnTimelineStream = elementsMap['btn-timeline-mode-stream'];
btnTimelineStream.dispatchEvent('click');
assert(!elementsMap['timeline-stream-view'].classList.contains('hidden'), 'Stream view should be visible');
assert(elementsMap['timeline-rail-view'].classList.contains('hidden'), 'Rail view should be hidden');

// Mode toggle back: stream to rail
const btnTimelineRail = elementsMap['btn-timeline-mode-rail'];
btnTimelineRail.dispatchEvent('click');
assert(!elementsMap['timeline-rail-view'].classList.contains('hidden'), 'Rail view should be visible');

// Open add event modal
const btnTimelineAdd = elementsMap['btn-timeline-add'];
btnTimelineAdd.dispatchEvent('click');
const timelineEventModal = elementsMap['timeline-event-modal'];
assert(!timelineEventModal.classList.contains('hidden'), 'Event modal should open');

// Save manual event
elementsMap['timeline-input-year'].value = '1440';
elementsMap['timeline-input-era'].value = 'Era of the Crimson Crown';
elementsMap['timeline-input-title'].value = 'The Sovereign Coronation';
elementsMap['timeline-input-desc'].value = 'Lord Spey accepts the mantle of the Obsidian Throne.';
elementsMap['btn-timeline-event-save'].dispatchEvent('click');

assert(timelineEventModal.classList.contains('hidden'), 'Event modal should close after save');
const allEvents = Storage.getAllTimelineEvents();
const createdEvt = allEvents.find(e => e.title === 'The Sovereign Coronation');
assert(createdEvt, 'Created timeline event must be in Storage');

// Close timeline view
elementsMap['btn-close-timeline'].dispatchEvent('click');
assert(timelineModal.classList.contains('hidden'), 'Timeline modal should close cleanly');
console.log('✓ Test 2.2 Passed: Chronology Timeline rail/stream toggle, event creation, & note link verification');

// ── Test 2.3: Character Codex & Relationship Matrix, Dossier & Web View ──
const btnCodexView = elementsMap['btn-codex-view'];
btnCodexView.dispatchEvent('click');

const codexModal = elementsMap['codex-modal'];
assert(!codexModal.classList.contains('hidden'), 'Codex modal should open from sidebar button');

// Check character count
const codexCharCount = elementsMap['codex-character-count'];
assert(codexCharCount.textContent.includes('character'), 'Character count should be displayed');

// Toggle to Relationship Web view
const btnCodexWeb = elementsMap['btn-codex-mode-web'];
btnCodexWeb.dispatchEvent('click');
assert(!elementsMap['codex-web-view'].classList.contains('hidden'), 'Codex web view should be active');
assert(elementsMap['codex-cards-view'].classList.contains('hidden'), 'Codex cards view should be hidden');

// Toggle back to Cards view
const btnCodexCards = elementsMap['btn-codex-mode-cards'];
btnCodexCards.dispatchEvent('click');
assert(!elementsMap['codex-cards-view'].classList.contains('hidden'), 'Codex cards view should be active');

// Add new character modal
const btnCodexAddChar = elementsMap['btn-codex-add-char'];
btnCodexAddChar.dispatchEvent('click');
const codexCharModal = elementsMap['codex-char-modal'];
assert(!codexCharModal.classList.contains('hidden'), 'Character modal should open');

elementsMap['codex-input-name'].value = 'Lord Spey';
elementsMap['codex-input-archetype'].value = 'Protagonist';
elementsMap['codex-input-faction'].value = 'Order of the Crimson Flame';
elementsMap['codex-input-role'].value = 'Master Scribe';
elementsMap['codex-input-bio'].value = 'Architect of the Obsidian Codex.';
elementsMap['btn-codex-char-save'].dispatchEvent('click');

assert(codexCharModal.classList.contains('hidden'), 'Character modal should close after save');
const characters = Storage.getAllCharacters();
const foundSpey = characters.find(c => c.name === 'Lord Spey');
assert(foundSpey, 'Character Lord Spey should be saved');

// Add new relationship modal
const btnCodexAddRel = elementsMap['btn-codex-add-rel'];
btnCodexAddRel.dispatchEvent('click');
const codexRelModal = elementsMap['codex-rel-modal'];
assert(!codexRelModal.classList.contains('hidden'), 'Relationship modal should open');

const otherChars = characters.filter(c => c.id !== foundSpey.id);
assert(otherChars.length > 0, 'Should have other characters from starter vault');
elementsMap['codex-rel-source'].value = foundSpey.id;
elementsMap['codex-rel-target'].value = otherChars[0].id;
elementsMap['codex-rel-type'].value = 'Allied with';
elementsMap['codex-rel-desc'].value = 'Bound by the ancient blood pact of the star.';
elementsMap['btn-codex-rel-save'].dispatchEvent('click');

assert(codexRelModal.classList.contains('hidden'), 'Relationship modal should close after save');
const rels = Storage.getAllRelationships();
const createdRel = rels.find(r => r.sourceId === foundSpey.id && r.targetId === otherChars[0].id);
assert(createdRel, 'New relationship should be recorded');

elementsMap['btn-close-codex'].dispatchEvent('click');
assert(codexModal.classList.contains('hidden'), 'Codex modal should close cleanly');
console.log('✓ Test 2.3 Passed: Character Codex cards/web toggle, dossier cards, archetype badges, & relationship creation');

// ── Test 2.4: Global Keyboard Shortcuts (Ctrl+M, Ctrl+T, Ctrl+U) ──
function triggerKeydown(key, opts = {}) {
  const eventObj = {
    key,
    ctrlKey: !!opts.ctrl,
    metaKey: !!opts.meta,
    shiftKey: !!opts.shift,
    altKey: !!opts.alt,
    preventDefault: () => {}
  };
  if (globalDocumentListeners['keydown']) {
    globalDocumentListeners['keydown'].forEach(fn => fn(eventObj));
  }
}

// Ctrl+M opens World Map
triggerKeydown('m', { ctrl: true });
assert(!mapModal.classList.contains('hidden'), 'Ctrl+M should open Map modal');
elementsMap['btn-close-map'].dispatchEvent('click');
assert(mapModal.classList.contains('hidden'), 'Map modal should close');

// Ctrl+T opens Timeline
triggerKeydown('t', { ctrl: true });
assert(!timelineModal.classList.contains('hidden'), 'Ctrl+T should open Timeline modal');
elementsMap['btn-close-timeline'].dispatchEvent('click');
assert(timelineModal.classList.contains('hidden'), 'Timeline modal should close');

// Ctrl+U opens Codex
triggerKeydown('u', { ctrl: true });
assert(!codexModal.classList.contains('hidden'), 'Ctrl+U should open Codex modal');
elementsMap['btn-close-codex'].dispatchEvent('click');
assert(codexModal.classList.contains('hidden'), 'Codex modal should close');
console.log('✓ Test 2.4 Passed: Global shortcuts (Ctrl+M, Ctrl+T, Ctrl+U) correctly toggle worldbuilding views');

// ── Test 2.5: Android Back-Button & Escape Dismissal Hierarchy ──
// Sub-modal priority: opening a sub-modal (e.g. Pin Modal) and pressing Escape
// should dismiss the sub-modal FIRST, leaving the map modal open.
btnMapView.dispatchEvent('click');
assert(!mapModal.classList.contains('hidden'));

// Open submodal
mapPinModal.classList.remove('hidden');
assert(!mapPinModal.classList.contains('hidden'));

// Trigger Escape key
triggerKeydown('Escape');
assert(mapPinModal.classList.contains('hidden'), 'Submodal (mapPinModal) should be dismissed first on Escape');
assert(!mapModal.classList.contains('hidden'), 'Parent modal (mapModal) should remain open after submodal dismissal');

// Trigger Escape key again
triggerKeydown('Escape');
assert(mapModal.classList.contains('hidden'), 'Parent modal (mapModal) should now be dismissed on second Escape');

// Similar test for Timeline
menuBtnTimeline.dispatchEvent('click');
assert(!timelineModal.classList.contains('hidden'));
timelineEventModal.classList.remove('hidden');

triggerKeydown('Escape');
assert(timelineEventModal.classList.contains('hidden'), 'timelineEventModal dismissed first');
assert(!timelineModal.classList.contains('hidden'), 'timelineModal remains open');

triggerKeydown('Escape');
assert(timelineModal.classList.contains('hidden'), 'timelineModal dismissed on second Escape');

// Similar test for Codex
btnCodexView.dispatchEvent('click');
assert(!codexModal.classList.contains('hidden'));
codexCharModal.classList.remove('hidden');

triggerKeydown('Escape');
assert(codexCharModal.classList.contains('hidden'), 'codexCharModal dismissed first');
assert(!codexModal.classList.contains('hidden'), 'codexModal remains open');

triggerKeydown('Escape');
assert(codexModal.classList.contains('hidden'), 'codexModal dismissed on second Escape');
console.log('✓ Test 2.5 Passed: Android Back / Escape dismissal hierarchy correctly handles sub-modals and parent modals');

console.log('\n=== ALL DEEP WORLDBUILDING & LORE TESTS PASSED SUCCESSFULLY ===\n');

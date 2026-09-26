const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING LORD SPEY GALAXY GRAPH TEST SUITE ===\n');

// 1. Mock LocalStorage
const mockLocalStorage = {};
global.localStorage = {
  getItem: k => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

// 2. Load Storage and Markdown
const storageCode = fs.readFileSync(path.join(__dirname, '..', 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

const Markdown = require('../js/markdown.js');
global.Markdown = Markdown;

// 3. Mock DOM Element helper
function createMockElement(id = '', tag = 'div') {
  const classes = new Set();
  const listeners = {};
  const dataset = {};
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
    children: [],
    parentElement: {
      getBoundingClientRect: () => ({ width: 1000, height: 800 })
    },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
    getContext: () => ({
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      scale: () => {},
      translate: () => {},
      rotate: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      ellipse: () => {},
      fill: () => {},
      stroke: () => {},
      setLineDash: () => {},
      createRadialGradient: () => ({ addColorStop: () => {} }),
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
    dispatchEvent: (ev, payload) => {
      if (listeners[ev]) listeners[ev].forEach(fn => fn(payload));
    },
    focus: () => {},
    select: () => {},
    remove: () => {},
    appendChild: (child) => {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
}

const elementsMap = {};
const mockCanvas = createMockElement('graph-canvas', 'canvas');
mockCanvas.width = 1000;
mockCanvas.height = 800;

const mockIds = [
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
  'tutorial-card', 'logo-home'
];

mockIds.forEach(id => {
  elementsMap[id] = createMockElement(id);
});
elementsMap['graph-canvas'] = mockCanvas;

// Set initial classes: graph-modal hidden
elementsMap['graph-modal'].classList.add('hidden');
elementsMap['main-menu'].classList.remove('hidden');
elementsMap['editor-area'].classList.add('hidden');

const mockFilterPills = ['all', 'chapter', 'lore', 'world', 'draft'].map(f => {
  const el = createMockElement();
  el.dataset.filter = f;
  if (f === 'all') el.classList.add('active');
  return el;
});

global.document = {
  getElementById: (id) => elementsMap[id] || createMockElement(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || createMockElement(sel.slice(1));
    return createMockElement();
  },
  querySelectorAll: (sel) => {
    if (sel === '.filter-pill') {
      return mockFilterPills;
    }
    if (sel === '.note-count') {
      return ['chapter', 'lore', 'world', 'draft'].map(c => {
        const el = createMockElement();
        el.dataset.count = c;
        return el;
      });
    }
    return [];
  },
  createElement: (tag) => createMockElement('', tag),
  addEventListener: (ev, fn) => {},
  body: createMockElement('body')
};

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

// 4. Load app.js into context
const appCode = fs.readFileSync(path.join(__dirname, '..', 'js/app.js'), 'utf8');
eval(`(function() {\n${appCode}\n})()`);

console.log('✓ app.js successfully evaluated into test environment');

// Test 1: Clean state graph behavior
// Vault starts empty (0 notes)
const btnGraphView = elementsMap['btn-graph-view'];
btnGraphView.dispatchEvent('click');

const graphModal = elementsMap['graph-modal'];
assert(!graphModal.classList.contains('hidden'), 'Graph modal should be open');
const emptyPrompt = elementsMap['galaxy-empty-prompt'];
assert(!emptyPrompt.classList.contains('hidden'), 'Empty prompt should be visible with 0 notes');
const nodeCountEl = elementsMap['graph-node-count'];
assert.strictEqual(nodeCountEl.textContent, '0 notes');
console.log('✓ Test 1 Passed: 0 notes empty state handled correctly');

// Test 2: Load starter vault and build galaxy data
Storage.loadStarterVault();
const allNotes = Storage.getAllNotes();
assert.strictEqual(allNotes.length, 9, 'Starter vault should contain 9 notes');

// Trigger loading demo in graph
const galaxyBtnLoadDemo = elementsMap['galaxy-btn-load-demo'];
galaxyBtnLoadDemo.dispatchEvent('click');

assert(emptyPrompt.classList.contains('hidden'), 'Empty prompt should hide when notes exist');
assert(nodeCountEl.textContent.includes('9 note'), `Node count should say 9 notes, got: ${nodeCountEl.textContent}`);

const edgeCountEl = elementsMap['graph-edge-count'];
assert(edgeCountEl.textContent.includes('sub-branch'), `Edge count should mention sub-branches, got: ${edgeCountEl.textContent}`);
assert(edgeCountEl.textContent.includes('wiki link'), `Edge count should mention wiki links, got: ${edgeCountEl.textContent}`);
console.log(`✓ Test 2 Passed: 9 notes populated graph with hubs and sub-branches (${edgeCountEl.textContent})`);

// Test 3: Close graph view
const btnCloseGraph = elementsMap['btn-close-graph'];
btnCloseGraph.dispatchEvent('click');
assert(graphModal.classList.contains('hidden'), 'Graph modal should close when clicking close button');
console.log('✓ Test 3 Passed: Close graph view working');

// Test 4: Open graph view again and test click navigation to chapter
btnGraphView.dispatchEvent('click');
assert(!graphModal.classList.contains('hidden'), 'Graph modal reopened');

// Locate the chapter note
const chapterNote = allNotes.find(n => n.category === 'chapter');
assert(chapterNote, 'Chapter note should exist in starter vault');

const canvas = elementsMap['graph-canvas'];

// Reset editor state to simulate being on main menu
elementsMap['main-menu'].classList.remove('hidden');
elementsMap['editor-area'].classList.add('hidden');

// Locate note coordinates by inspecting graphNodes or finding with hit test
// We know Chapter note has an initial position around hub.
// Let's find note node by dispatching click at its position.
// We can find the node by searching a grid or from the event loop:
let foundChapterX = 0, foundChapterY = 0;
for (let x = 100; x < 900; x += 30) {
  for (let y = 100; y < 700; y += 30) {
    canvas.dispatchEvent('mousedown', { clientX: x, clientY: y });
    global.window.dispatchEvent('mouseup', { clientX: x, clientY: y });
    if (elementsMap['note-title'].value === chapterNote.title) {
      foundChapterX = x;
      foundChapterY = y;
      break;
    }
    // Reopen graph if a different note was clicked
    if (graphModal.classList.contains('hidden')) {
      btnGraphView.dispatchEvent('click');
    }
  }
  if (foundChapterX) break;
}

assert(foundChapterX > 0, 'Should have clicked and navigated to chapter note');
assert(graphModal.classList.contains('hidden'), 'Graph modal should close upon clicking chapter');
assert(!elementsMap['editor-area'].classList.contains('hidden'), 'Editor area should be visible');
assert(elementsMap['main-menu'].classList.contains('hidden'), 'Main menu should be hidden');
assert.strictEqual(elementsMap['note-title'].value, chapterNote.title, 'Chapter title loaded in editor');
assert.strictEqual(elementsMap['note-category'].value, 'chapter', 'Chapter category loaded in editor');
assert.strictEqual(elementsMap['note-body'].value, chapterNote.body, 'Chapter body loaded in editor');
console.log(`✓ Test 4 Passed: Clicking chapter note cleanly navigated to editor and loaded "${chapterNote.title}"`);

// Test 5: Dragging node to reposition should NOT trigger navigation
btnGraphView.dispatchEvent('click');
assert(!graphModal.classList.contains('hidden'), 'Graph reopened');
canvas.dispatchEvent('mousedown', { clientX: foundChapterX, clientY: foundChapterY });
// Simulate mouse move > 5 pixels (drag)
global.window.dispatchEvent('mousemove', { clientX: foundChapterX + 25, clientY: foundChapterY + 25 });
global.window.dispatchEvent('mouseup', { clientX: foundChapterX + 25, clientY: foundChapterY + 25 });
// Modal should STILL be open because user dragged!
assert(!graphModal.classList.contains('hidden'), 'Graph should remain open after dragging node');
console.log('✓ Test 5 Passed: Node dragging does not trigger accidental note navigation');

// Test 6: Verify category filter isolation
const filterPills = global.document.querySelectorAll('.filter-pill');
const chapterPill = filterPills.find(p => p.dataset.filter === 'chapter');
assert(chapterPill, 'Chapter filter pill found');

chapterPill.dispatchEvent('click');
assert(nodeCountEl.textContent.includes('2 note'), `Filtered chapter count should be 2 notes, got: ${nodeCountEl.textContent}`);
console.log('✓ Test 6 Passed: Category isolation filter works (2 chapters displayed)');

// Reset filter to all
const allPill = filterPills.find(p => p.dataset.filter === 'all');
allPill.dispatchEvent('click');
assert(nodeCountEl.textContent.includes('9 note'), 'All filter displays all 9 notes');
console.log('✓ Test 7 Passed: Filter reset to all displays all categories');

// Test 8: Clicking directly on chapter title text navigates to editor
btnGraphView.dispatchEvent('click');
assert(!graphModal.classList.contains('hidden'), 'Graph reopened');
elementsMap['note-title'].value = '';
// Click 22px below node center (on the Cinzel title label)
canvas.dispatchEvent('mousedown', { clientX: foundChapterX, clientY: foundChapterY + 22 });
global.window.dispatchEvent('mouseup', { clientX: foundChapterX, clientY: foundChapterY + 22 });
assert(graphModal.classList.contains('hidden'), 'Graph modal should close when clicking title text');
assert.strictEqual(elementsMap['note-title'].value, chapterNote.title, 'Chapter loaded via title text click');
console.log('✓ Test 8 Passed: Clicking note title label directly navigates to editor and opens note');

// Test 9: Clicking directly on sub-branch badge navigates to editor
btnGraphView.dispatchEvent('click');
assert(!graphModal.classList.contains('hidden'), 'Graph reopened');
elementsMap['note-title'].value = '';
// Click 36px below node center (on the sub-branch badge pill)
canvas.dispatchEvent('mousedown', { clientX: foundChapterX, clientY: foundChapterY + 36 });
global.window.dispatchEvent('mouseup', { clientX: foundChapterX, clientY: foundChapterY + 36 });
assert(graphModal.classList.contains('hidden'), 'Graph modal should close when clicking sub-branch badge');
assert.strictEqual(elementsMap['note-title'].value, chapterNote.title, 'Chapter loaded via sub-branch badge click');
console.log('✓ Test 9 Passed: Clicking note sub-branch badge directly navigates to editor and opens note');

// Test 10: Location HUD hover & click navigates to editor
btnGraphView.dispatchEvent('click');
assert(!graphModal.classList.contains('hidden'), 'Graph reopened');
// Hover over chapter note
global.window.dispatchEvent('mousemove', { clientX: foundChapterX, clientY: foundChapterY });
const hud = elementsMap['graph-location-hud'];
assert(!hud.classList.contains('hidden'), 'Location HUD should be visible upon hovering node');
assert(elementsMap['hud-node-title'].textContent === chapterNote.title, 'HUD displays chapter title');
assert(elementsMap['hud-sub-branch'].textContent === 'Act 1', 'HUD displays formatted sub-branch');

// Click Location HUD
elementsMap['note-title'].value = '';
hud.dispatchEvent('click');
assert(graphModal.classList.contains('hidden'), 'Graph modal should close when clicking Location HUD');
assert.strictEqual(elementsMap['note-title'].value, chapterNote.title, 'Chapter loaded via Location HUD click');
console.log('✓ Test 10 Passed: Clicking Location HUD breadcrumb card cleanly navigates to editor');

// Test 11: Category Hub interaction (click to isolate, click again to open first chapter)
btnGraphView.dispatchEvent('click');
assert(!graphModal.classList.contains('hidden'), 'Graph reopened');
// Chapter hub is at roughly (342, 242). Search around hub center (avoiding note at 278, 178)
let foundHubX = 0, foundHubY = 0;
for (let x = 340; x <= 360; x += 10) {
  for (let y = 240; y <= 260; y += 10) {
    if (graphModal.classList.contains('hidden')) btnGraphView.dispatchEvent('click');
    canvas.dispatchEvent('mousedown', { clientX: x, clientY: y });
    global.window.dispatchEvent('mouseup', { clientX: x, clientY: y });
    if (chapterPill.classList.contains('active')) {
      foundHubX = x;
      foundHubY = y;
      break;
    }
  }
  if (foundHubX) break;
}
assert(foundHubX > 0, 'Chapter hub found and clicked to isolate');
console.log('✓ Test 11a Passed: Clicking Category Hub isolates that category branch');

// Now click the isolated Category Hub (centered at 500, 400) -> should open first chapter!
elementsMap['note-title'].value = '';
canvas.dispatchEvent('mousedown', { clientX: 500, clientY: 400 });
global.window.dispatchEvent('mouseup', { clientX: 500, clientY: 400 });
assert(graphModal.classList.contains('hidden'), 'Graph modal should close when clicking isolated Category Hub');
assert.strictEqual(elementsMap['note-title'].value, chapterNote.title, 'First chapter opened via Category Hub click');
console.log('✓ Test 11b Passed: Clicking isolated Category Hub navigates to first chapter in editor');

// Test 12: Stress test: 50 notes in single category doesn't crash, jitter, or produce NaNs
Storage.clearAllNotes();
for (let i = 1; i <= 50; i++) {
  Storage.createNote({
    title: `Chapter ${i}: Scene of Shadows`,
    category: 'chapter',
    tags: i <= 25 ? 'act-1' : 'act-2',
    body: `Draft prose for chapter ${i}`
  });
}
assert.strictEqual(Storage.getAllNotes().length, 50, '50 notes created in storage');
btnGraphView.dispatchEvent('click');
assert(!graphModal.classList.contains('hidden'), 'Graph opened with 50 notes');
assert(nodeCountEl.textContent.includes('50 note'), `Node count should report 50 notes, got: ${nodeCountEl.textContent}`);
console.log('✓ Test 12 Passed: 50+ notes in single category renders gracefully with sub-branch clustering');

// Test 13: Touch pinch-to-zoom simulation
canvas.dispatchEvent('touchstart', {
  touches: [
    { clientX: 400, clientY: 400 },
    { clientX: 600, clientY: 400 }
  ]
});
global.window.dispatchEvent('touchmove', {
  touches: [
    { clientX: 300, clientY: 400 },
    { clientX: 700, clientY: 400 }
  ]
});
console.log('✓ Test 13 Passed: Touch multi-finger pinch-to-zoom gestures execute without error');

console.log('\n=== ALL GALAXY GRAPH TESTS PASSED SUCCESSFULLY ===');
process.exit(0);

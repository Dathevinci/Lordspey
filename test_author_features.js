const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- Running Author Features Test Suite ---');

// Mock DOM
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
    style: { setProperty: () => {} },
    value: '',
    textContent: '',
    innerHTML: '',
    children: [],
    selectionStart: 0,
    selectionEnd: 0,
    setSelectionRange(s, e) { this.selectionStart = s; this.selectionEnd = e; },
    focus() {},
    select() {},
    appendChild() {},
    remove() {},
    querySelectorAll() { return []; },
    addEventListener(ev, fn) {
      if (!listeners[ev]) listeners[ev] = [];
      listeners[ev].push(fn);
    },
    dispatchEvent(ev, payload) {
      if (listeners[ev]) listeners[ev].forEach(fn => fn(payload || { preventDefault() {} }));
    }
  };
}

const mockLocalStorage = {};
global.localStorage = {
  getItem: k => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

const Markdown = require('./js/markdown.js');
global.Markdown = Markdown;

const storageCode = fs.readFileSync(path.join(__dirname, 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

// Mock window and document
const elements = {};
function getEl(id, tag = 'div') {
  if (!elements[id]) elements[id] = createMockElement(id, tag);
  return elements[id];
}

const reqIds = [
  'sidebar', 'sidebar-toggle', 'sidebar-expand', 'sidebar-backdrop',
  'search-input', 'logo-home', 'btn-tutorial-sidebar',
  'main-menu', 'menu-btn-tutorial', 'menu-btn-graph', 'menu-btn-switcher',
  'menu-btn-sample', 'menu-recent-section', 'menu-recent-grid',
  'editor-area', 'editor-body-wrap', 'btn-back-menu', 'note-title',
  'note-tags', 'note-category', 'note-body', 'note-preview',
  'word-count', 'reading-time', 'save-status', 'btn-split',
  'btn-outline', 'outline-drawer', 'outline-list', 'btn-close-outline',
  'meta-goal', 'goal-progress', 'goal-fill', 'goal-modal',
  'input-word-goal', 'input-sprint-minutes', 'btn-save-goal', 'btn-cancel-goal',
  'btn-sprint', 'sprint-timer-text', 'tutorial-overlay', 'tutorial-step-badge',
  'tutorial-category-tag', 'btn-skip-tutorial-top', 'tutorial-icon-box',
  'tutorial-title', 'tutorial-desc', 'tutorial-features', 'tutorial-tip',
  'tutorial-dots', 'btn-tutorial-skip', 'btn-tutorial-prev', 'btn-tutorial-next',
  'btn-new-note', 'btn-preview', 'btn-delete', 'btn-zen', 'btn-export-md',
  'btn-export', 'btn-import', 'import-file',
  'btn-find-toggle', 'find-replace-bar', 'find-input', 'replace-input',
  'find-counter', 'btn-find-prev', 'btn-find-next', 'btn-find-case',
  'btn-replace-one', 'btn-replace-all', 'btn-find-close',
  'editor-font-select', 'btn-font-dec', 'btn-font-inc', 'font-size-val',
  'btn-line-spacing', 'line-spacing-val', 'btn-typewriter',
  'btn-metrics', 'metrics-modal', 'btn-close-metrics', 'btn-metrics-done',
  'stat-words', 'stat-chars-spaces', 'stat-chars-nospaces', 'stat-paragraphs',
  'stat-sentences', 'stat-avg-words-sentence', 'stat-read-time', 'stat-speak-time',
  'stat-reading-level', 'stat-reading-badge', 'selection-stats-wrap',
  'stat-sel-words', 'stat-sel-chars',
  'backlinks-panel', 'backlinks-toggle-header', 'backlinks-count', 'backlinks-list',
  'modal-overlay', 'modal-note-title', 'modal-note-category', 'modal-create', 'modal-cancel',
  'delete-overlay', 'delete-confirm', 'delete-cancel',
  'wikicreate-modal', 'wikicreate-target', 'wikicreate-category', 'wikicreate-confirm', 'wikicreate-cancel',
  'btn-quick-switcher', 'switcher-modal', 'switcher-input', 'switcher-results',
  'btn-graph-view', 'graph-modal', 'btn-close-graph', 'graph-canvas',
  'graph-node-count', 'graph-edge-count', 'galaxy-empty-prompt', 'galaxy-btn-create-first',
  'galaxy-btn-load-demo', 'graph-location-hud', 'hud-category-dot', 'hud-category-name',
  'hud-sub-branch', 'hud-node-title', 'hud-connections-count', 'hud-action-hint'
];

reqIds.forEach(id => getEl(id));
getEl('find-replace-bar').classList.add('hidden');
getEl('metrics-modal').classList.add('hidden');
getEl('outline-drawer').classList.add('hidden');

const formatButtons = {};
const formatActions = [
  'bold', 'italic', 'strike', 'highlight', 'heading', 'wikilink',
  'task', 'quote', 'callout', 'ul', 'ol', 'code', 'link', 'table',
  'footnote', 'divider', 'scene', 'dialogue-dash', 'smart-quotes',
  'single-quotes', 'ellipsis'
];
formatActions.forEach(act => {
  const btn = createMockElement();
  btn.dataset.action = act;
  formatButtons[act] = btn;
});

global.document = {
  documentElement: { style: { setProperty: () => {} } },
  body: createMockElement('body'),
  querySelector: sel => {
    if (sel.startsWith('#')) return getEl(sel.slice(1));
    return createMockElement();
  },
  querySelectorAll: sel => {
    if (sel === '.menu-card') return [];
    if (sel === '.nav-section-header') return [];
    if (sel === '.sidebar-nav') return [];
    if (sel === '.fmt-btn') return Object.values(formatButtons);
    if (sel === '.outline-item') return [];
    if (sel === '.switcher-item') return [];
    return [];
  },
  createElement: tag => createMockElement('', tag),
  addEventListener: () => {}
};

global.window = {
  innerWidth: 1200,
  addEventListener: () => {},
  getComputedStyle: () => ({
    fontFamily: 'Lora',
    fontSize: '15px',
    lineHeight: '1.8',
    paddingLeft: '32px',
    paddingRight: '32px',
    paddingTop: '20px',
    paddingBottom: '40px',
    boxSizing: 'border-box'
  }),
  requestAnimationFrame: cb => setTimeout(cb, 0),
  cancelAnimationFrame: () => {}
};
global.requestAnimationFrame = global.window.requestAnimationFrame;
global.cancelAnimationFrame = global.window.cancelAnimationFrame;

// Load app.js
const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
eval(`(function() { ${appCode} })()`);

// Helper to simulate format button click
function triggerFormat(action) {
  const noteBody = getEl('note-body');
  const btn = createMockElement();
  btn.dataset.action = action;
  // Use global keyboard event or function if available
}

// 1. Create a note and test Find & Replace
const modalTitle = getEl('modal-note-title');
modalTitle.value = 'Chapter I: The Red Citadel';
const modalCategory = getEl('modal-note-category');
modalCategory.value = 'chapter';
const modalCreate = getEl('modal-create');
modalCreate.dispatchEvent('click');

const noteBody = getEl('note-body');
noteBody.value = 'The hero paid 50 coins to enter the gate. Another 50 coins were required for bread.';

// Open Find Bar
const btnFindToggle = getEl('btn-find-toggle');
btnFindToggle.dispatchEvent('click');
const findReplaceBar = getEl('find-replace-bar');
assert(!findReplaceBar.classList.contains('hidden'), 'Find bar should be open');
assert(btnFindToggle.classList.contains('active'), 'Find toggle button should have active class');

// Test search query
const findInput = getEl('find-input');
const replaceInput = getEl('replace-input');
const findCounter = getEl('find-counter');

findInput.value = '50 coins';
findInput.dispatchEvent('input');
assert.strictEqual(findCounter.textContent, '1/2', `Expected 1/2 match counter, got ${findCounter.textContent}`);

// Test Replace All with $ pattern ($100) — must not trigger regex $ replacement corruption
replaceInput.value = '$100';
const btnReplaceAll = getEl('btn-replace-all');
btnReplaceAll.dispatchEvent('click');

assert(noteBody.value.includes('$100 to enter'), 'First $100 replacement failed');
assert(noteBody.value.includes('Another $100 were'), 'Second $100 replacement failed');
assert(!noteBody.value.includes('50 coins'), 'Old text still present');
console.log('✓ Find & Replace: Literal replacement with $ characters ($100) passed without regex corruption');

// Close Find Bar
const btnFindClose = getEl('btn-find-close');
btnFindClose.dispatchEvent('click');
assert(findReplaceBar.classList.contains('hidden'), 'Find bar should be closed');
assert(!btnFindToggle.classList.contains('active'), 'Find toggle button active state should be removed');
console.log('✓ Find & Replace: Open/close and active indicator passed');

// 2. Test Syllable Counting & Manuscript Metrics
const btnMetrics = getEl('btn-metrics');
btnMetrics.dispatchEvent('click');
const statReadingBadge = getEl('stat-reading-badge');
const statWords = getEl('stat-words');
console.log(`✓ Manuscript Metrics: Current word count = ${statWords.textContent}`);

// Test when words >= 10
noteBody.value = 'The little kitten climbed the castle wall. It was a beautiful and gentle creature needed by the realm.';
noteBody.dispatchEvent('input');
btnMetrics.dispatchEvent('click');
const statReadingLevel = getEl('stat-reading-level');
assert(statReadingLevel.textContent.startsWith('Score'), `Expected score, got ${statReadingLevel.textContent}`);
console.log(`✓ Manuscript Metrics: Readability score calculated successfully: ${statReadingLevel.textContent} (${statReadingBadge.textContent})`);

// 3. Test Scene Break detection in Outline
noteBody.value = '# Scene 1\nProse here.\n\n* * *\n\n# Scene 2\nMore prose.';
const outlineList = getEl('outline-list');
const btnOutline = getEl('btn-outline');
btnOutline.dispatchEvent('click');

assert(outlineList.innerHTML.includes('✦ Scene Break'), 'Scene break missing in outline');
assert(outlineList.innerHTML.includes('is-scene'), 'is-scene class missing in outline');
console.log('✓ Document Outline: Scene break (* * *) recognized and displayed in outline list');

// 4. Test Footnote insertion with sentence preservation & auto-increment
noteBody.value = 'The hero took the sword and left.';
noteBody.selectionStart = 23; // after 'sword'
noteBody.selectionEnd = 23;
formatButtons['footnote'].dispatchEvent('click');

assert(noteBody.value.includes('the sword[^1] and left.'), 'Sentence flow should be preserved without corruption');
assert(noteBody.value.includes('[^1]: Footnote description'), 'Footnote definition should be placed at end of note');

// Test second footnote insertion (auto-increments to [^2])
noteBody.selectionStart = noteBody.value.indexOf('left.');
noteBody.selectionEnd = noteBody.selectionStart;
formatButtons['footnote'].dispatchEvent('click');
assert(noteBody.value.includes('[^2]'), 'Second footnote should auto-increment to [^2]');
assert(noteBody.value.includes('[^2]: Footnote description'), 'Second footnote definition placed at end');
console.log('✓ Footnote insertion: Preserves sentence flow and auto-increments [^1], [^2]');

// 5. Test Smart Typography & Dialogue Dash
noteBody.value = '';
noteBody.selectionStart = 0; noteBody.selectionEnd = 0;
formatButtons['dialogue-dash'].dispatchEvent('click');
assert.strictEqual(noteBody.value, '— ', 'Dialogue dash failed');

noteBody.value = '';
noteBody.selectionStart = 0; noteBody.selectionEnd = 0;
formatButtons['smart-quotes'].dispatchEvent('click');
assert.strictEqual(noteBody.value, '“”', 'Curly double quotes failed');

noteBody.value = '';
noteBody.selectionStart = 0; noteBody.selectionEnd = 0;
formatButtons['single-quotes'].dispatchEvent('click');
assert.strictEqual(noteBody.value, '‘’', 'Curly single quotes failed');

noteBody.value = '';
noteBody.selectionStart = 0; noteBody.selectionEnd = 0;
formatButtons['ellipsis'].dispatchEvent('click');
assert.strictEqual(noteBody.value, '…', 'Ellipsis failed');
console.log('✓ Smart Typography: Dialogue dash (—), curly double (“ ”), single (‘ ’), ellipsis (…) passed');

// 6. Test Table Formatting Insertion
noteBody.value = 'Text before.';
noteBody.selectionStart = noteBody.value.length;
noteBody.selectionEnd = noteBody.value.length;
formatButtons['table'].dispatchEvent('click');
assert(noteBody.value.includes('| Column 1 | Column 2 | Column 3 |'), 'Table header failed');
assert(noteBody.value.includes('| :--- | :---: | ---: |'), 'Table alignment failed');
console.log('✓ Table Formatting: Insertion with alignments passed');

// 7. Test Strikethrough & Highlighter
noteBody.value = 'Text to strike';
noteBody.selectionStart = 8; noteBody.selectionEnd = 14;
formatButtons['strike'].dispatchEvent('click');
assert.strictEqual(noteBody.value, 'Text to ~~strike~~', 'Strikethrough insertion failed');

noteBody.value = 'Text to mark';
noteBody.selectionStart = 8; noteBody.selectionEnd = 12;
formatButtons['highlight'].dispatchEvent('click');
assert.strictEqual(noteBody.value, 'Text to ==mark==', 'Highlight insertion failed');
console.log('✓ Strikethrough (~~) and Highlighter (==) insertions passed');

// 8. Test Non-Action Format Buttons (Font controls immunity to selection erasure)
noteBody.value = 'Selected pristine prose';
noteBody.selectionStart = 9; noteBody.selectionEnd = 17; // 'pristine'
const btnFontInc = getEl('btn-font-inc');
btnFontInc.dispatchEvent('click');
assert.strictEqual(noteBody.value, 'Selected pristine prose', 'Font controls should not delete note text');
const btnLineSpacing = getEl('btn-line-spacing');
btnLineSpacing.dispatchEvent('click');
assert.strictEqual(noteBody.value, 'Selected pristine prose', 'Line spacing control should not delete note text');
console.log('✓ Font size and line spacing controls: Selection preserved without erasure');

// 9. Test Auto-Save Flush on returning to Main Menu
const noteTitleEl = getEl('note-title');
noteTitleEl.value = 'Chapter of the Stars';
noteTitleEl.dispatchEvent('input');
const btnBackMenu = getEl('btn-back-menu');
btnBackMenu.dispatchEvent('click');
const allNotes = Storage.getAllNotes();
assert(allNotes.some(n => n.title === 'Chapter of the Stars'), 'Auto-save must be flushed on return to main menu');
console.log('✓ Return to Dashboard: Pending auto-save cleanly flushed to storage');

console.log('\nALL AUTHOR FEATURE TESTS PASSED SUCCESSFULLY!');

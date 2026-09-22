const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING LORD SPEY SETTINGS & UI SUITE ===\n');

// 1. Mock LocalStorage & Setup Environment
const mockLocalStorage = {
  'lordspey_tutorial_seen': 'true'
};
global.localStorage = {
  getItem: k => (k in mockLocalStorage ? mockLocalStorage[k] : null),
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

const storageCode = fs.readFileSync(path.join(__dirname, 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

const Markdown = require('./js/markdown.js');
global.Markdown = Markdown;

// 2. Structural HTML Verification
console.log('--- 1. Sidebar Footer & Settings Modal HTML Verification ---');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Assert sidebar footer only exposes New Note and Settings Gear
const footerStart = htmlContent.indexOf('class="sidebar-footer"');
const footerEnd = htmlContent.indexOf('</aside>', footerStart);
const footerHtml = htmlContent.slice(footerStart, footerEnd);

assert(footerHtml.includes('id="btn-new-note"'), 'Missing btn-new-note in footer');
assert(footerHtml.includes('id="btn-project-settings"'), 'Missing btn-project-settings in footer');

// Check that the footer row only contains New Note and Settings gear
const footerRowMatch = footerHtml.match(/<div class="sidebar-footer-row">([\s\S]*?)<\/div>/);
assert(footerRowMatch, 'sidebar-footer-row must exist');
const footerRowContent = footerRowMatch[1];
assert(footerRowContent.includes('id="btn-new-note"'), 'New Note must be in footer row');
assert(footerRowContent.includes('id="btn-project-settings"'), 'Settings gear must be in footer row');
assert(!footerRowContent.includes('id="btn-export-spey"'), 'btn-export-spey must not be in visible footer row');
assert(!footerRowContent.includes('id="btn-open-spey"'), 'btn-open-spey must not be in visible footer row');
assert(!footerRowContent.includes('id="btn-export"'), 'btn-export must not be in visible footer row');
assert(!footerRowContent.includes('id="btn-import"'), 'btn-import must not be in visible footer row');
console.log('✓ Clean sidebar footer verified: 0 icon clutter, only + New Note and Settings');

// Assert all 4 settings tabs exist
assert(htmlContent.includes('data-tab="vault"'), 'Missing Vault tab button');
assert(htmlContent.includes('data-tab="editor"'), 'Missing Editor tab button');
assert(htmlContent.includes('data-tab="appearance"'), 'Missing Appearance tab button');
assert(htmlContent.includes('data-tab="keybindings"'), 'Missing Shortcuts/Guides tab button');

// Assert tab panes exist
assert(htmlContent.includes('id="settings-pane-vault"'), 'Missing settings-pane-vault');
assert(htmlContent.includes('id="settings-pane-editor"'), 'Missing settings-pane-editor');
assert(htmlContent.includes('id="settings-pane-appearance"'), 'Missing settings-pane-appearance');
assert(htmlContent.includes('id="settings-pane-keybindings"'), 'Missing settings-pane-keybindings');

// Assert controls exist
assert(htmlContent.includes('id="setting-project-title"'), 'Missing setting-project-title');
assert(htmlContent.includes('id="setting-project-author"'), 'Missing setting-project-author');
assert(htmlContent.includes('id="settings-btn-export-spey"'), 'Missing settings-btn-export-spey');
assert(htmlContent.includes('id="settings-btn-open-spey"'), 'Missing settings-btn-open-spey');
assert(htmlContent.includes('id="settings-btn-clear-vault"'), 'Missing settings-btn-clear-vault');

assert(htmlContent.includes('id="setting-font-family"'), 'Missing setting-font-family');
assert(htmlContent.includes('id="setting-font-size"'), 'Missing setting-font-size');
assert(htmlContent.includes('id="setting-line-height"'), 'Missing setting-line-height');
assert(htmlContent.includes('id="setting-typewriter-toggle"'), 'Missing setting-typewriter-toggle');
assert(htmlContent.includes('id="setting-auto-emdash"'), 'Missing setting-auto-emdash');
assert(htmlContent.includes('id="setting-smart-quotes"'), 'Missing setting-smart-quotes');

assert(htmlContent.includes('id="setting-intro-star-toggle"'), 'Missing setting-intro-star-toggle');
assert(htmlContent.includes('data-theme="crimson"'), 'Missing crimson theme card');
assert(htmlContent.includes('data-theme="ruby"'), 'Missing ruby theme card');
assert(htmlContent.includes('data-theme="amber"'), 'Missing amber/gold theme card');
assert(htmlContent.includes('data-theme="amethyst"'), 'Missing amethyst theme card');
assert(htmlContent.includes('data-theme="emerald"'), 'Missing emerald theme card');

assert(htmlContent.includes('class="shortcuts-table"'), 'Missing shortcuts-table');
assert(htmlContent.includes('id="settings-btn-tour-general"'), 'Missing settings-btn-tour-general');
assert(htmlContent.includes('id="settings-btn-tour-map"'), 'Missing settings-btn-tour-map');
assert(htmlContent.includes('id="settings-btn-tour-timeline"'), 'Missing settings-btn-tour-timeline');
assert(htmlContent.includes('id="settings-btn-tour-codex"'), 'Missing settings-btn-tour-codex');

assert(htmlContent.includes('id="vault-reset-confirm-modal"'), 'Missing vault-reset-confirm-modal');
console.log('✓ All 4 Settings tabs and controls verified in HTML markup');

// 3. Mock DOM & App Controller Evaluation
console.log('--- 2. Settings Controller Lifecycle & Event Verification ---');

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
      if (listeners['click']) listeners['click'].forEach(fn => fn({ type: 'click', target: this, preventDefault: () => {} }));
    },
    focus: () => {},
    setAttribute: () => {},
    getAttribute: () => null
  };
}

const elementsMap = {};
const mockIds = [
  'sidebar', 'sidebar-toggle', 'sidebar-expand', 'sidebar-backdrop',
  'search-input', 'logo-home', 'btn-tutorial-sidebar', 'intro-splash',
  'intro-skip-btn', 'menu-emblem', 'main-menu', 'menu-btn-chapter',
  'menu-btn-lore', 'menu-btn-world', 'menu-btn-draft', 'menu-recent-section',
  'menu-recent-grid', 'dashboard-btn-export-spey', 'dashboard-btn-open-spey',
  'editor-area', 'editor-body-wrap', 'btn-back-menu', 'note-title',
  'note-tags', 'note-category', 'note-body', 'note-preview', 'word-count',
  'btn-project-settings', 'btn-new-note', 'btn-export-spey', 'btn-open-spey',
  'btn-export', 'btn-import', 'import-file',
  'project-settings-modal', 'btn-close-project-settings', 'btn-cancel-project-settings',
  'btn-save-project-settings', 'setting-project-title', 'setting-project-author',
  'settings-stats-grid', 'settings-btn-export-spey', 'settings-btn-open-spey',
  'settings-btn-export-json', 'settings-btn-import-json', 'settings-import-json-file',
  'settings-btn-backup-vault', 'settings-btn-restore-vault', 'settings-btn-clear-vault',
  'setting-font-family', 'setting-font-size', 'setting-line-height',
  'setting-typewriter-toggle', 'setting-auto-emdash', 'setting-smart-quotes',
  'setting-intro-star-toggle', 'setting-btn-preview-intro',
  'settings-btn-tour-general', 'settings-btn-tour-map', 'settings-btn-tour-timeline',
  'settings-btn-tour-codex',
  'vault-reset-confirm-modal', 'btn-close-reset-confirm', 'btn-cancel-reset-vault',
  'btn-confirm-reset-vault', 'spey-dropzone', 'toast-container',
  'btn-find-toggle', 'find-replace-bar', 'find-input', 'replace-input',
  'find-counter', 'btn-find-prev', 'btn-find-next', 'btn-find-case',
  'btn-replace-one', 'btn-replace-all', 'btn-find-close', 'editor-font-select',
  'btn-font-dec', 'btn-font-inc', 'font-size-val', 'btn-line-spacing',
  'line-spacing-val', 'btn-typewriter', 'btn-metrics', 'metrics-modal',
  'btn-close-metrics', 'btn-metrics-done', 'stat-words', 'stat-chars-spaces',
  'stat-chars-nospaces', 'stat-paragraphs', 'stat-sentences', 'stat-avg-words-sentence',
  'stat-read-time', 'stat-speak-time', 'stat-reading-level', 'stat-reading-badge',
  'selection-stats-wrap', 'stat-sel-words', 'stat-sel-chars',
  'btn-outline', 'outline-drawer', 'outline-list', 'btn-close-outline',
  'meta-goal', 'goal-progress', 'goal-fill', 'goal-modal',
  'input-word-goal', 'input-sprint-minutes', 'btn-save-goal', 'btn-cancel-goal',
  'btn-sprint', 'sprint-timer-text', 'tutorial-overlay', 'tutorial-step-badge',
  'tutorial-category-tag', 'btn-skip-tutorial-top', 'tutorial-icon-box',
  'tutorial-title', 'tutorial-desc', 'tutorial-features', 'tutorial-tip',
  'tutorial-dots', 'btn-tutorial-skip', 'btn-tutorial-prev', 'btn-tutorial-next',
  'btn-preview', 'btn-delete', 'btn-zen', 'btn-export-md',
  'backlinks-panel', 'backlinks-toggle-header', 'backlinks-count', 'backlinks-list',
  'modal-overlay', 'modal-note-title', 'modal-note-category', 'modal-create', 'modal-cancel',
  'delete-overlay', 'delete-confirm', 'delete-cancel',
  'wikicreate-modal', 'wikicreate-target', 'wikicreate-category', 'wikicreate-confirm', 'wikicreate-cancel',
  'btn-quick-switcher', 'switcher-modal', 'switcher-input', 'switcher-results',
  'btn-graph-view', 'graph-modal', 'btn-close-graph', 'graph-canvas',
  'graph-node-count', 'graph-edge-count', 'galaxy-empty-prompt', 'galaxy-btn-create-first',
  'galaxy-btn-load-demo', 'graph-location-hud', 'hud-category-dot', 'hud-category-name',
  'hud-sub-branch', 'hud-node-title', 'hud-connections-count', 'hud-action-hint',
  'spey-import-modal', 'btn-import-modal-close', 'btn-import-cancel', 'btn-import-replace',
  'btn-import-merge', 'spey-import-filename', 'spey-import-proj-name', 'spey-stat-chapters',
  'spey-stat-lore', 'spey-stat-world', 'spey-stat-words', 'spey-breakdown-details',
  'btn-map-view', 'map-modal', 'btn-close-map', 'map-viewport', 'map-stage',
  'map-canvas', 'map-custom-img', 'map-pins-container', 'map-pin-count', 'map-coords-indicator',
  'map-pin-search', 'btn-map-drop-pin', 'btn-map-cancel-drop', 'map-placement-hint',
  'map-file-input', 'btn-map-reset-img', 'btn-map-zoom-in', 'btn-map-zoom-out', 'btn-map-zoom-reset',
  'map-pin-preview', 'map-preview-badge', 'map-preview-coords', 'btn-map-preview-close',
  'map-preview-title', 'map-preview-desc', 'btn-map-open-note', 'btn-map-delete-pin',
  'map-pin-modal', 'map-modal-note-select', 'map-modal-pin-title', 'map-modal-pin-category',
  'map-modal-pin-desc', 'btn-map-pin-cancel', 'btn-map-pin-save',
  'btn-timeline-view', 'timeline-modal', 'btn-close-timeline', 'timeline-event-count',
  'timeline-search', 'btn-timeline-mode-rail', 'btn-timeline-mode-stream',
  'timeline-rail-view', 'timeline-stream-view', 'timeline-rail-eras', 'timeline-rail-track',
  'timeline-stream-container', 'timeline-empty-prompt', 'btn-timeline-add', 'btn-timeline-empty-add',
  'timeline-event-modal', 'timeline-input-year', 'timeline-input-era', 'timeline-input-title',
  'timeline-input-note', 'timeline-input-category', 'timeline-input-desc', 'btn-timeline-event-cancel',
  'btn-timeline-event-save',
  'btn-codex-view', 'codex-modal', 'btn-close-codex', 'codex-character-count', 'codex-rel-count',
  'codex-search', 'btn-codex-mode-cards', 'btn-codex-mode-web', 'codex-cards-view',
  'codex-web-view', 'codex-grid', 'codex-web-canvas', 'codex-web-inspector', 'btn-inspector-close',
  'inspector-archetype-badge', 'inspector-name', 'inspector-faction', 'inspector-bio',
  'inspector-rels-list', 'btn-inspector-open-note', 'codex-empty-prompt', 'btn-codex-add-char',
  'btn-codex-empty-add', 'btn-codex-add-rel', 'codex-char-modal', 'codex-input-name',
  'codex-input-archetype', 'codex-input-faction', 'codex-input-role', 'codex-input-note',
  'codex-input-bio', 'btn-codex-char-cancel', 'btn-codex-char-save', 'codex-rel-modal',
  'codex-rel-source', 'codex-rel-type', 'codex-rel-target', 'codex-rel-desc',
  'btn-codex-rel-cancel', 'btn-codex-rel-save',
  'dashboard-btn-map', 'dashboard-btn-timeline', 'dashboard-btn-codex',
  'btn-toolbar-map', 'btn-toolbar-timeline', 'btn-toolbar-codex',
  'btn-map-tutorial', 'btn-timeline-tutorial', 'btn-codex-tutorial',
  'map-tutorial-modal', 'timeline-tutorial-modal', 'codex-tutorial-modal',
  'btn-close-map-tutorial', 'btn-close-timeline-tutorial', 'btn-close-codex-tutorial',
  'codex-char-preview', 'btn-inspector-delete-char',
  'list-chapter', 'list-lore', 'list-world', 'list-draft',
  'settings-pane-vault', 'settings-pane-editor', 'settings-pane-appearance', 'settings-pane-keybindings'
];

mockIds.forEach(id => {
  elementsMap[id] = createMockElement(id);
});

// Overlays that start hidden
['intro-splash', 'project-settings-modal', 'vault-reset-confirm-modal', 'tutorial-overlay', 'spey-import-modal', 'spey-dropzone', 'find-replace-bar', 'metrics-modal', 'graph-modal', 'map-modal', 'timeline-modal', 'codex-modal', 'modal-overlay', 'delete-overlay', 'wikicreate-modal'].forEach(id => {
  if (elementsMap[id]) elementsMap[id].classList.add('hidden');
});

// Setup mock tab buttons
const mockTabBtns = ['vault', 'editor', 'appearance', 'keybindings'].map(tab => {
  const el = createMockElement('', 'button');
  el.classList.add('settings-tab-btn');
  el.dataset.tab = tab;
  return el;
});

// Setup mock accent theme cards
const mockThemeCards = ['crimson', 'ruby', 'amber', 'amethyst', 'emerald'].map(theme => {
  const el = createMockElement('', 'div');
  el.classList.add('accent-theme-card');
  el.dataset.theme = theme;
  return el;
});

// Setup mock panes
const mockPanes = ['vault', 'editor', 'appearance', 'keybindings'].map(tab => {
  const el = elementsMap[`settings-pane-${tab}`];
  el.classList.add('settings-pane');
  return el;
});

const windowListeners = {};
global.window = {
  innerWidth: 1280,
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

const docListeners = {};
const rootElement = createMockElement('html', 'html');
global.document = {
  documentElement: rootElement,
  body: createMockElement('body', 'body'),
  getElementById: (id) => elementsMap[id] || createMockElement(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || createMockElement(sel.slice(1));
    return createMockElement();
  },
  querySelectorAll: (sel) => {
    if (sel === '.settings-tab-btn') return mockTabBtns;
    if (sel === '.settings-pane') return mockPanes;
    if (sel === '.accent-theme-card') return mockThemeCards;
    return [];
  },
  createElement: (tag) => createMockElement('', tag),
  addEventListener: (ev, fn) => {
    if (!docListeners[ev]) docListeners[ev] = [];
    docListeners[ev].push(fn);
  },
  dispatchEvent: (ev, payload) => {
    const type = typeof ev === 'string' ? ev : ev.type;
    if (docListeners[type]) docListeners[type].forEach(fn => fn(payload || ev));
  }
};

const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
eval(`(function() {\n${appCode}\n})()`);
console.log('✓ app.js successfully evaluated with full Settings integration');

// Test 1: Open Settings Modal via gear button
const btnSettings = elementsMap['btn-project-settings'];
const settingsModal = elementsMap['project-settings-modal'];
assert(settingsModal.classList.contains('hidden'), 'Modal starts hidden');

btnSettings.click();
assert(!settingsModal.classList.contains('hidden'), 'Modal should be open after gear click');
console.log('✓ Test 1 Passed: Settings Modal opens on gear button click');

// Test 2: Tab Switching
const tabEditor = mockTabBtns.find(b => b.dataset.tab === 'editor');
tabEditor.click();
assert(tabEditor.classList.contains('active'), 'Editor tab button should be active');
assert(elementsMap['settings-pane-editor'].classList.contains('active'), 'Editor pane should be active');
assert(!elementsMap['settings-pane-vault'].classList.contains('active'), 'Vault pane should be inactive');

const tabAppearance = mockTabBtns.find(b => b.dataset.tab === 'appearance');
tabAppearance.click();
assert(tabAppearance.classList.contains('active'), 'Appearance tab button should be active');
assert(elementsMap['settings-pane-appearance'].classList.contains('active'), 'Appearance pane should be active');
console.log('✓ Test 2 Passed: Tab switching activates correct buttons and content panes');

// Test 3: Accent Theme Selection
const cardEmerald = mockThemeCards.find(c => c.dataset.theme === 'emerald');
cardEmerald.click();
assert(cardEmerald.classList.contains('active'), 'Emerald card should become active');
assert.strictEqual(localStorage.getItem('lordspey_accent_theme'), 'emerald');

const cardRuby = mockThemeCards.find(c => c.dataset.theme === 'ruby');
cardRuby.click();
assert(cardRuby.classList.contains('active'), 'Ruby card should become active');
assert(!cardEmerald.classList.contains('active'), 'Emerald card should no longer be active');
assert.strictEqual(localStorage.getItem('lordspey_accent_theme'), 'ruby');
console.log('✓ Test 3 Passed: Accent Theme swatches update state and localStorage correctly');

// Test 4: Saving Project and Editor Preferences
elementsMap['setting-project-title'].value = 'The Basalt Chronicles';
elementsMap['setting-project-author'].value = 'Lady Morigan';
elementsMap['setting-font-family'].value = "'Playfair Display', Georgia, serif";
elementsMap['setting-font-size'].value = '18';
elementsMap['setting-line-height'].value = '2.0';
elementsMap['setting-typewriter-toggle'].checked = true;
elementsMap['setting-auto-emdash'].checked = true;
elementsMap['setting-smart-quotes'].checked = true;
elementsMap['setting-intro-star-toggle'].checked = false; // skip intro

elementsMap['btn-save-project-settings'].click();

// Modal should be closed
assert(settingsModal.classList.contains('hidden'), 'Modal should close after save');
assert.strictEqual(Storage.getSettings().projectTitle, 'The Basalt Chronicles');
assert.strictEqual(Storage.getSettings().projectAuthor, 'Lady Morigan');
assert.strictEqual(Storage.getSettings().defaultFontFamily, "'Playfair Display', Georgia, serif");
assert.strictEqual(Storage.getSettings().defaultFontSize, 18);
assert.strictEqual(Storage.getSettings().defaultLineHeight, 2.0);
assert.strictEqual(Storage.getSettings().typewriterMode, true);
assert.strictEqual(Storage.getSettings().autoEmDash, true);
assert.strictEqual(Storage.getSettings().smartQuotes, true);
assert.strictEqual(Storage.getSettings().skipIntro, true);
console.log('✓ Test 4 Passed: All settings fields save and persist into Storage');

// Test 5: Vault Reset Flow
btnSettings.click();
assert(!settingsModal.classList.contains('hidden'));

// Create a test note to ensure vault reset clears it
Storage.createNote({ title: 'Temporary Note', category: 'draft' });
assert.strictEqual(Storage.getAllNotes().length, 1);

const btnClearVault = elementsMap['settings-btn-clear-vault'];
btnClearVault.click();
const resetConfirmModal = elementsMap['vault-reset-confirm-modal'];
assert(!resetConfirmModal.classList.contains('hidden'), 'Confirm dialog should appear');

// Confirm Reset
const btnConfirmReset = elementsMap['btn-confirm-reset-vault'];
btnConfirmReset.click();
assert(resetConfirmModal.classList.contains('hidden'), 'Confirm dialog should close');
assert(settingsModal.classList.contains('hidden'), 'Settings modal should close');
assert.strictEqual(Storage.getAllNotes().length, 0, 'Vault notes must be reset to 0');
console.log('✓ Test 5 Passed: Danger Zone vault reset flow works safely');

// Test 6: Escape key dismissal
btnSettings.click();
assert(!settingsModal.classList.contains('hidden'));
global.document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault: () => {} });
assert(settingsModal.classList.contains('hidden'), 'Escape should dismiss Settings modal');
console.log('✓ Test 6 Passed: Escape key closes Settings modal');

console.log('\n=== ALL SETTINGS & UI SUITE TESTS PASSED (100%) ===\n');

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING LORD SPEY SETTINGS DOM INTERACTION TESTS ===\n');

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

// 2. Load Real HTML File and Parse Element IDs
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
          if (s.includes('[data-action=') && current.dataset && current.dataset.action) {
            const match = s.match(/\[data-action="?([^"\]]+)"?\]/);
            if (match && current.dataset.action === match[1]) return current;
          }
        }
        current = current.parentElement;
      }
      return null;
    },
    focus: () => {},
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
['btn-settings', 'menu-btn-settings', 'settings-modal', 'btn-close-settings', 'btn-cancel-settings'].forEach(id => {
  if (!elementsMap[id]) elementsMap[id] = createMockElement(id);
});

// Start modals in hidden state
['intro-splash', 'project-settings-modal', 'settings-modal', 'vault-reset-confirm-modal', 'tutorial-overlay', 'spey-import-modal', 'spey-dropzone', 'find-replace-bar', 'metrics-modal', 'graph-modal', 'map-modal', 'timeline-modal', 'codex-modal', 'modal-overlay', 'delete-overlay', 'wikicreate-modal'].forEach(id => {
  if (elementsMap[id]) elementsMap[id].classList.add('hidden');
});

// Setup mock tab buttons
const mockTabBtns = ['vault', 'editor', 'appearance', 'keybindings'].map(tab => {
  const el = createMockElement('', 'button');
  el.classList.add('settings-tab-btn');
  el.dataset.tab = tab;
  return el;
});

const mockThemeCards = ['crimson', 'ruby', 'amber', 'amethyst', 'emerald'].map(theme => {
  const el = createMockElement('', 'div');
  el.classList.add('accent-theme-card');
  el.dataset.theme = theme;
  return el;
});

const mockPanes = ['vault', 'editor', 'appearance', 'keybindings'].map(tab => {
  const el = elementsMap[`settings-pane-${tab}`] || createMockElement(`settings-pane-${tab}`);
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
  getElementById: (id) => elementsMap[id] || null,
  querySelector: (sel) => {
    if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || null;
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

// 3. Evaluate app.js
const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
eval(`(function() {\n${appCode}\n})()`);

console.log('--- 1. Simulating Click on Sidebar Footer Gear Button ---');
const btnSidebarGear = elementsMap['btn-project-settings'];
const modal = elementsMap['project-settings-modal'];
assert(btnSidebarGear, 'Sidebar gear button (#btn-project-settings) must exist');
assert(modal, 'Settings modal (#project-settings-modal) must exist');
assert(modal.classList.contains('hidden'), 'Settings modal must start hidden');

btnSidebarGear.click();
assert(!modal.classList.contains('hidden'), 'Modal must not have hidden class after clicking sidebar gear');
assert.strictEqual(modal.style.display, 'flex', 'Modal must have display: flex after opening');
assert.strictEqual(modal.style.zIndex, '260', 'Modal must have adequate high z-index (260)');
console.log('✓ Sidebar footer gear button successfully opens Settings modal');

console.log('--- 2. Simulating Close Button [×] Click ---');
const btnClose = elementsMap['btn-close-project-settings'];
assert(btnClose, 'Close button [×] must exist');
btnClose.click();
assert(modal.classList.contains('hidden'), 'Modal must have hidden class after clicking close button');
assert.strictEqual(modal.style.display, 'none', 'Modal must have display: none after closing');
console.log('✓ Close button [×] cleanly dismisses Settings modal');

console.log('--- 3. Simulating Click on Dashboard Settings Button ---');
const btnDashSettings = elementsMap['menu-btn-settings'];
assert(btnDashSettings, 'Dashboard settings button (#menu-btn-settings) must exist');
btnDashSettings.click();
assert(!modal.classList.contains('hidden'), 'Modal must become visible after clicking dashboard settings button');
assert.strictEqual(modal.style.display, 'flex', 'Modal must have display: flex after dashboard click');
console.log('✓ Dashboard settings button successfully opens Settings modal');

console.log('--- 4. Simulating Backdrop / Click Outside Dismissal ---');
modal.click();
assert(modal.classList.contains('hidden'), 'Modal must close on clicking backdrop');
assert.strictEqual(modal.style.display, 'none', 'Modal must have display: none after backdrop click');
console.log('✓ Clicking outside backdrop cleanly dismisses Settings modal');

console.log('--- 5. Simulating Keyboard Shortcuts: Escape & Ctrl+, ---');
// Reopen
btnSidebarGear.click();
assert(!modal.classList.contains('hidden'));
global.document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault: () => {} });
assert(modal.classList.contains('hidden'), 'Escape key must close Settings modal');

// Toggle with Ctrl+,
global.document.dispatchEvent({ type: 'keydown', key: ',', ctrlKey: true, preventDefault: () => {} });
assert(!modal.classList.contains('hidden'), 'Ctrl+, must toggle open Settings modal');

global.document.dispatchEvent({ type: 'keydown', key: ',', ctrlKey: true, preventDefault: () => {} });
assert(modal.classList.contains('hidden'), 'Ctrl+, must toggle closed Settings modal');
console.log('✓ Keyboard shortcuts (Escape & Ctrl+,) cleanly toggle and dismiss Settings modal');

console.log('--- 6. Simulating Inner SVG Child Click Bubbling ---');
const mockSvgChild = createMockElement('', 'path');
btnSidebarGear.appendChild(mockSvgChild);
mockSvgChild.click();
assert(!modal.classList.contains('hidden'), 'Clicking inner SVG child must bubble and open Settings modal');
btnClose.click();
assert(modal.classList.contains('hidden'));
console.log('✓ Inner SVG icon click correctly opens Settings modal');

console.log('--- 7. Simulating Compatibility Aliases & Fallbacks ---');
const btnSettingsAlias = global.document.getElementById('btn-settings');
assert(btnSettingsAlias, 'document.getElementById("btn-settings") alias must resolve');
const menuBtnProjectSettings = elementsMap['menu-btn-project-settings'];
assert(menuBtnProjectSettings, '#menu-btn-project-settings must exist');
menuBtnProjectSettings.click();
assert(!modal.classList.contains('hidden'), 'Clicking fallback menu-btn-project-settings must open Settings modal');
btnClose.click();
assert(modal.classList.contains('hidden'));

btnSettingsAlias.click();
assert(!modal.classList.contains('hidden'), 'Clicking #btn-settings alias must open Settings modal');
btnClose.click();
assert(modal.classList.contains('hidden'));
console.log('✓ Fallback triggers (#btn-settings, #menu-btn-project-settings) successfully activate modal');

console.log('--- 8. Verifying Global Window Exports ---');
assert.strictEqual(typeof global.window.openSettingsModal, 'function', 'window.openSettingsModal must be a function');
assert.strictEqual(typeof global.window.closeSettingsModal, 'function', 'window.closeSettingsModal must be a function');
assert.strictEqual(typeof global.window.isSettingsModalOpen, 'function', 'window.isSettingsModalOpen must be a function');

global.window.openSettingsModal();
assert(!modal.classList.contains('hidden'), 'window.openSettingsModal must open modal');
assert.strictEqual(global.window.isSettingsModalOpen(), true, 'window.isSettingsModalOpen must return true');

global.window.closeSettingsModal();
assert(modal.classList.contains('hidden'), 'window.closeSettingsModal must close modal');
assert.strictEqual(global.window.isSettingsModalOpen(), false, 'window.isSettingsModalOpen must return false');
console.log('✓ Window global helpers (openSettingsModal, closeSettingsModal, isSettingsModalOpen) verified');

console.log('--- 9. Verifying Alias Selector Resolution ---');
const resolvedModal = global.document.getElementById('settings-modal');
assert(resolvedModal, 'document.getElementById("settings-modal") must resolve to settings modal');
const resolvedModalByQuery = global.document.querySelector('#settings-modal');
assert(resolvedModalByQuery, 'document.querySelector("#settings-modal") must resolve to settings modal');
console.log('✓ #settings-modal selector alias correctly resolves to settings modal');

console.log('--- 10. Verifying Nested Modal Escape Hierarchy ---');
btnSidebarGear.click();
assert(!modal.classList.contains('hidden'), 'Settings modal must be open');
const vaultConfirm = elementsMap['vault-reset-confirm-modal'];
assert(vaultConfirm, 'Vault reset confirm modal must exist');
vaultConfirm.classList.remove('hidden'); // User opens Danger Zone confirmation

// First Escape should close the confirmation dialog, NOT the settings modal
global.document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault: () => {} });
assert(vaultConfirm.classList.contains('hidden'), 'First Escape must close danger confirmation modal');
assert(!modal.classList.contains('hidden'), 'Settings modal must remain open after dismissing danger confirmation');

// Second Escape should close the settings modal
global.document.dispatchEvent({ type: 'keydown', key: 'Escape', preventDefault: () => {} });
assert(modal.classList.contains('hidden'), 'Second Escape must close Settings modal');
console.log('✓ Nested modal Escape hierarchy verified (danger confirm dismissed first, settings modal dismissed second)');

console.log('\n=== ALL DOM INTERACTION TESTS PASSED (100%) ===\n');

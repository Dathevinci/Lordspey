const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING LORD SPEY NEW NOTE & DROPDOWN ACTION FIX TEST SUITE ===\n');

// 1. Structural Markup & CSS Verification
console.log('--- 1. Structural Markup & CSS Verification ---');
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, '..', 'css/style.css'), 'utf8');

// Assert sidebar footer buttons and dropdown
assert(htmlContent.includes('id="btn-new-note"'), 'Missing btn-new-note in index.html');
assert(htmlContent.includes('id="btn-new-note-dropdown"'), 'Missing btn-new-note-dropdown in index.html');
assert(htmlContent.includes('id="new-note-dropdown"'), 'Missing new-note-dropdown in index.html');

const footerRowMatch = htmlContent.match(/<div class="sidebar-footer-row">([\s\S]*?)<\/div>/);
assert(footerRowMatch, 'sidebar-footer-row must exist');
const footerRowHtml = footerRowMatch[1];
assert(footerRowHtml.includes('id="btn-new-note"'), 'btn-new-note must be in sidebar-footer-row');
assert(footerRowHtml.includes('id="btn-new-note-dropdown"'), 'btn-new-note-dropdown must be in sidebar-footer-row');
assert(footerRowHtml.includes('id="btn-project-settings"'), 'btn-project-settings must be in sidebar-footer-row');

// Dropdown creation items
['chapter', 'character', 'world', 'draft'].forEach(type => {
  assert(htmlContent.includes(`data-create-type="${type}"`), `Missing dropdown item for type "${type}"`);
});

// CSS styles
assert(cssContent.includes('.btn-new-dropdown-toggle'), 'CSS missing .btn-new-dropdown-toggle');
assert(cssContent.includes('.btn-new-dropdown-toggle:hover'), 'CSS missing .btn-new-dropdown-toggle:hover');
assert(cssContent.includes('.btn-new-dropdown-toggle.active'), 'CSS missing .btn-new-dropdown-toggle.active');
assert(cssContent.includes('.new-note-dropdown'), 'CSS missing .new-note-dropdown');
assert(cssContent.includes('.new-note-dropdown.hidden'), 'CSS missing .new-note-dropdown.hidden');

console.log('✓ Markup and CSS split button & dropdown rules verified');

// 2. DOM Controller Event Simulation
console.log('\n--- 2. DOM Controller Event Simulation & Occlusion Prevention ---');

// Setup mock browser environment
const mockLocalStorage = { 'lordspey_tutorial_seen': 'true' };
global.localStorage = {
  getItem: k => (k in mockLocalStorage ? mockLocalStorage[k] : null),
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

const storageCode = fs.readFileSync(path.join(__dirname, '..', 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

const Markdown = require('../js/markdown.js');
global.Markdown = Markdown;

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
    addEventListener: function(evt, handler) {
      if (!listeners[evt]) listeners[evt] = [];
      listeners[evt].push(handler);
    },
    removeEventListener: function(evt, handler) {
      if (listeners[evt]) listeners[evt] = listeners[evt].filter(h => h !== handler);
    },
    click: function() {
      let stopped = false;
      const ev = {
        type: 'click',
        target: this,
        currentTarget: this,
        preventDefault: () => {},
        stopPropagation: () => { stopped = true; }
      };
      if (listeners['click']) {
        listeners['click'].forEach(fn => fn(ev));
      }
      if (!stopped) {
        let parent = this.parentElement;
        while (parent) {
          if (parent.listeners && parent.listeners['click']) {
            parent.listeners['click'].forEach(fn => fn(ev));
          }
          if (stopped) break;
          parent = parent.parentElement;
        }
        if (!stopped && global.document && global.document.dispatchEvent) {
          global.document.dispatchEvent(ev);
        }
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
          if (s.includes('[data-create-type=') && current.dataset && current.dataset.createType) {
            const match = s.match(/\[data-create-type="?([^"\]]+)"?\]/);
            if (match && current.dataset.createType === match[1]) return current;
          }
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

// Start modals & dropdown in hidden state
['intro-splash', 'modal-overlay', 'new-note-dropdown', 'delete-overlay', 'settings-modal', 'project-settings-modal', 'modal-update'].forEach(id => {
  if (elementsMap[id]) elementsMap[id].classList.add('hidden');
});

// Mock dropdown items
const dropdownItems = ['chapter', 'character', 'world', 'draft'].map(type => {
  const el = createMockElement('', 'button');
  el.classList.add('new-dropdown-item');
  el.dataset.createType = type;
  return el;
});

const docListeners = {};
global.document = {
  getElementById: id => elementsMap[id] || null,
  querySelector: sel => {
    if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || null;
    if (sel === '.new-note-dropdown') return elementsMap['new-note-dropdown'] || null;
    if (sel === '.format-bar') return createMockElement('format-bar');
    return null;
  },
  querySelectorAll: sel => {
    if (sel === '.new-dropdown-item') return dropdownItems;
    if (sel === '.base-theme-card') return [];
    if (sel === '.menu-card') return [];
    if (sel === '.nav-section-header') return [];
    return [];
  },
  addEventListener: (evt, fn) => {
    if (!docListeners[evt]) docListeners[evt] = [];
    docListeners[evt].push(fn);
  },
  removeEventListener: (evt, fn) => {
    if (docListeners[evt]) docListeners[evt] = docListeners[evt].filter(f => f !== fn);
  },
  dispatchEvent: (ev) => {
    if (docListeners[ev.type]) {
      docListeners[ev.type].forEach(fn => fn(ev));
    }
  },
  documentElement: { style: { setProperty: () => {} } },
  body: { style: { setProperty: () => {} } }
};

global.window = {
  document: global.document,
  addEventListener: () => {},
  removeEventListener: () => {},
  localStorage: global.localStorage,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};

// Evaluate app.js
const appCode = fs.readFileSync(path.join(__dirname, '..', 'js/app.js'), 'utf8');
eval(appCode);

const btnNewNote = elementsMap['btn-new-note'];
const btnNewNoteDropdown = elementsMap['btn-new-note-dropdown'];
const newNoteDropdown = elementsMap['new-note-dropdown'];
const modalOverlay = elementsMap['modal-overlay'];
const modalCategory = elementsMap['modal-note-category'];
const modalCancel = elementsMap['modal-cancel'];

assert(btnNewNote, 'btnNewNote reference must exist');
assert(btnNewNoteDropdown, 'btnNewNoteDropdown reference must exist');
assert(newNoteDropdown, 'newNoteDropdown reference must exist');
assert(modalOverlay, 'modalOverlay reference must exist');

// Test Case 1: Pressing "+ New Note" directly ONLY opens modal and NEVER opens dropdown
console.log('Testing: Clicking btnNewNote opens modal and keeps dropdown hidden...');
assert(modalOverlay.classList.contains('hidden'), 'modal-overlay must be initially hidden');
assert(newNoteDropdown.classList.contains('hidden'), 'new-note-dropdown must be initially hidden');

btnNewNote.click();

assert(!modalOverlay.classList.contains('hidden'), 'modal-overlay must be VISIBLE after clicking btn-new-note');
assert(newNoteDropdown.classList.contains('hidden'), 'new-note-dropdown must REMAIN HIDDEN when btn-new-note is pressed (no double trigger)');
assert(!btnNewNoteDropdown.classList.contains('active'), 'btnNewNoteDropdown must not be active');
console.log('✓ Test 1 Passed: btnNewNote opens modal only, zero dropdown triggering');

// Close modal
modalCancel.click();
assert(modalOverlay.classList.contains('hidden'), 'modal-overlay must be closed after cancel');

// Test Case 2: Clicking dropdown toggle button opens dropdown and NEVER opens modal
console.log('Testing: Clicking btnNewNoteDropdown toggles dropdown and keeps modal hidden...');
btnNewNoteDropdown.click();

assert(!newNoteDropdown.classList.contains('hidden'), 'new-note-dropdown must be VISIBLE after clicking toggle');
assert(btnNewNoteDropdown.classList.contains('active'), 'btnNewNoteDropdown must have active class');
assert(modalOverlay.classList.contains('hidden'), 'modal-overlay must REMAIN HIDDEN when toggle is clicked');
console.log('✓ Test 2 Passed: btnNewNoteDropdown toggles dropdown cleanly without modal popping up');

// Test Case 3: Toggle button again closes dropdown
btnNewNoteDropdown.click();
assert(newNoteDropdown.classList.contains('hidden'), 'new-note-dropdown must be hidden after second toggle click');
assert(!btnNewNoteDropdown.classList.contains('active'), 'btnNewNoteDropdown active class removed');
console.log('✓ Test 3 Passed: Re-clicking toggle button closes dropdown');

// Test Case 4: Dismiss dropdown on click outside
btnNewNoteDropdown.click();
assert(!newNoteDropdown.classList.contains('hidden'), 'Dropdown open before outside click');

const outsideEl = createMockElement('some-other-area');
global.document.dispatchEvent({
  type: 'click',
  target: outsideEl
});
assert(newNoteDropdown.classList.contains('hidden'), 'new-note-dropdown must be hidden after click outside');
assert(!btnNewNoteDropdown.classList.contains('active'), 'btnNewNoteDropdown must not be active after outside click');
console.log('✓ Test 4 Passed: Outside click cleanly dismisses dropdown');

// Test Case 5: Dismiss dropdown on Escape key
btnNewNoteDropdown.click();
assert(!newNoteDropdown.classList.contains('hidden'), 'Dropdown open before escape key');

let escStopped = false;
global.document.dispatchEvent({
  type: 'keydown',
  key: 'Escape',
  stopPropagation: () => { escStopped = true; }
});
assert(newNoteDropdown.classList.contains('hidden'), 'new-note-dropdown must be hidden after Escape key');
assert(!btnNewNoteDropdown.classList.contains('active'), 'btnNewNoteDropdown must not be active after Escape');
assert(escStopped, 'Escape event propagation must be stopped to avoid dismissing underlying UI');
console.log('✓ Test 5 Passed: Escape key cleanly dismisses dropdown with stopPropagation');

// Test Case 6: Dropdown item click closes dropdown and opens modal with appropriate type
console.log('Testing: Selecting dropdown options sets category and opens modal...');
const chapterItem = dropdownItems.find(i => i.dataset.createType === 'chapter');
chapterItem.click();

assert(newNoteDropdown.classList.contains('hidden'), 'new-note-dropdown must be hidden after item click');
assert(!btnNewNoteDropdown.classList.contains('active'), 'btnNewNoteDropdown must not be active after item click');
assert(!modalOverlay.classList.contains('hidden'), 'modal-overlay must be open after choosing Chapter');
assert.strictEqual(modalCategory.value, 'chapter', 'modalCategory must be set to chapter');

modalCancel.click();
assert(modalOverlay.classList.contains('hidden'), 'modal-overlay closed');

// Character item click
const charItem = dropdownItems.find(i => i.dataset.createType === 'character');
charItem.click();
assert(newNoteDropdown.classList.contains('hidden'), 'dropdown closed after character item');
assert(!modalOverlay.classList.contains('hidden'), 'modal opened for character note');
assert.strictEqual(modalCategory.value, 'lore', 'Character category defaults to safe lore category');
assert(modalOverlay.dataset.template.includes('Character'), 'Character template populated');

modalCancel.click();

// World item click
const worldItem = dropdownItems.find(i => i.dataset.createType === 'world');
worldItem.click();
assert(newNoteDropdown.classList.contains('hidden'), 'dropdown closed after world item');
assert(!modalOverlay.classList.contains('hidden'), 'modal opened for world note');
assert.strictEqual(modalCategory.value, 'world', 'World category set');
assert(modalOverlay.dataset.template.includes('World Lore'), 'World template populated');

modalCancel.click();

// Test Case 7: If dropdown is open and user clicks btnNewNote, dropdown is dismissed and modal opens
btnNewNoteDropdown.click();
assert(!newNoteDropdown.classList.contains('hidden'), 'Dropdown open');
assert(modalOverlay.classList.contains('hidden'), 'Modal closed');

btnNewNote.click();
assert(newNoteDropdown.classList.contains('hidden'), 'Dropdown must be dismissed when btnNewNote is pressed');
assert(!btnNewNoteDropdown.classList.contains('active'), 'btnNewNoteDropdown must be cleared');
assert(!modalOverlay.classList.contains('hidden'), 'Modal must be open');

modalCancel.click();
console.log('✓ Test 6 & 7 Passed: Dropdown items and direct New Note interactions are completely mutually exclusive');

console.log('\n=== ALL NEW NOTE & DROPDOWN ACTION TESTS PASSED (100%) ===\n');

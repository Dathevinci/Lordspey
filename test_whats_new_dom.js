const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING WHAT\'S NEW IN v1.1.0 & AUTO-UPDATE DOM DEEP VERIFICATION ===\n');

// 1. Setup Mock DOM Environment
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
let backupCallCount = 0;
const originalCreateBackup = Storage.createBackup;
Storage.createBackup = function() {
  backupCallCount++;
  if (originalCreateBackup) originalCreateBackup.apply(Storage, arguments);
};
global.Storage = Storage;

const Markdown = require('./js/markdown.js');
global.Markdown = Markdown;

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
    querySelector: function(sel) {
      if (sel === '.btn-link-whats-new') {
        return this.btnLinkWhatsNew || null;
      }
      return null;
    },
    querySelectorAll: function() { return []; },
    addEventListener: function(evt, handler) {
      if (!listeners[evt]) listeners[evt] = [];
      listeners[evt].push(handler);
    },
    dispatchEvent: function(event) {
      const type = event.type || event;
      if (listeners[type]) {
        listeners[type].forEach(fn => fn(event));
      }
    },
    focus: () => {},
    blur: () => {},
    click: function() {
      const evt = { type: 'click', target: this, preventDefault: () => {} };
      if (typeof this.onclick === 'function') {
        this.onclick(evt);
      }
      this.dispatchEvent(evt);
    }
  };
}

const elementRegistry = {};
function getOrCreateElement(id, tag = 'div') {
  if (!elementRegistry[id]) {
    elementRegistry[id] = createMockElement(id, tag);
  }
  return elementRegistry[id];
}

// Extract all IDs and initial classes from index.html
const tagMatches = htmlContent.match(/<([a-z0-9]+)[^>]*\bid="([^"]+)"[^>]*>/gi) || [];
tagMatches.forEach(tagStr => {
  const idMatch = tagStr.match(/\bid="([^"]+)"/i);
  const classMatch = tagStr.match(/\bclass="([^"]+)"/i);
  if (idMatch) {
    const id = idMatch[1];
    const el = getOrCreateElement(id);
    if (classMatch) {
      classMatch[1].split(/\s+/).forEach(c => {
        if (c) el.classList.add(c);
      });
    }
  }
});

// Setup mock window and document
const mockDocument = {
  getElementById: id => getOrCreateElement(id),
  querySelector: sel => {
    if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
    return createMockElement('', 'div');
  },
  querySelectorAll: sel => [],
  addEventListener: (evt, h) => {},
  removeEventListener: (evt, h) => {},
  body: createMockElement('body', 'body'),
  documentElement: createMockElement('html', 'html'),
  createElement: tag => createMockElement('', tag)
};

const mockWindow = {
  document: mockDocument,
  localStorage: global.localStorage,
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { reload: () => {} },
  navigator: { platform: 'Win32', userAgent: 'Windows' }
};

global.window = mockWindow;
global.document = mockDocument;
global.navigator = mockWindow.navigator;

// Load app.js
const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
eval(`(function() { ${appCode}; })()`);

console.log('--- 1. Testing What\'s New Modal Opening & Rendering ---');
const modalUpdate = getOrCreateElement('modal-update');
const badgeEl = getOrCreateElement('update-modal-badge');
const titleEl = getOrCreateElement('update-modal-title');
const notesEl = getOrCreateElement('update-release-notes');
const curVerChip = getOrCreateElement('update-current-version-chip');
const newVerChip = getOrCreateElement('update-new-version-chip');
const arrowEl = getOrCreateElement('update-version-arrow');
const downloadBtn = getOrCreateElement('btn-download-update');
const downloadText = getOrCreateElement('btn-download-update-text');

// Initially modal is hidden
modalUpdate.classList.add('hidden');
assert(modalUpdate.classList.contains('hidden'));

// Test opening via window export
window.openLordSpeyWhatsNewModal();
assert(!modalUpdate.classList.contains('hidden'), 'modal-update must be visible after openLordSpeyWhatsNewModal');
assert(badgeEl.textContent.includes("WHAT'S NEW"), 'Badge must indicate What\'s New');
assert(curVerChip.textContent.includes('v1.1.0') || curVerChip.textContent.includes('v1.1.1') || curVerChip.textContent.includes('v1.1.2') || curVerChip.textContent.includes('v1.1.3'), 'Current version chip must show v1.1.0, v1.1.1, v1.1.2, or v1.1.3');
assert.strictEqual(arrowEl.textContent, '✦');
assert(newVerChip.textContent.includes('Latest Edition'), 'New version chip must show Latest Edition');
assert.strictEqual(downloadText.textContent, 'Explore Features');
assert(notesEl.innerHTML.includes('whats-new-grid'), 'Notes must contain whats-new-grid');
assert(notesEl.innerHTML.includes('Official Raven Brand Logo'), 'Notes must include raven logo feature');
assert(notesEl.innerHTML.includes('whats-new-bullet'), 'Notes must include bullet points');

console.log('✓ What\'s New modal opened with all 9 visual features and bullet points');

console.log('--- 2. Testing "Explore Features" Click Actions ---');
const settingsModal = getOrCreateElement('project-settings-modal');
settingsModal.classList.remove('hidden'); // pretend settings modal was open behind it
downloadBtn.click();
assert(modalUpdate.classList.contains('hidden'), 'Update modal must close on Explore Features');
assert(settingsModal.classList.contains('hidden'), 'Settings modal must close on Explore Features so user is on canvas');
console.log('✓ "Explore Features" cleanly dismisses What\'s New and returns user to workspace canvas');

console.log('--- 3. Testing Settings Buttons Triggers ---');
const btnWhatsNewVault = getOrCreateElement('settings-btn-whats-new-vault');
btnWhatsNewVault.click();
assert(!modalUpdate.classList.contains('hidden'), 'settings-btn-whats-new-vault must open What\'s New modal');
window.closeLordSpeyUpdateModal();
assert(modalUpdate.classList.contains('hidden'));

const btnWhatsNewGuides = getOrCreateElement('settings-btn-whats-new-guides');
btnWhatsNewGuides.click();
assert(!modalUpdate.classList.contains('hidden'), 'settings-btn-whats-new-guides must open What\'s New modal');
window.closeLordSpeyUpdateModal();

const btnWhatsNewMenu = getOrCreateElement('menu-btn-whats-new');
btnWhatsNewMenu.click();
assert(!modalUpdate.classList.contains('hidden'), 'menu-btn-whats-new must open What\'s New modal');
window.closeLordSpeyUpdateModal();

console.log('✓ What\'s New buttons in Settings (Vault & Guides) and Dashboard all trigger modal');

console.log('--- 4. Testing Up-To-Date Check Automatically Opening What\'s New ---');
// Simulate __handleUpdateCheckResult with up-to-date payload and userInitiated: true
modalUpdate.classList.add('hidden');
window.__handleUpdateCheckResult({
  hasUpdate: false,
  latestVersion: 'v1.1.0',
  userInitiated: true
});
assert(!modalUpdate.classList.contains('hidden'), 'User initiated up-to-date check must display What\'s New modal');
assert.strictEqual(downloadText.textContent, 'Explore Features');
window.closeLordSpeyUpdateModal();

console.log('✓ Up-to-date check automatically displays What\'s New modal to satisfy user expectations');

console.log('--- 5. Testing Interactive Test Notification & State Reset ---');
const btnTestVault = getOrCreateElement('settings-btn-test-update-vault');
const updateBanner = getOrCreateElement('update-banner');
const bannerVer = getOrCreateElement('update-banner-version');
const btnBannerView = getOrCreateElement('btn-banner-view-update');

assert(updateBanner.classList.contains('hidden'));
btnTestVault.click();
assert(!updateBanner.classList.contains('hidden'), 'Banner must be visible after Test Notification click');
assert(bannerVer.textContent.includes('v1.2.0'), 'Banner must show preview version');

// Now click Update Now from banner
btnBannerView.click();
assert(updateBanner.classList.contains('hidden'), 'Banner must hide when opening modal');
assert(!modalUpdate.classList.contains('hidden'), 'Update modal must open');
assert(badgeEl.textContent.includes('PREVIEW (DEMO)'), 'Badge must indicate demo preview');
assert.strictEqual(arrowEl.textContent, '→', 'Arrow must be reset to → in update mode');
assert(newVerChip.textContent.includes('Demo'), 'Version chip must show Demo tag');
assert.strictEqual(downloadText.textContent, 'Test Safe Backup & Close', 'Action button text must reset to Test Safe Backup & Close, NOT Explore Features');

// Click Test Safe Backup & Close
const prevBackups = backupCallCount;
downloadBtn.click();
assert(modalUpdate.classList.contains('hidden'), 'Modal must close');
assert(backupCallCount > prevBackups, 'Clicking action in demo mode must trigger automated safety backup');

console.log('✓ Interactive test notification works smoothly with automated backup and correct button text reset');

console.log('--- 6. Re-testing What\'s New after Demo Update Mode ---');
// Verify clean state restoration when reopening What's New
window.openLordSpeyWhatsNewModal();
assert(badgeEl.textContent.includes("WHAT'S NEW"), 'Badge must be restored to WHAT\'S NEW');
assert.strictEqual(arrowEl.textContent, '✦', 'Arrow must be restored to ✦');
assert(newVerChip.textContent.includes('Latest Edition'), 'New ver chip must be restored to Latest Edition');
assert.strictEqual(downloadText.textContent, 'Explore Features', 'Action button must be restored to Explore Features');
window.closeLordSpeyUpdateModal();

console.log('✓ Clean state isolation between What\'s New and Update modes verified');

console.log('\n=== ALL WHAT\'S NEW & AUTO-UPDATE DOM TESTS PASSED (100%) ===\n');

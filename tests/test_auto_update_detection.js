const assert = require('assert');
const fs = require('fs');
const path = require('path');

(async function runAutoUpdateTests() {
  console.log('=== RUNNING LORD SPEY AUTO-UPDATE DETECTION TEST SUITE ===\n');

  // 1. Structural Markup & CSS Verification
  console.log('--- 1. Structural Markup & CSS Verification ---');
  const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const cssContent = fs.readFileSync(path.join(__dirname, '..', 'css/style.css'), 'utf8');

  // Top Update Notification Banner
  assert(htmlContent.includes('id="update-banner"'), 'Missing id="update-banner" in index.html');
  assert(htmlContent.includes('id="update-banner-version"'), 'Missing id="update-banner-version" in index.html');
  assert(htmlContent.includes('id="btn-banner-view-update"'), 'Missing id="btn-banner-view-update" in index.html');
  assert(htmlContent.includes('id="btn-banner-dismiss-update"'), 'Missing id="btn-banner-dismiss-update" in index.html');

  // Sidebar Settings gear button badge
  assert(htmlContent.includes('id="sidebar-update-badge"'), 'Missing id="sidebar-update-badge" in index.html');
  const sidebarGearMatch = htmlContent.match(/<button id="btn-project-settings"[\s\S]*?<\/button>/);
  assert(sidebarGearMatch, 'btn-project-settings button must exist');
  assert(sidebarGearMatch[0].includes('id="sidebar-update-badge"'), 'sidebar-update-badge must be nested inside btn-project-settings');

  // Dashboard Update Badge & Indicator
  assert(htmlContent.includes('id="dashboard-update-badge"'), 'Missing id="dashboard-update-badge" in index.html');
  assert(htmlContent.includes('id="dashboard-update-indicator"'), 'Missing id="dashboard-update-indicator" in index.html');
  assert(htmlContent.includes('id="dashboard-update-text"'), 'Missing id="dashboard-update-text" in index.html');

  // CSS Styles
  assert(cssContent.includes('.update-badge-dot'), 'Missing .update-badge-dot in css/style.css');
  assert(cssContent.includes('.btn-settings-gear.has-update'), 'Missing .btn-settings-gear.has-update in css/style.css');
  assert(cssContent.includes('.menu-sec-update'), 'Missing .menu-sec-update in css/style.css');
  assert(cssContent.includes('.update-badge-dot-static'), 'Missing .update-badge-dot-static in css/style.css');
  assert(cssContent.includes('@keyframes updatePulse'), 'Missing @keyframes updatePulse in css/style.css');
  console.log('✓ HTML markup and CSS rules for banner, sidebar badge, and dashboard indicators verified');

  // 2. Semver Comparison Logic Verification
  console.log('--- 2. Semver Comparison Verification ---');
  function parseSemver(v) {
    if (!v) return [0, 0, 0];
    const clean = String(v).replace(/^v/i, '').trim();
    return clean.split('.').map(n => parseInt(n, 10) || 0);
  }
  function compareSemver(v1, v2) {
    const p1 = parseSemver(v1);
    const p2 = parseSemver(v2);
    const len = Math.max(p1.length, p2.length);
    for (let i = 0; i < len; i++) {
      const a = p1[i] || 0;
      const b = p2[i] || 0;
      if (a > b) return 1;
      if (a < b) return -1;
    }
    return 0;
  }
  assert.strictEqual(compareSemver('1.1.5', '1.1.5'), 0, 'Current version 1.1.5 == 1.1.5');
  assert.strictEqual(compareSemver('v1.1.5', '1.1.5'), 0, 'Prefixed v1.1.5 == 1.1.5');
  assert.strictEqual(compareSemver('1.2.0', '1.1.5'), 1, '1.2.0 > 1.1.5');
  assert.strictEqual(compareSemver('v1.3.0', '1.1.5'), 1, 'v1.3.0 > 1.1.5');
  assert.strictEqual(compareSemver('2.0.0', '1.1.5'), 1, '2.0.0 > 1.1.5');
  assert.strictEqual(compareSemver('1.1.4', '1.1.5'), -1, '1.1.4 < 1.1.5');
  assert.strictEqual(compareSemver('1.1.3', '1.1.5'), -1, '1.1.3 < 1.1.5');
  assert.strictEqual(compareSemver('1.0.0', '1.1.5'), -1, '1.0.0 < 1.1.5');
  console.log('✓ Semver comparisons accurate for all release scenarios');

  // 3. Mock DOM & app.js Environment Setup
  console.log('--- 3. Mock DOM & Controller Evaluation ---');
  const mockLocalStorage = {
    'lordspey_tutorial_seen': 'true'
  };
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
      querySelector: function(sel) {
        if (sel === '.btn-link-whats-new') return this.btnLinkWhatsNew || null;
        if (sel === '.btn-link-update-now') {
          if (!this.btnLinkUpdateNow) this.btnLinkUpdateNow = createMockElement('', 'button');
          return this.btnLinkUpdateNow;
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
        if (listeners[type]) listeners[type].forEach(fn => fn(event));
      },
      focus: () => {},
      blur: () => {},
      click: function() {
        const evt = { type: 'click', target: this, preventDefault: () => {} };
        if (typeof this.onclick === 'function') this.onclick(evt);
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

  // Extract IDs from index.html
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

  const windowListeners = {};
  const mockWindow = {
    document: {
      getElementById: id => getOrCreateElement(id),
      querySelector: sel => {
        if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
        return createMockElement('', 'div');
      },
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      body: createMockElement('body', 'body'),
      documentElement: createMockElement('html', 'html'),
      createElement: tag => createMockElement('', tag)
    },
    localStorage: global.localStorage,
    addEventListener: (ev, fn) => {
      if (!windowListeners[ev]) windowListeners[ev] = [];
      windowListeners[ev].push(fn);
    },
    removeEventListener: (ev, fn) => {
      if (windowListeners[ev]) windowListeners[ev] = windowListeners[ev].filter(f => f !== fn);
    },
    dispatchEvent: ev => {
      const type = typeof ev === 'string' ? ev : ev.type;
      if (windowListeners[type]) windowListeners[type].forEach(fn => fn(ev));
    },
    location: { reload: () => {} },
    navigator: { platform: 'Win32', userAgent: 'Windows' }
  };

  global.window = mockWindow;
  global.document = mockWindow.document;
  global.navigator = mockWindow.navigator;

  let lastToast = null;
  global.toast = (msg, type) => { lastToast = { msg, type }; };

  // Evaluate app.js
  const appCode = fs.readFileSync(path.join(__dirname, '..', 'js/app.js'), 'utf8');
  eval(`(function() { ${appCode}; })()`);

  assert(typeof window.showLordSpeyUpdateNotification === 'function', 'showLordSpeyUpdateNotification must be exported');
  assert(typeof window.clearLordSpeyUpdateNotification === 'function', 'clearLordSpeyUpdateNotification must be exported');
  assert(typeof window.checkLordSpeyUpdates === 'function', 'checkLordSpeyUpdates must be exported');
  console.log('✓ app.js successfully evaluated with auto-update controller exports');

  // 4. Testing Notification Banner & Badges Display
  console.log('--- 4. Testing Notification Banner & Badge Display ---');
  const banner = getOrCreateElement('update-banner');
  const bannerVer = getOrCreateElement('update-banner-version');
  const sidebarBadge = getOrCreateElement('sidebar-update-badge');
  const dashboardBadge = getOrCreateElement('dashboard-update-badge');
  const dashboardIndicator = getOrCreateElement('dashboard-update-indicator');
  const dashboardUpdateText = getOrCreateElement('dashboard-update-text');
  const btnGear = getOrCreateElement('btn-project-settings');
  const modalUpdate = getOrCreateElement('modal-update');

  // Initially all elements start hidden
  assert(banner.classList.contains('hidden'), 'Update banner must start hidden');
  assert(sidebarBadge.classList.contains('hidden'), 'Sidebar badge must start hidden');
  assert(dashboardBadge.classList.contains('hidden'), 'Dashboard badge must start hidden');
  assert(dashboardIndicator.classList.contains('hidden'), 'Dashboard update indicator must start hidden');

  // Trigger update notification with newer release v1.2.0
  window.showLordSpeyUpdateNotification({
    tag_name: 'v1.2.0',
    latestVersion: 'v1.2.0',
    name: 'Lord Spey v1.2.0',
    body: '### What\'s New in v1.2.0\n- Dynamic update notifications\n- Automated backup guarantee',
    html_url: 'https://github.com/Dathevinci/Lordspey/releases/tag/v1.2.0'
  });

  assert(!banner.classList.contains('hidden'), 'Update banner must become visible');
  assert.strictEqual(bannerVer.textContent, 'v1.2.0', 'Update banner must show latest version tag');
  assert(!sidebarBadge.classList.contains('hidden'), 'Sidebar gear badge must become visible');
  assert(!dashboardBadge.classList.contains('hidden'), 'Dashboard settings badge must become visible');
  assert(!dashboardIndicator.classList.contains('hidden'), 'Dashboard update indicator button must become visible');
  assert.strictEqual(dashboardUpdateText.textContent, 'Update to v1.2.0', 'Dashboard indicator text must show update target');
  assert(btnGear.classList.contains('has-update'), 'Sidebar gear button must have .has-update class');
  console.log('✓ Banner, sidebar gear badge, and dashboard indicators successfully display new version v1.2.0');

  // 5. Testing Banner Interaction: [Update Now] opens #modal-update
  console.log('--- 5. Testing [Update Now] Banner Click & Modal Opening ---');
  const btnBannerView = getOrCreateElement('btn-banner-view-update');
  btnBannerView.click();

  assert(banner.classList.contains('hidden'), 'Banner must hide when [Update Now] is clicked');
  assert(!modalUpdate.classList.contains('hidden'), 'Modal update must open when [Update Now] is clicked');
  assert(!sidebarBadge.classList.contains('hidden'), 'Sidebar badge must stay visible while update is pending');

  const newVerChip = getOrCreateElement('update-new-version-chip');
  assert(newVerChip.textContent.includes('v1.2.0'), 'Version chip must display new version');
  window.closeLordSpeyUpdateModal();
  assert(modalUpdate.classList.contains('hidden'), 'Modal must close cleanly');
  console.log('✓ [Update Now] button opens update modal and transitions state cleanly');

  // 6. Testing Dashboard Indicator Click
  console.log('--- 6. Testing Dashboard Update Indicator Click ---');
  dashboardIndicator.click();
  assert(!modalUpdate.classList.contains('hidden'), 'Clicking dashboard indicator must open update modal');
  window.closeLordSpeyUpdateModal();
  assert(modalUpdate.classList.contains('hidden'));
  console.log('✓ Dashboard update indicator triggers update modal directly');

  // 7. Testing Banner Dismissal Preserving Subtle Badges
  console.log('--- 7. Testing Banner Dismissal Preserving Subtle Badges ---');
  // Show banner again
  window.showLordSpeyUpdateNotification({ tag_name: 'v1.2.0', latestVersion: 'v1.2.0' });
  assert(!banner.classList.contains('hidden'));

  const btnBannerDismiss = getOrCreateElement('btn-banner-dismiss-update');
  btnBannerDismiss.click();
  assert(banner.classList.contains('hidden'), 'Dismissing banner must hide floating banner');
  assert(!sidebarBadge.classList.contains('hidden'), 'Sidebar gear badge must remain visible after banner dismissal');
  assert(!dashboardBadge.classList.contains('hidden'), 'Dashboard badge must remain visible after banner dismissal');
  console.log('✓ Dismissing floating banner keeps subtle gear and dashboard badges active');

  // 8. Testing Rate-Limit & Timestamp Caching in localStorage
  console.log('--- 8. Testing Rate-Limit & Timestamp Caching in localStorage ---');
  const checkTimestamp = Date.now();
  mockLocalStorage['lordspey_last_update_check'] = String(checkTimestamp);
  mockLocalStorage['lordspey_cached_release'] = JSON.stringify({
    tag_name: 'v1.3.0',
    latestVersion: 'v1.3.0',
    hasUpdate: true
  });

  // Within 15 minutes: background check must use cached metadata
  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    return { ok: true, json: async () => ({ tag_name: 'v1.3.0' }) };
  };

  const result = await window.checkLordSpeyUpdates(false);
  assert.strictEqual(fetchCalled, false, 'Fetch must not be called when recent check is cached within 15 minutes');
  assert.strictEqual(result.cached, true, 'Result must indicate cached response');
  assert.strictEqual(result.hasUpdate, true, 'Result must report hasUpdate from cache');
  assert.strictEqual(bannerVer.textContent, 'v1.3.0', 'Banner must display cached v1.3.0 version');
  // Rate-limiting check when no cached release is in localStorage
  delete mockLocalStorage['lordspey_cached_release'];
  mockLocalStorage['lordspey_last_update_check'] = String(Date.now() - 60000); // 1 minute ago
  fetchCalled = false;
  const noCacheResult = await window.checkLordSpeyUpdates(false);
  assert.strictEqual(fetchCalled, false, 'Fetch must not be called within 15 minutes even without cached release');
  assert.strictEqual(noCacheResult.cached, true, 'Result must be marked cached');
  assert.strictEqual(noCacheResult.hasUpdate, false, 'Result must be false when no cached update exists');

  // Rate-limiting check when cached release contains invalid/corrupted JSON
  mockLocalStorage['lordspey_cached_release'] = '{malformed json';
  mockLocalStorage['lordspey_last_update_check'] = String(Date.now() - 60000);
  fetchCalled = false;
  const corruptCacheResult = await window.checkLordSpeyUpdates(false);
  assert.strictEqual(fetchCalled, false, 'Fetch must not be called within 15 minutes even with corrupted cache JSON');
  assert.strictEqual(corruptCacheResult.cached, true);
  console.log('✓ Rate-limiting cache prevents redundant network requests and restores cached release state');

  // 9. Testing Window Focus Trigger with Rate Limiting
  console.log('--- 9. Testing Window Focus Trigger with Rate Limiting ---');
  let checkTriggerCount = 0;
  const originalCheck = window.checkLordSpeyUpdates;
  window.checkLordSpeyUpdates = async (userInitiated) => {
    checkTriggerCount++;
    return { ok: true };
  };

  // Case A: Window focused within 15 minutes of last check -> Should NOT trigger check
  mockLocalStorage['lordspey_last_update_check'] = String(Date.now() - 5 * 60 * 1000); // 5 mins ago
  window.handleWindowFocusForUpdates();
  assert.strictEqual(checkTriggerCount, 0, 'Focus within 5 minutes must NOT trigger check');

  // Case B: Window focused after 20 minutes (> 15 min threshold) -> Should trigger check
  mockLocalStorage['lordspey_last_update_check'] = String(Date.now() - 20 * 60 * 1000); // 20 mins ago
  window.handleWindowFocusForUpdates();
  assert.strictEqual(checkTriggerCount, 1, 'Focus after 20 minutes MUST trigger update check');
  console.log('✓ Window focus trigger respects 15-minute rate limit threshold accurately');

  // Restore original check
  window.checkLordSpeyUpdates = originalCheck;

  // 10. Testing Silent Error Resilience for Background Checks
  console.log('--- 10. Testing Silent Error Resilience for Background Checks ---');
  // Background check with network failure
  global.fetch = async () => {
    throw new Error('HTTP 403 API rate limit exceeded');
  };
  const toastContainer = getOrCreateElement('toast-container');
  toastContainer.children = [];
  mockLocalStorage['lordspey_last_update_check'] = '0'; // expired

  const silentErrResult = await window.checkLordSpeyUpdates(false);
  assert(silentErrResult.error, 'Result must contain error');
  assert.strictEqual(toastContainer.children.length, 0, 'Background check must NEVER trigger error toast while author is working');

  // Background check failure must record timestamp in localStorage so focus doesn't repeat requests
  const errTimestamp = parseInt(mockLocalStorage['lordspey_last_update_check'], 10);
  assert(Date.now() - errTimestamp < 5000, 'Background check error must record check timestamp in localStorage');

  // Subsequent focus immediately after failure must NOT trigger another update check
  let checkTriggerCountAfterErr = 0;
  window.checkLordSpeyUpdates = async () => { checkTriggerCountAfterErr++; };
  window.handleWindowFocusForUpdates();
  assert.strictEqual(checkTriggerCountAfterErr, 0, 'Window focus immediately following an error must NOT trigger duplicate check');
  window.checkLordSpeyUpdates = originalCheck;

  // User-initiated check with network failure
  const userErrResult = await window.checkLordSpeyUpdates(true);
  assert(userErrResult.error, 'Result must contain error');
  assert(toastContainer.children.length > 0, 'User-initiated check must display error toast when check fails');
  const errorToast = toastContainer.children[toastContainer.children.length - 1];
  assert(errorToast.textContent.includes('rate limit'), 'Toast must mention rate limit on HTTP 403');
  console.log('✓ Background failures are 100% silent; user-initiated checks provide clear feedback');

  // 11. Testing Electron IPC Bridge Integration
  console.log('--- 11. Testing Electron IPC Bridge Integration ---');
  window.clearLordSpeyUpdateNotification();
  assert(banner.classList.contains('hidden'));
  assert(sidebarBadge.classList.contains('hidden'));

  // Electron main process sends update payload
  window.__handleUpdateCheckResult({
    hasUpdate: true,
    currentVersion: '1.1.3',
    latestVersion: 'v1.4.0',
    name: 'Lord Spey v1.4.0',
    body: 'Major improvements and new cosmic tools',
    htmlUrl: 'https://github.com/Dathevinci/Lordspey/releases/tag/v1.4.0',
    assets: [],
    userInitiated: false
  });

  assert(!banner.classList.contains('hidden'), 'Electron update check must show banner');
  assert.strictEqual(bannerVer.textContent, 'v1.4.0', 'Electron update check must show tag v1.4.0');
  assert(!sidebarBadge.classList.contains('hidden'), 'Electron update check must show sidebar badge');
  assert(!dashboardBadge.classList.contains('hidden'), 'Electron update check must show dashboard badge');
  assert(mockLocalStorage['lordspey_cached_release'].includes('v1.4.0'), 'Electron update check must cache release in localStorage');

  // Electron error payload must also record check timestamp
  mockLocalStorage['lordspey_last_update_check'] = '0';
  window.__handleUpdateCheckResult({
    error: 'HTTP 403 API rate limit exceeded',
    userInitiated: false
  });
  const electronErrTimestamp = parseInt(mockLocalStorage['lordspey_last_update_check'], 10);
  assert(Date.now() - electronErrTimestamp < 5000, 'Electron error payload must record check timestamp in localStorage');

  // Electron main process sends up-to-date payload
  window.__handleUpdateCheckResult({
    hasUpdate: false,
    latestVersion: 'v1.1.5',
    userInitiated: false
  });
  assert(banner.classList.contains('hidden'), 'Up-to-date payload must hide banner');
  assert(sidebarBadge.classList.contains('hidden'), 'Up-to-date payload must hide sidebar badge');
  assert(dashboardBadge.classList.contains('hidden'), 'Up-to-date payload must hide dashboard badge');
  const btnCheckVaultEl = getOrCreateElement('settings-btn-check-update-vault');
  assert.strictEqual(btnCheckVaultEl.disabled, false, 'settings-btn-check-update-vault must be re-enabled after IPC result');
  console.log('✓ Electron IPC bridge correctly controls banner and badge lifecycle and re-enables buttons');

  // 12. Testing Settings Update Action, Version Fallbacks, and Demo State Preservation
  console.log('--- 12. Testing Settings Update Action, Fallbacks, and Demo State Preservation ---');
  window.showLordSpeyUpdateNotification({ tag_name: 'v1.5.0', latestVersion: '1.5.0' });
  const statusVaultEl = getOrCreateElement('settings-vault-update-status');
  assert(statusVaultEl.innerHTML.includes('btn-link-update-now'), 'Settings update message must offer clickable Update Now button');

  // Fallback version in modal must use APP_VERSION (1.1.5), never 1.1.0
  window.showLordSpeyUpdateModal({});
  const curVerChipTest = getOrCreateElement('update-current-version-chip');
  assert(curVerChipTest.textContent.includes('v1.1.5'), 'Modal current version chip must display v1.1.5');
  window.closeLordSpeyUpdateModal();

  // Test notification preserves demo mode when clicked via dashboard indicator
  window.triggerTestUpdateNotification();
  dashboardIndicator.click();
  const updateBadgeEl = getOrCreateElement('update-modal-badge');
  assert(updateBadgeEl.textContent.includes('DEMO'), 'Dashboard indicator must preserve demo state for test notifications');
  window.closeLordSpeyUpdateModal();
  console.log('✓ Settings update action, semver fallback, and demo state preservation verified');

  console.log('\n=== ALL AUTO-UPDATE DETECTION TESTS PASSED (100%) ===\n');
})().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});

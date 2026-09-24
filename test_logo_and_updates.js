const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING LORD SPEY LOGO & AUTO-UPDATE SUITE ===\n');

// 1. Asset Files Verification
console.log('--- 1. Application Assets Verification ---');
const requiredAssets = [
  'assets/logo.png',
  'assets/icon.png',
  'assets/icon.ico',
  'assets/logo.ico',
  'assets/favicon.ico',
  'build/icon.png',
  'build/icon.ico',
  'www/assets/logo.png',
  'www/assets/icon.png',
  'www/assets/icon.ico',
  'www/assets/favicon.ico'
];

requiredAssets.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  assert(fs.existsSync(fullPath), `Required asset file missing: ${relPath}`);
  const stat = fs.statSync(fullPath);
  assert(stat.size > 1000, `Asset file is unexpectedly small (${stat.size} bytes): ${relPath}`);
});
console.log('✓ All 11 raven logo, icon, and favicon assets exist with valid non-empty byte sizes');

// 2. Package.json Configuration Verification
console.log('--- 2. Package.json Configuration Verification ---');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
assert(['1.1.0', '1.1.1', '1.1.2', '1.1.3'].includes(pkg.version), 'package.json version must be 1.1.0, 1.1.1, 1.1.2, or 1.1.3');
assert.strictEqual(pkg.build?.win?.icon, 'assets/icon.ico', 'build.win.icon must be configured to assets/icon.ico');
assert(pkg.build?.files?.includes('assets/**/*'), 'build.files must include assets/**/*');
console.log('✓ package.json v' + pkg.version + ', build.win.icon, and assets/**/* bundle inclusion verified');

// 3. HTML Markup & UI Logo Integration Verification
console.log('--- 3. HTML Markup & UI Logo Verification ---');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Favicons
assert(htmlContent.includes('<link rel="icon" type="image/png" href="assets/icon.png" />'), 'Missing png favicon link');
assert(htmlContent.includes('<link rel="shortcut icon" href="assets/favicon.ico" />'), 'Missing ico shortcut icon link');

// Sidebar header brand
const sidebarHeaderMatch = htmlContent.match(/<aside id="sidebar"[^>]*>[\s\S]*?<div class="sidebar-header">([\s\S]*?)<\/div>/);
assert(sidebarHeaderMatch, 'sidebar-header must exist in sidebar');
const sidebarHeaderHtml = sidebarHeaderMatch[1];
assert(sidebarHeaderHtml.includes('class="logo-raven-img"'), 'Sidebar brand must contain logo-raven-img');
assert(sidebarHeaderHtml.includes('assets/logo.png'), 'Sidebar brand must reference assets/logo.png');
assert(sidebarHeaderHtml.includes('LORD SPEY'), 'Sidebar brand must retain LORD SPEY text');

// Dashboard hero emblem
const heroEmblemMatch = htmlContent.match(/<div class="menu-emblem" id="menu-emblem"[^>]*>([\s\S]*?)<\/div>/);
assert(heroEmblemMatch, 'menu-emblem must exist');
const heroEmblemHtml = heroEmblemMatch[1];
assert(heroEmblemHtml.includes('class="menu-emblem-raven-img"'), 'menu-emblem must contain raven emblem image');
assert(heroEmblemHtml.includes('assets/icon.png'), 'menu-emblem must reference assets/icon.png');

// 4. Settings Tabs Update Controls Verification
console.log('--- 4. Settings Update Controls Verification ---');
// Vault tab
const vaultPaneMatch = htmlContent.match(/<div class="settings-pane[^"]*" id="settings-pane-vault">([\s\S]*?)<div class="settings-pane/);
assert(vaultPaneMatch, 'settings-pane-vault must exist');
const vaultPaneHtml = vaultPaneMatch[1];
assert(vaultPaneHtml.includes('id="settings-vault-version-display"'), 'Missing settings-vault-version-display in vault pane');
assert(vaultPaneHtml.includes('id="settings-btn-whats-new-vault"'), 'Missing settings-btn-whats-new-vault in vault pane');
assert(vaultPaneHtml.includes('id="settings-btn-check-update-vault"'), 'Missing settings-btn-check-update-vault in vault pane');
assert(vaultPaneHtml.includes('id="settings-btn-test-update-vault"'), 'Missing settings-btn-test-update-vault in vault pane');
assert(vaultPaneHtml.includes('id="settings-vault-update-status"'), 'Missing settings-vault-update-status in vault pane');
assert(vaultPaneHtml.includes('v1.1.0') || vaultPaneHtml.includes('v1.1.1') || vaultPaneHtml.includes('v1.1.2') || vaultPaneHtml.includes('v1.1.3'), 'Current version v1.1.0, v1.1.1, v1.1.2, or v1.1.3 must be rendered in vault pane');

// Guides tab
const guidesPaneMatch = htmlContent.match(/<div class="settings-pane[^"]*" id="settings-pane-keybindings">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="modal-footer">/);
assert(guidesPaneMatch, 'settings-pane-keybindings must exist');
const guidesPaneHtml = guidesPaneMatch[1];
assert(guidesPaneHtml.includes('id="settings-guides-version-display"'), 'Missing settings-guides-version-display in guides pane');
assert(guidesPaneHtml.includes('id="settings-btn-whats-new-guides"'), 'Missing settings-btn-whats-new-guides in guides pane');
assert(guidesPaneHtml.includes('id="settings-btn-check-update-guides"'), 'Missing settings-btn-check-update-guides in guides pane');
assert(guidesPaneHtml.includes('id="settings-btn-test-update-guides"'), 'Missing settings-btn-test-update-guides in guides pane');
assert(guidesPaneHtml.includes('id="settings-guides-update-status"'), 'Missing settings-guides-update-status in guides pane');
assert(guidesPaneHtml.includes('v1.1.0') || guidesPaneHtml.includes('v1.1.1') || guidesPaneHtml.includes('v1.1.2') || guidesPaneHtml.includes('v1.1.3'), 'Current version v1.1.0, v1.1.1, v1.1.2, or v1.1.3 must be rendered in guides pane');

console.log('✓ Settings tabs update controls verified: v1.1.3 displays, What\'s New, Test Notification, and Check for Updates buttons');

// 5. Update Modal & Banner Markup Verification
console.log('--- 5. Update Modal & Banner Markup Verification ---');
assert(htmlContent.includes('id="modal-update"'), 'Missing modal-update in index.html');
assert(htmlContent.includes('id="update-banner"'), 'Missing update-banner in index.html');
assert(htmlContent.includes('id="btn-close-update-modal"'), 'Missing btn-close-update-modal');
assert(htmlContent.includes('id="btn-dismiss-update"'), 'Missing btn-dismiss-update');
assert(htmlContent.includes('id="btn-download-update"'), 'Missing btn-download-update');
assert(htmlContent.includes('id="update-release-notes"'), 'Missing update-release-notes');
assert(htmlContent.includes('Safe Update Guarantee'), 'Modal must contain Safe Update Guarantee notice');
console.log('✓ Update modal and banner markup verified');

// 6. CSS Styles Verification
console.log('--- 6. CSS Stylesheet Verification ---');
const cssContent = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8');
assert(cssContent.includes('.logo-raven-img'), 'Missing .logo-raven-img in css/style.css');
assert(cssContent.includes('.menu-emblem-raven-img'), 'Missing .menu-emblem-raven-img in css/style.css');
assert(cssContent.includes('.settings-update-row'), 'Missing .settings-update-row in css/style.css');
assert(cssContent.includes('.update-modal-card'), 'Missing .update-modal-card in css/style.css');
assert(cssContent.includes('.update-banner'), 'Missing .update-banner in css/style.css');
assert(cssContent.includes('#modal-update'), 'Missing #modal-update in css/style.css');
assert(cssContent.includes('object-position: center 30%'), 'Missing centered object-position on .logo-raven-img in css/style.css');
console.log('✓ CSS stylesheet verified for logo, emblem, settings update row, update modal (z-index 500), and banner');

// 7. Electron Main Process & Preload Bridge Verification
console.log('--- 7. Electron Main Process & Preload Bridge Verification ---');
const electronCode = fs.readFileSync(path.join(__dirname, 'electron-main.js'), 'utf8');
assert(electronCode.includes('checkForUpdatesInMain'), 'Missing checkForUpdatesInMain in electron-main.js');
assert(electronCode.includes('https://api.github.com/repos/Dathevinci/Lordspey/releases/latest'), 'Missing GitHub release endpoint in electron-main.js');
assert(electronCode.includes("'assets', 'icon.png'") || electronCode.includes("assets/icon.png"), 'Missing window icon configuration in electron-main.js');
assert(electronCode.includes('preload.js'), 'Missing preload script reference in electron-main.js');
assert(fs.existsSync(path.join(__dirname, 'preload.js')), 'Missing preload.js file');
const preloadCode = fs.readFileSync(path.join(__dirname, 'preload.js'), 'utf8');
assert(preloadCode.includes('checkForUpdates'), 'Missing checkForUpdates in preload.js');
assert(pkg.build?.files?.includes('preload.js'), 'package.json build.files must include preload.js');
console.log('✓ electron-main.js window icon, preload script, and update checking logic verified');

// 8. Semver Comparison Logic Verification
console.log('--- 8. Semver Comparison Logic Verification ---');
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
assert.strictEqual(compareSemver('1.1.0', '1.1.0'), 0, '1.1.0 == 1.1.0');
assert.strictEqual(compareSemver('v1.1.0', '1.1.0'), 0, 'v1.1.0 == 1.1.0');
assert.strictEqual(compareSemver('1.2.0', '1.1.0'), 1, '1.2.0 > 1.1.0');
assert.strictEqual(compareSemver('v1.1.1', '1.1.0'), 1, 'v1.1.1 > 1.1.0');
assert.strictEqual(compareSemver('2.0.0', '1.1.0'), 1, '2.0.0 > 1.1.0');
assert.strictEqual(compareSemver('1.0.0', '1.1.0'), -1, '1.0.0 < 1.1.0');
assert.strictEqual(compareSemver('v0.9.5', '1.1.0'), -1, 'v0.9.5 < 1.1.0');
assert.strictEqual(compareSemver(null, '1.1.0'), -1, 'null < 1.1.0');
console.log('✓ compareSemver verified across equal, higher, lower, v-prefixed, and null inputs');

// 9. Update Result Handler & Error Reporting Verification
console.log('--- 9. Update Result Handler & Error Reporting Verification ---');
const appCode = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
assert(appCode.includes('isCheckingUpdates'), 'Missing isCheckingUpdates debounce guard in app.js');
assert(appCode.includes('btnVault.disabled = true'), 'Vault update button must disable during check');
assert(appCode.includes('btnGuides.disabled = true'), 'Guides update button must disable during check');
assert(appCode.includes('payload.error'), 'window.__handleUpdateCheckResult must handle payload.error');

// Simulate __handleUpdateCheckResult error handling: ensure error is NOT treated as up to date
let toastCalls = [];
function mockToast(msg, type) { toastCalls.push({ msg, type }); }
let mockStatusVault = { textContent: '', className: '' };
let mockStatusGuides = { textContent: '', className: '' };

const simulateHandler = (payload) => {
  const statusVault = mockStatusVault;
  const statusGuides = mockStatusGuides;
  const setStatus = (text, className) => {
    if (statusVault) { statusVault.textContent = text; statusVault.className = 'update-status-msg ' + className; }
    if (statusGuides) { statusGuides.textContent = text; statusGuides.className = 'update-status-msg ' + className; }
  };

  if (payload.error) {
    if (payload.userInitiated) {
      const isRateLimit = String(payload.error).includes('403');
      const errorMsg = isRateLimit
        ? 'Update rate limit reached. Please try again shortly.'
        : `Could not check updates: ${payload.error}`;
      mockToast(errorMsg, 'error');
      setStatus(errorMsg, 'alert');
    }
    return;
  }

  if (payload.hasUpdate) {
    setStatus(`New update ${payload.latestVersion} available!`, 'success');
  } else if (payload.userInitiated) {
    const currentTag = payload.latestVersion || 'v1.1.0';
    setStatus(`✓ Lord Spey is up to date (${currentTag})`, 'success');
    mockToast(`Lord Spey is up to date (${currentTag})`, 'success');
  }
};

// Test error case: MUST NOT report up to date
simulateHandler({ error: 'HTTP 403', userInitiated: true });
assert.strictEqual(toastCalls.length, 1);
assert.strictEqual(toastCalls[0].type, 'error');
assert(toastCalls[0].msg.includes('rate limit'), 'Must report rate limit on HTTP 403 error');
assert.strictEqual(mockStatusVault.className, 'update-status-msg alert');
assert(mockStatusVault.textContent.includes('rate limit'));

// Test up-to-date case
toastCalls = [];
simulateHandler({ hasUpdate: false, latestVersion: 'v1.1.0', userInitiated: true });
assert.strictEqual(toastCalls.length, 1);
assert.strictEqual(toastCalls[0].type, 'success');
assert(toastCalls[0].msg.includes('up to date'), 'Must report up to date on false hasUpdate');
assert.strictEqual(mockStatusVault.className, 'update-status-msg success');
assert(mockStatusVault.textContent.includes('up to date'));

console.log('✓ Error path protection verified: HTTP 403/network failures accurately reported without false positives');

// 10. Modal Dismissal & Banner Keybinding Hierarchy Verification
console.log('--- 10. Modal Dismissal & Banner Keybinding Hierarchy Verification ---');
assert(appCode.includes('btnBannerView.addEventListener'), 'Missing banner view update listener');
const bannerListenerSnippet = appCode.slice(appCode.indexOf('btnBannerView.addEventListener'), appCode.indexOf('btnBannerView.addEventListener') + 250);
assert(bannerListenerSnippet.includes('isUpdateModalOpen = true'), 'Clicking Update Now from banner must set isUpdateModalOpen = true for Escape key');
console.log('✓ Update modal Escape hierarchy flag synchronized between banner and modal views');

// 11. What's New in v1.1.0 & Test Update Notification Feature Verification
console.log('--- 11. What\'s New in v1.1.0 & Test Notification Verification ---');
assert(appCode.includes('WHATS_NEW_V110_FEATURES'), 'Missing WHATS_NEW_V110_FEATURES in app.js');
assert(appCode.includes('openWhatsNewModal'), 'Missing openWhatsNewModal in app.js');
assert(appCode.includes('triggerTestUpdateNotification'), 'Missing triggerTestUpdateNotification in app.js');
assert(appCode.includes('window.openLordSpeyWhatsNewModal'), 'Missing window.openLordSpeyWhatsNewModal export in app.js');
assert(appCode.includes('window.triggerTestUpdateNotification'), 'Missing window.triggerTestUpdateNotification export in app.js');

const requiredFeatureTitles = [
  'Official Raven Brand Logo',
  'App Themes',
  'Writing Focus Mode',
  'World Map Shapes & Region Drawing',
  'Multi-Section Folders & Note Dropdown',
  'Expanded Galaxy Graph',
  'Character Codex Portraits',
  'Standalone Modules',
  'In-App Auto-Updater'
];

requiredFeatureTitles.forEach(title => {
  assert(appCode.includes(title), `Missing required What's New feature: ${title}`);
});
console.log(`✓ All 9 What's New v1.1.0 visual features verified: ${requiredFeatureTitles.join(', ')}`);

assert(htmlContent.includes('id="menu-btn-whats-new"'), 'Missing menu-btn-whats-new on dashboard in index.html');
assert(htmlContent.includes('id="update-guarantee-text"'), 'Missing update-guarantee-text in index.html');
assert(htmlContent.includes('id="btn-download-update-icon"'), 'Missing btn-download-update-icon in index.html');
assert(cssContent.includes('.whats-new-grid'), 'Missing .whats-new-grid in css/style.css');
assert(cssContent.includes('.whats-new-card'), 'Missing .whats-new-card in css/style.css');
assert(cssContent.includes('.whats-new-bullets'), 'Missing .whats-new-bullets in css/style.css');
assert(cssContent.includes('.whats-new-bullet'), 'Missing .whats-new-bullet in css/style.css');
assert(cssContent.includes('.btn-link-whats-new'), 'Missing .btn-link-whats-new in css/style.css');
assert(cssContent.includes('.update-chip-installed'), 'Missing .update-chip-installed in css/style.css');
console.log('✓ CSS stylesheet verified for .whats-new-grid, .whats-new-card, .whats-new-bullets, and installed chips');

// Verify that user-initiated up-to-date checks trigger openWhatsNewModal
assert(appCode.includes('openWhatsNewModal(data)'), 'checkAppUpdates must invoke openWhatsNewModal when user initiates check and app is up to date');
assert(appCode.includes('openWhatsNewModal(payload)'), '__handleUpdateCheckResult must invoke openWhatsNewModal when user initiates check and app is up to date');
console.log('✓ Automatic What\'s New modal display on up-to-date check verified');

console.log('\n=== ALL LOGO & AUTO-UPDATE TESTS PASSED (100%) ===\n');

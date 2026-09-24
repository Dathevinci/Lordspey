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
assert.strictEqual(pkg.version, '1.1.0', 'package.json version must be 1.1.0');
assert.strictEqual(pkg.build?.win?.icon, 'assets/icon.ico', 'build.win.icon must be configured to assets/icon.ico');
assert(pkg.build?.files?.includes('assets/**/*'), 'build.files must include assets/**/*');
console.log('✓ package.json v1.1.0, build.win.icon, and assets/**/* bundle inclusion verified');

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

console.log('✓ UI logo integration verified: favicon, sidebar brand raven logo, and dashboard hero emblem');

// 4. Settings Tabs Update Controls Verification
console.log('--- 4. Settings Update Controls Verification ---');
// Vault tab
const vaultPaneMatch = htmlContent.match(/<div class="settings-pane[^"]*" id="settings-pane-vault">([\s\S]*?)<div class="settings-pane/);
assert(vaultPaneMatch, 'settings-pane-vault must exist');
const vaultPaneHtml = vaultPaneMatch[1];
assert(vaultPaneHtml.includes('id="settings-vault-version-display"'), 'Missing settings-vault-version-display in vault pane');
assert(vaultPaneHtml.includes('id="settings-btn-check-update-vault"'), 'Missing settings-btn-check-update-vault in vault pane');
assert(vaultPaneHtml.includes('id="settings-vault-update-status"'), 'Missing settings-vault-update-status in vault pane');
assert(vaultPaneHtml.includes('v1.1.0'), 'Current version v1.1.0 must be rendered in vault pane');

// Guides tab
const guidesPaneMatch = htmlContent.match(/<div class="settings-pane[^"]*" id="settings-pane-keybindings">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="modal-footer">/);
assert(guidesPaneMatch, 'settings-pane-keybindings must exist');
const guidesPaneHtml = guidesPaneMatch[1];
assert(guidesPaneHtml.includes('id="settings-guides-version-display"'), 'Missing settings-guides-version-display in guides pane');
assert(guidesPaneHtml.includes('id="settings-btn-check-update-guides"'), 'Missing settings-btn-check-update-guides in guides pane');
assert(guidesPaneHtml.includes('id="settings-guides-update-status"'), 'Missing settings-guides-update-status in guides pane');
assert(guidesPaneHtml.includes('v1.1.0'), 'Current version v1.1.0 must be rendered in guides pane');

console.log('✓ Settings tabs update controls verified: v1.1.0 displays and Check for Updates buttons');

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
console.log('✓ CSS stylesheet verified for logo, emblem, settings update row, update modal, and banner');

// 7. Electron-Main Verification
console.log('--- 7. Electron Main Process Verification ---');
const electronCode = fs.readFileSync(path.join(__dirname, 'electron-main.js'), 'utf8');
assert(electronCode.includes('checkForUpdatesInMain'), 'Missing checkForUpdatesInMain in electron-main.js');
assert(electronCode.includes('https://api.github.com/repos/Dathevinci/Lordspey/releases/latest'), 'Missing GitHub release endpoint in electron-main.js');
assert(electronCode.includes("'assets', 'icon.png'") || electronCode.includes("assets/icon.png"), 'Missing window icon configuration in electron-main.js');
console.log('✓ electron-main.js window icon and update checking logic verified');

console.log('\n=== ALL LOGO & AUTO-UPDATE TESTS PASSED (100%) ===\n');

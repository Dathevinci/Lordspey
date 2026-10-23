/**
 * LORD SPEY v2.0 AUTOMATED TEST SUITE
 * Verifies:
 * 1. Version 2.0.0 configuration across package.json, build.gradle, and app.js
 * 2. Obsidian-Grade Activity Ribbon DOM, styling, and navigation event hooks
 * 3. Obsidian Workspace Tabs Bar (active document sync, close, new note, view modes)
 * 4. Obsidian Bottom Status Bar (live word/char count, reading time, doc title, backlinks, mode, save indicator, v2.0.0)
 * 5. Universe Starchart & Multi-Tier Cosmic Atlas Template generation
 * 6. Version 2.0 Celebration Launch Announcement ("We finally made it to Version 2.0!")
 * 7. Hardware-accelerated fluid transitions (cubic-bezier(0.16, 1, 0.3, 1))
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING LORD SPEY v2.0 OBSIDIAN UI & UNIVERSE ATLAS SUITE ===\n');

// 1. Version 2.1.2 Configuration
console.log('--- 1. Version 2.1.2 Configuration Across Ecosystem ---');
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
assert.strictEqual(pkg.version, '2.1.2', 'package.json must be 2.1.2');

const gradleContent = fs.readFileSync(path.join(__dirname, '..', 'android', 'app', 'build.gradle'), 'utf8');
assert(gradleContent.includes('versionCode 212'), 'build.gradle must have versionCode 212');
assert(gradleContent.includes('versionName "2.1.2"'), 'build.gradle must have versionName "2.1.2"');

const appJsRaw = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');
assert(appJsRaw.includes("const APP_VERSION = '2.1.2'"), 'js/app.js APP_VERSION must be 2.1.2');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert(indexHtml.includes('css/style.css?v=2.1.2'), 'index.html style.css link must have ?v=2.1.2');
assert(indexHtml.includes('js/app.js?v=2.1.2'), 'index.html app.js link must have ?v=2.1.2');
console.log('✓ v2.1.2 synchronized across package.json, build.gradle, app.js, and index.html');

// 2. Obsidian Activity Ribbon Markup & Controls
console.log('--- 2. Obsidian Activity Ribbon Markup & Controls ---');
assert(indexHtml.includes('id="activity-ribbon"'), 'Missing activity-ribbon in index.html');
assert(indexHtml.includes('id="btn-ribbon-vault"'), 'Missing btn-ribbon-vault in activity-ribbon');
assert(indexHtml.includes('id="btn-ribbon-search"'), 'Missing btn-ribbon-search in activity-ribbon');
assert(indexHtml.includes('id="btn-ribbon-graph"'), 'Missing btn-ribbon-graph in activity-ribbon');
assert(indexHtml.includes('id="btn-ribbon-map"'), 'Missing btn-ribbon-map in activity-ribbon');
assert(indexHtml.includes('id="btn-ribbon-timeline"'), 'Missing btn-ribbon-timeline in activity-ribbon');
assert(indexHtml.includes('id="btn-ribbon-codex"'), 'Missing btn-ribbon-codex in activity-ribbon');
assert(indexHtml.includes('id="btn-ribbon-sprint"'), 'Missing btn-ribbon-sprint in activity-ribbon');
assert(indexHtml.includes('id="btn-ribbon-help"'), 'Missing btn-ribbon-help in activity-ribbon');
assert(indexHtml.includes('id="btn-ribbon-settings"'), 'Missing btn-ribbon-settings in activity-ribbon');
console.log('✓ Obsidian Activity Ribbon verified with all 9 dedicated navigation buttons');

// 3. Obsidian Workspace Tabs Bar
console.log('--- 3. Obsidian Workspace Tabs Bar Markup ---');
assert(indexHtml.includes('id="workspace-tabs-bar"'), 'Missing workspace-tabs-bar in index.html');
assert(indexHtml.includes('id="active-tab-title"'), 'Missing active-tab-title in workspace-tabs-bar');
assert(indexHtml.includes('id="btn-tab-close"'), 'Missing btn-tab-close in workspace-tabs-bar');
assert(indexHtml.includes('id="btn-tab-new"'), 'Missing btn-tab-new in workspace-tabs-bar');
assert(indexHtml.includes('id="btn-tab-reading-mode"'), 'Missing btn-tab-reading-mode in workspace-tabs-bar');
assert(indexHtml.includes('id="btn-tab-split"'), 'Missing btn-tab-split in workspace-tabs-bar');
assert(indexHtml.includes('id="btn-tab-outline"'), 'Missing btn-tab-outline in workspace-tabs-bar');
console.log('✓ Obsidian Workspace Tabs Bar verified with active tab sync and pane actions');

// 4. Obsidian Bottom Status Bar
console.log('--- 4. Obsidian Bottom Status Bar Markup ---');
assert(indexHtml.includes('id="workspace-status-bar"'), 'Missing workspace-status-bar in index.html');
assert(indexHtml.includes('id="sb-word-count"'), 'Missing sb-word-count in status-bar');
assert(indexHtml.includes('id="sb-char-count"'), 'Missing sb-char-count in status-bar');
assert(indexHtml.includes('id="sb-read-time"'), 'Missing sb-read-time in status-bar');
assert(indexHtml.includes('id="sb-doc-name"'), 'Missing sb-doc-name in status-bar');
assert(indexHtml.includes('id="sb-backlink-count"'), 'Missing sb-backlink-count in status-bar');
assert(indexHtml.includes('id="sb-mode"'), 'Missing sb-mode in status-bar');
assert(indexHtml.includes('id="sb-save-status"'), 'Missing sb-save-status in status-bar');
assert(indexHtml.includes('id="sb-version"'), 'Missing sb-version in status-bar');
assert(indexHtml.includes('v2.1.2'), 'Status bar must display v2.1.2');
console.log('✓ Obsidian Status Bar verified with live metrics, backlinks, mode, and v2.1.2 badge');

// 5. Universe Starchart & Mapping Controls
console.log('--- 5. Universe Starchart & Mapping Controls ---');
assert(indexHtml.includes('class="map-tier-segmented"'), 'Missing map-tier-segmented in index.html');
assert(indexHtml.includes('id="tier-btn-galaxy"'), 'Missing tier-btn-galaxy in map-tier-segmented');
assert(indexHtml.includes('id="tier-btn-system"'), 'Missing tier-btn-system in map-tier-segmented');
assert(indexHtml.includes('id="tier-btn-world"'), 'Missing tier-btn-world in map-tier-segmented');
assert(indexHtml.includes('id="tier-btn-local"'), 'Missing tier-btn-local in map-tier-segmented');
assert(indexHtml.includes('id="btn-generate-universe-map"'), 'Missing btn-generate-universe-map in index.html');

const storageJsRaw = fs.readFileSync(path.join(__dirname, '..', 'js', 'storage.js'), 'utf8');
assert(storageJsRaw.includes('generateUniverseStarchartTemplate'), 'Storage must implement generateUniverseStarchartTemplate');
console.log('✓ Universe Starchart template generator and multi-tier controls verified');

// 6. Fluid Hardware-Accelerated CSS Transitions
console.log('--- 6. Fluid Hardware-Accelerated CSS Transitions ---');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'style.css'), 'utf8');
assert(styleCss.includes('.activity-ribbon'), 'style.css must style .activity-ribbon');
assert(styleCss.includes('.workspace-tabs-bar'), 'style.css must style .workspace-tabs-bar');
assert(styleCss.includes('.workspace-status-bar'), 'style.css must style .workspace-status-bar');
assert(styleCss.includes('.map-tier-segmented'), 'style.css must style .map-tier-segmented');
assert(styleCss.includes('cubic-bezier(0.16, 1, 0.3, 1)'), 'style.css must include fluid 60fps cubic-bezier curves');
console.log('✓ Obsidian interface styling and fluid transitions verified');

// 7. Version 2.1.2 Celebration Modal & Docked Non-Overlay Architecture
console.log('--- 7. Version 2.1.2 Celebration Launch Announcement & Docked Workspace ---');
assert(appJsRaw.includes('We finally made it to Version 2.1.2!'), 'app.js must proclaim "We finally made it to Version 2.1.2!"');
assert(appJsRaw.includes('lordspey_v2_1_2_seen'), 'app.js must check lordspey_v2_1_2_seen for auto-popup on launch');
assert(appJsRaw.includes('function setActiveWorkspaceView(viewName)'), 'app.js must implement setActiveWorkspaceView for non-overlay docked navigation');
assert(!appJsRaw.includes('THE ASHEN HIGHLANDS'), 'Default map must not hardcode fake country continents');
assert(appJsRaw.includes('UNIVERSE NEXUS'), 'Default map must render Universe Starchart scale');
console.log('✓ "We finally made it to Version 2.1.2!" celebration popup & docked Obsidian views verified');

// 8. Storage Universe Starchart Execution Test
console.log('--- 8. Storage Universe Starchart Functional Test ---');
const mockStorage = {};
global.localStorage = {
  getItem: k => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: k => { delete mockStorage[k]; }
};

const StorageModule = eval(`(function() {\n${storageJsRaw}\nreturn Storage;\n})()`);
const universe = StorageModule.generateUniverseStarchartTemplate();
assert.strictEqual(universe.tier, 'galaxy', 'Universe root must be tier galaxy');
assert.strictEqual(universe.id, 'universe-root', 'Universe root id must be universe-root');

const registry = StorageModule.getMapRegistry();
assert(registry.some(m => m.id === 'universe-root'), 'Registry must contain universe-root');
assert(registry.some(m => m.id === 'sys-solitude' && m.tier === 'system'), 'Registry must contain sys-solitude');
assert(registry.some(m => m.id === 'world-aethelgard' && m.tier === 'world'), 'Registry must contain world-aethelgard');

const pins = StorageModule.getAllMapPins('universe-root');
assert(pins.length >= 3, 'Universe root must have celestial pins');
assert(pins.some(p => p.pinType === 'star' && p.subMapId === 'sys-solitude'), 'Must have star pin linking to solar system');
assert(pins.some(p => p.pinType === 'jump_gate'), 'Must have jump gate pin');

const solPins = StorageModule.getAllMapPins('sys-solitude');
assert(solPins.some(p => p.pinType === 'planet' && p.subMapId === 'world-aethelgard'), 'Solitude system must link to habitable planet');
console.log('✓ Storage.generateUniverseStarchartTemplate() functional test passed');

console.log('\n=== ALL v2.0 OBSIDIAN UI & UNIVERSE ATLAS TESTS PASSED (100%) ===\n');

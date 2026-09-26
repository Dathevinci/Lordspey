const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== RUNNING LORD SPEY GITHUB PAGES & WEBSITE TEST SUITE ===\n');

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const docsIndexFile = path.join(docsDir, 'index.html');
const docsCssFile = path.join(docsDir, 'css', 'landing.css');
const docsAppIndexFile = path.join(docsDir, 'app', 'index.html');
const docsAppJsFile = path.join(docsDir, 'app', 'js', 'app.js');
const docsAppCssFile = path.join(docsDir, 'app', 'css', 'style.css');

// 1. Verify docs build script execution
console.log('--- 1. Testing build-pages.js Execution ---');
const buildOutput = execSync('node scripts/build-pages.js', { cwd: rootDir, encoding: 'utf8' });
assert(buildOutput.includes('Successfully synchronized'), 'build-pages.js must complete with success message');
console.log('✓ scripts/build-pages.js executed cleanly');

// 2. Verify Landing Page Markup & Structure
console.log('--- 2. Testing Landing Page Markup (docs/index.html) ---');
assert(fs.existsSync(docsIndexFile), 'docs/index.html must exist');
const landingHtml = fs.readFileSync(docsIndexFile, 'utf8');

assert(landingHtml.includes('<!DOCTYPE html>'), 'Missing doctype in docs/index.html');
assert(landingHtml.includes('<title>Lord Spey'), 'Missing title in docs/index.html');
assert(landingHtml.includes('css/landing.css'), 'Missing stylesheet link in docs/index.html');
assert(landingHtml.includes('assets/logo.png'), 'Missing logo link in docs/index.html');
assert(landingHtml.includes('assets/icon.png'), 'Missing favicon link in docs/index.html');

// Navigation & Brand
assert(landingHtml.includes('LORD SPEY'), 'Brand name must be present in navbar');
assert(landingHtml.includes('href="app/"'), 'Launch Web App link must point to app/');

// Hero Section
assert(landingHtml.includes('hero-section'), 'Hero section must exist');
assert(landingHtml.includes('v1.2.0 Released') || landingHtml.includes('v1.2.0'), 'Hero must mention version 1.2.0');
assert(landingHtml.includes('The Distraction-Free Studio'), 'Hero headline must be present');

// Features
assert(landingHtml.includes('id="features"'), 'Features section must exist');
assert(landingHtml.includes('Distraction-Free Manuscript Canvas'), 'Manuscript feature card missing');
assert(landingHtml.includes('Interactive World Cartography'), 'Cartography feature card missing');
assert(landingHtml.includes('Entity Codex &amp; Dossiers') || landingHtml.includes('Entity Codex & Dossiers'), 'Codex feature card missing');
assert(landingHtml.includes('Chronicle Timeline Plotter'), 'Timeline feature card missing');
assert(landingHtml.includes('Cosmos Lore Graph'), 'Cosmos graph feature card missing');
assert(landingHtml.includes('Sovereign Data &amp; Protection') || landingHtml.includes('Sovereign Data & Protection'), 'Privacy feature card missing');

// Map Studio Spotlight
assert(landingHtml.includes('id="map-studio"'), 'Map studio spotlight section missing');
assert(landingHtml.includes('Custom Pixel Sizing'), 'Map studio sizing bullet missing');
assert(landingHtml.includes('Artistic Cartography Tools'), 'Map studio tools bullet missing');

// Downloads Matrix
assert(landingHtml.includes('id="downloads"'), 'Downloads section must exist');
assert(landingHtml.includes('Lord%20Spey%20Setup%201.2.0.exe'), 'Missing Windows installer download link for v1.2.0');
assert(landingHtml.includes('Lord%20Spey%201.2.0.exe'), 'Missing Windows portable download link for v1.2.0');
assert(landingHtml.includes('Lord.Spey.apk'), 'Missing Android APK download link');
assert(landingHtml.includes('app-debug.apk'), 'Missing Android debug APK download link');

console.log('✓ Landing page markup, brand assets, feature sections, and release download links verified');

// 3. Verify Landing Page CSS
console.log('--- 3. Testing Landing Page CSS (docs/css/landing.css) ---');
assert(fs.existsSync(docsCssFile), 'docs/css/landing.css must exist');
const landingCss = fs.readFileSync(docsCssFile, 'utf8');

assert(landingCss.includes('--bg-base: #0c0e12'), 'Base background must be configured to matte obsidian');
assert(landingCss.includes('.hero-section'), '.hero-section selector missing');
assert(landingCss.includes('.features-grid'), '.features-grid selector missing');
assert(landingCss.includes('.spotlight-card'), '.spotlight-card selector missing');
assert(landingCss.includes('.download-card'), '.download-card selector missing');
assert(landingCss.includes('@media (max-width:'), 'Responsive media queries must exist');
console.log('✓ Landing page CSS verified with minimalist palette and responsive rules');

// 4. Verify Embedded Web Application in docs/app
console.log('--- 4. Testing Embedded Web App (docs/app) ---');
assert(fs.existsSync(docsAppIndexFile), 'docs/app/index.html must exist');
assert(fs.existsSync(docsAppJsFile), 'docs/app/js/app.js must exist');
assert(fs.existsSync(docsAppCssFile), 'docs/app/css/style.css must exist');

const appHtml = fs.readFileSync(docsAppIndexFile, 'utf8');
assert(appHtml.includes('v1.2.0'), 'docs/app/index.html must be updated to v1.2.0');
assert(appHtml.includes('id="sidebar"'), 'docs/app/index.html must contain full app DOM');
assert(appHtml.includes('id="editor-area"'), 'docs/app/index.html must contain editor area');
assert(appHtml.includes('id="map-modal"'), 'docs/app/index.html must contain map studio modal');

const appJs = fs.readFileSync(docsAppJsFile, 'utf8');
assert(appJs.includes("const APP_VERSION = '1.2.0'"), 'docs/app/js/app.js must reflect APP_VERSION 1.2.0');
console.log('✓ docs/app contains the full, functional, standalone Lord Spey web application');

// 5. Verify Brand Assets Copied to docs/assets
console.log('--- 5. Testing Shared Brand Assets in docs/assets ---');
const requiredBrandAssets = ['logo.png', 'icon.png', 'icon.ico', 'favicon.ico'];
requiredBrandAssets.forEach(asset => {
  const assetPath = path.join(docsDir, 'assets', asset);
  assert(fs.existsSync(assetPath), `Missing brand asset: docs/assets/${asset}`);
  const stat = fs.statSync(assetPath);
  assert(stat.size > 500, `Asset docs/assets/${asset} is unexpectedly small (${stat.size} bytes)`);
});
console.log('✓ All brand assets exist in docs/assets/ with valid byte sizes');

console.log('\n=== ALL GITHUB PAGES & WEBSITE TESTS PASSED (100%) ===\n');

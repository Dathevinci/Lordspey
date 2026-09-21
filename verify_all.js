const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== RUNNING LORD SPEY VERIFICATION ===\n');

// 1. Verify files exist
const files = [
  'index.html',
  'css/style.css',
  'js/markdown.js',
  'js/storage.js',
  'js/app.js',
];

for (const f of files) {
  const p = path.join(__dirname, f);
  assert(fs.existsSync(p), `Missing file: ${f}`);
  const stat = fs.statSync(p);
  assert(stat.size > 0, `Empty file: ${f}`);
  console.log(`✓ File verified: ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
}

// 2. Test Markdown rendering & Wiki-links
const Markdown = require('./js/markdown.js');
const mdSample = `# Chapter 1
Testing wiki link [[Lore of Magic|Arcana]] and task:
- [x] Finished setup
- [ ] Write first draft
`;
const rendered = Markdown.render(mdSample);
assert(rendered.includes('data-wiki="Lore of Magic"'), 'Wiki target failed');
assert(rendered.includes('>Arcana</a>'), 'Wiki alias failed');
assert(rendered.includes('task-checkbox'), 'Task checkbox failed');
console.log('✓ Markdown & Wiki-links verified');

// 3. Test Storage clean state
const mockLocalStorage = {};
global.localStorage = {
  getItem: k => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

const storageCode = fs.readFileSync(path.join(__dirname, 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);

// Confirm clean slate: by default 0 notes exist!
const initialNotes = Storage.getAllNotes();
assert.strictEqual(initialNotes.length, 0, 'Expected 0 initial notes for a clean slate');
console.log('✓ Clean vault verified: starts with 0 notes (no forced pre-written mock text)');

// Test creating a note
const created = Storage.createNote({ title: 'My Novel Opening', category: 'chapter' });
assert.strictEqual(created.title, 'My Novel Opening');
assert.strictEqual(Storage.getAllNotes().length, 1);
console.log('✓ Note creation verified');

// 4. Verify index.html contains Lord Spey branding, clean Main Menu, & Tutorial
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert(htmlContent.includes('Lord Spey'), 'Lord Spey branding missing in index.html');
assert(htmlContent.includes('LORD SPEY'), 'Lord Spey title missing in main menu');
assert(htmlContent.includes('id="main-menu"'), 'Missing #main-menu in index.html');
assert(htmlContent.includes('id="logo-home"'), 'Missing #logo-home in index.html');
assert(htmlContent.includes('id="btn-back-menu"'), 'Missing #btn-back-menu in index.html');

// Clean Brand Header & Views Dock assertions
assert(htmlContent.includes('sidebar-header'), 'Missing .sidebar-header in index.html');
assert(htmlContent.includes('sidebar-tools-dock'), 'Missing .sidebar-tools-dock in index.html');
assert(htmlContent.includes('sidebar-collapse-btn'), 'Missing .sidebar-collapse-btn in index.html');

// Verify tool buttons are moved out of the logo line into the dedicated dock
const headerEnd = htmlContent.indexOf('</div>', htmlContent.indexOf('class="sidebar-header"'));
const headerSnippet = htmlContent.slice(htmlContent.indexOf('class="sidebar-header"'), headerEnd);
assert(headerSnippet.includes('id="logo-home"'), 'Logo must be in sidebar-header');
assert(headerSnippet.includes('id="sidebar-toggle"'), 'Collapse toggle must be in sidebar-header');
assert(!headerSnippet.includes('id="btn-graph-view"'), 'Graph view button must not be crammed into sidebar-header');
assert(!headerSnippet.includes('id="btn-map-view"'), 'Map view button must not be crammed into sidebar-header');
assert(!headerSnippet.includes('id="btn-timeline-view"'), 'Timeline view button must not be crammed into sidebar-header');
assert(!headerSnippet.includes('id="btn-codex-view"'), 'Codex view button must not be crammed into sidebar-header');

// Verify dedicated dock has all 6 tool buttons
const dockSection = htmlContent.slice(htmlContent.indexOf('class="sidebar-tools-dock"'), htmlContent.indexOf('class="sidebar-nav"'));
assert(dockSection.includes('id="btn-graph-view"'), 'Missing btn-graph-view in sidebar-tools-dock');
assert(dockSection.includes('id="btn-map-view"'), 'Missing btn-map-view in sidebar-tools-dock');
assert(dockSection.includes('id="btn-timeline-view"'), 'Missing btn-timeline-view in sidebar-tools-dock');
assert(dockSection.includes('id="btn-codex-view"'), 'Missing btn-codex-view in sidebar-tools-dock');
assert(dockSection.includes('id="btn-quick-switcher"'), 'Missing btn-quick-switcher in sidebar-tools-dock');
assert(dockSection.includes('id="btn-tutorial-sidebar"'), 'Missing btn-tutorial-sidebar in sidebar-tools-dock');

// Strict uniqueness of sidebar search & no duplicate search inputs
const searchInputMatches = htmlContent.match(/id="search-input"/g) || [];
assert.strictEqual(searchInputMatches.length, 1, `There must be exactly one #search-input in index.html (found ${searchInputMatches.length})`);
const sidebarSearchMatches = htmlContent.match(/class="sidebar-search"/g) || [];
assert.strictEqual(sidebarSearchMatches.length, 1, `There must be exactly one .sidebar-search in index.html (found ${sidebarSearchMatches.length})`);
assert(!dockSection.includes('class="sidebar-search"'), 'Duplicate .sidebar-search must not exist inside or below dock');

// Tutorial assertions
assert(htmlContent.includes('id="tutorial-overlay"'), 'Missing #tutorial-overlay in index.html');
assert(htmlContent.includes('id="btn-tutorial-sidebar"'), 'Missing #btn-tutorial-sidebar in index.html');
assert(htmlContent.includes('id="menu-btn-tutorial"'), 'Missing #menu-btn-tutorial in index.html');
assert(htmlContent.includes('id="btn-tutorial-next"'), 'Missing #btn-tutorial-next in index.html');
assert(htmlContent.includes('id="btn-tutorial-prev"'), 'Missing #btn-tutorial-prev in index.html');
assert(htmlContent.includes('id="btn-tutorial-skip"'), 'Missing #btn-tutorial-skip in index.html');
assert(htmlContent.includes('id="menu-btn-chapter"'), 'Missing #menu-btn-chapter in index.html');
assert(htmlContent.includes('id="menu-btn-lore"'), 'Missing #menu-btn-lore in index.html');
assert(htmlContent.includes('id="menu-btn-world"'), 'Missing #menu-btn-world in index.html');
assert(htmlContent.includes('id="menu-btn-draft"'), 'Missing #menu-btn-draft in index.html');
assert(htmlContent.includes('class="map-zoom-cluster"'), 'Missing .map-zoom-cluster in index.html');
console.log('✓ Clean Brand Header, Views & Tools dock, & Interactive Tutorial markup verified in index.html');

// 5. Verify Cinematic Crimson Star Intro / Splash screen markup, styles, & controller
assert(htmlContent.includes('id="intro-splash"'), 'Missing #intro-splash in index.html');
assert(htmlContent.includes('id="intro-skip-btn"'), 'Missing #intro-skip-btn in index.html');
assert(htmlContent.includes('id="menu-emblem"'), 'Missing #menu-emblem in index.html');
assert(htmlContent.includes('class="intro-star-graphic"'), 'Missing intro star SVG graphic in index.html');
assert(htmlContent.includes('class="intro-star-rotator"'), 'Missing intro-star-rotator in index.html');

const introSplashSection = htmlContent.slice(htmlContent.indexOf('id="intro-splash"'), htmlContent.indexOf('id="toast-container"'));
assert(!introSplashSection.includes('intro-title'), 'Intro splash must not contain intro-title');
assert(!introSplashSection.includes('intro-branding'), 'Intro splash must not contain intro-branding');
assert(!introSplashSection.includes('LORD SPEY'), 'Intro splash must not contain text title LORD SPEY');

const cssContent = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8');
assert(cssContent.includes('.sidebar-tools-dock'), 'Missing .sidebar-tools-dock in css/style.css');
assert(cssContent.includes('.tool-dock-btn'), 'Missing .tool-dock-btn in css/style.css');
assert(cssContent.includes('.tool-dock-btn[data-tooltip]::before'), 'Missing micro-tooltip ::before in css/style.css');
assert(cssContent.includes('.tools-dock-group:first-child .tool-dock-btn:first-child[data-tooltip]::before'), 'Missing first-child tooltip safety alignment in css/style.css');
assert(cssContent.includes('.tools-dock-group:last-child .tool-dock-btn:last-child[data-tooltip]::before'), 'Missing last-child tooltip safety alignment in css/style.css');
assert(cssContent.includes('@media (hover: none)'), 'Missing touch hover:none tooltip suppression in css/style.css');
assert(cssContent.includes('.intro-splash'), 'Missing .intro-splash in css/style.css');
assert(cssContent.includes('introStarPop'), 'Missing @keyframes introStarPop in css/style.css');
assert(cssContent.includes('introStarBreathe'), 'Missing @keyframes introStarBreathe in css/style.css');
assert(cssContent.includes('introStarRotate'), 'Missing @keyframes introStarRotate in css/style.css');
assert(cssContent.includes('introFlareGlint'), 'Missing @keyframes introFlareGlint in css/style.css');
assert(cssContent.includes('introHaloBloom'), 'Missing @keyframes introHaloBloom in css/style.css');
assert(!cssContent.includes('introTitleReveal'), 'Stale introTitleReveal keyframe must not exist in css/style.css');
assert(!cssContent.includes('introGemBloom'), 'Stale introGemBloom keyframe must not exist in css/style.css');
assert(!cssContent.includes('filter: blur(2px)'), 'Harsh full-screen GPU blur penalty detected in intro-fade-out');

const jsContent = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
assert(jsContent.includes('dismissIntroSplash'), 'Missing dismissIntroSplash in js/app.js');
assert(jsContent.includes('playIntroSplash'), 'Missing playIntroSplash in js/app.js');
assert(jsContent.includes('dismissTimer'), 'Missing dismissTimer tracking to prevent leaking dismissal in js/app.js');
assert(jsContent.includes('intro-animating'), 'Missing intro-animating animation reset class in js/app.js');
assert(jsContent.includes('isInitialTutorialHandled'), 'Missing isInitialTutorialHandled to prevent spurious tutorial launch on replay in js/app.js');
assert(jsContent.includes('introSplash.classList'), 'Missing introSplash classList handling in js/app.js');
console.log('✓ Cinematic Crimson Star Intro markup, animations, & controller verified');

// 6. Un-slop verification: ensure no AI purple prose or gimmicky forge exists
assert(!htmlContent.includes('btn-name-forge'), 'Sloppy Name Forge button still in index.html');
assert(!htmlContent.includes('id="forge-modal"'), 'Sloppy Forge modal still in index.html');
assert(!htmlContent.includes('bend spacetime'), 'Sloppy "bend spacetime" still in index.html');
assert(!htmlContent.includes('ancient oaths'), 'Sloppy "ancient oaths" still in index.html');
assert(!htmlContent.includes('Supernovae'), 'Sloppy "Supernovae" still in index.html');
assert(!htmlContent.includes('celestial bodies'), 'Sloppy "celestial bodies" still in index.html');
console.log('✓ Un-slop verified: 0 cheesy purple-prose or gimmick features found');

console.log('\n=== ALL VERIFICATIONS PASSED WITH 100% SUCCESS ===');

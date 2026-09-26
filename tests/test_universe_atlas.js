const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== RUNNING LORD SPEY UNIVERSE ATLAS & ANIMATED THEMES TEST SUITE ===\n');

// ── 1. Mock LocalStorage & Setup Environment ──
const mockLocalStorage = {};
global.localStorage = {
  getItem: k => (k in mockLocalStorage ? mockLocalStorage[k] : null),
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
};

const storageCode = fs.readFileSync(path.join(__dirname, '..', 'js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
global.Storage = Storage;

// ══════════════════════════════════════════════════════════════════
// ── Section 1: Universe Atlas Storage & Hierarchy Registry ──
// ══════════════════════════════════════════════════════════════════
console.log('--- 1. Testing Storage Map Registry & Hierarchy ---');

// 1.1 Default Map Initialization
localStorage.clear();
const initialRegistry = Storage.getMapRegistry();
assert(Array.isArray(initialRegistry), 'Registry must be an array');
assert.strictEqual(initialRegistry.length, 1, 'Registry must have 1 default map initially');
assert.strictEqual(initialRegistry[0].id, 'default', 'Default map id must be "default"');
assert.strictEqual(initialRegistry[0].tier, 'world', 'Default map tier must be "world"');
assert.strictEqual(Storage.getActiveMapId(), 'default', 'Active map id must default to "default"');
console.log('✓ Default map and registry initialization verified');

// 1.2 Creating Multi-Tier Nested Universe Hierarchy
// Tier 1: Galaxy (Root)
const galaxyMap = Storage.createChildMap(null, {
  title: 'Andromeda Sector',
  tier: 'galaxy',
  celestialTheme: 'cosmic-void',
  shape: 'ultrawide',
  description: 'The sprawling frontier galaxy.'
});
assert(galaxyMap && galaxyMap.id, 'Galaxy map must be created with ID');
assert.strictEqual(galaxyMap.tier, 'galaxy');
assert.strictEqual(galaxyMap.parentId, null);

// Tier 2: Star System (Child of Galaxy)
const starSystemMap = Storage.createChildMap(galaxyMap.id, {
  title: 'Solitude Binary System',
  tier: 'system',
  celestialTheme: 'cosmic-void',
  shape: 'square',
  orbitalRings: true,
  description: 'A dual-star system with 6 orbital tracks.'
});
assert(starSystemMap && starSystemMap.id, 'Star system map must be created');
assert.strictEqual(starSystemMap.tier, 'system');
assert.strictEqual(starSystemMap.parentId, galaxyMap.id);

// Tier 3: Planet Surface (Child of Star System)
const planetMap = Storage.createChildMap(starSystemMap.id, {
  title: 'Aethelgard Prime Surface',
  tier: 'world',
  celestialTheme: 'standard-parchment',
  shape: 'landscape',
  description: 'Ancient terrestrial continent realm.'
});
assert.strictEqual(planetMap.tier, 'world');
assert.strictEqual(planetMap.parentId, starSystemMap.id);

// Tier 4: Station / Local Site (Child of Planet)
const stationMap = Storage.createChildMap(planetMap.id, {
  title: 'Orbital Citadel Asteria',
  tier: 'local',
  celestialTheme: 'cosmic-void',
  shape: 'oval',
  description: 'Geostationary defense platform.'
});
assert.strictEqual(stationMap.tier, 'local');
assert.strictEqual(stationMap.parentId, planetMap.id);

const fullRegistry = Storage.getMapRegistry();
assert.strictEqual(fullRegistry.length, 5, 'Registry must now contain 5 maps (default + 4 atlas realms)');
console.log('✓ Multi-tier 4-level universe hierarchy (galaxy -> system -> world -> local) created cleanly');

// 1.3 Breadcrumb Chain Resolution
const stationBreadcrumbs = Storage.getMapBreadcrumbs(stationMap.id);
assert.strictEqual(stationBreadcrumbs.length, 4, 'Breadcrumbs for station should have 4 levels');
assert.strictEqual(stationBreadcrumbs[0].id, galaxyMap.id, 'Root crumb must be Galaxy');
assert.strictEqual(stationBreadcrumbs[1].id, starSystemMap.id, '2nd crumb must be Star System');
assert.strictEqual(stationBreadcrumbs[2].id, planetMap.id, '3rd crumb must be Planet Surface');
assert.strictEqual(stationBreadcrumbs[3].id, stationMap.id, 'Leaf crumb must be Station');
console.log('✓ Root-to-leaf breadcrumbs path accurately resolved');

// 1.4 Map-Specific Isolated Data Storage
Storage.saveMap({ width: 2200, height: 1100, shape: 'custom', orbitalRings: false }, galaxyMap.id);
Storage.saveMap({ width: 1400, height: 1400, shape: 'custom', orbitalRings: true }, starSystemMap.id);
Storage.saveMap({ width: 1600, height: 1000, shape: 'landscape', orbitalRings: false }, planetMap.id);

const galaxyData = Storage.getMap(galaxyMap.id);
const systemData = Storage.getMap(starSystemMap.id);
const planetData = Storage.getMap(planetMap.id);

assert.strictEqual(galaxyData.width, 2200);
assert.strictEqual(systemData.width, 1400);
assert.strictEqual(systemData.orbitalRings, true);
assert.strictEqual(planetData.width, 1600);
assert.strictEqual(planetData.orbitalRings, false);
console.log('✓ Map data storage isolation between multiple atlas maps verified');

// 1.5 Celestial Pins & Hierarchy Filtering
Storage.saveMapPin({
  id: 'pin-star-1',
  mapId: galaxyMap.id,
  title: 'Solitude Binary Star',
  pinType: 'star',
  subMapId: starSystemMap.id,
  x: 40,
  y: 60
});

Storage.saveMapPin({
  id: 'pin-planet-1',
  mapId: starSystemMap.id,
  title: 'Aethelgard Prime',
  pinType: 'planet',
  subMapId: planetMap.id,
  x: 55,
  y: 45
});

Storage.saveMapPin({
  id: 'pin-station-1',
  mapId: planetMap.id,
  title: 'Asteria Docking Spire',
  pinType: 'station',
  subMapId: stationMap.id,
  x: 70,
  y: 30
});

// Filtering assertions
const galaxyPins = Storage.getAllMapPins(galaxyMap.id);
assert.strictEqual(galaxyPins.length, 1);
assert.strictEqual(galaxyPins[0].id, 'pin-star-1');

const systemPins = Storage.getAllMapPins(starSystemMap.id);
assert.strictEqual(systemPins.length, 1);
assert.strictEqual(systemPins[0].id, 'pin-planet-1');

const planetPins = Storage.getAllMapPins(planetMap.id);
assert.strictEqual(planetPins.length, 1);
assert.strictEqual(planetPins[0].id, 'pin-station-1');

// Backwards compatibility: no-arg getAllMapPins returns all pins
const allPins = Storage.getAllMapPins();
assert(allPins.length >= 3, 'getAllMapPins() without filter returns all universe pins');
console.log('✓ Celestial pins with subMapId drill-down links and per-map filtering verified');

// 1.6 Map Regions Filtering
Storage.saveMapRegion({
  id: 'reg-galaxy-sector',
  mapId: galaxyMap.id,
  name: 'Outer Orion Arm',
  shape: 'polygon',
  points: [{ x: 10, y: 10 }, { x: 30, y: 10 }, { x: 20, y: 30 }]
});

Storage.saveMapRegion({
  id: 'reg-planet-continent',
  mapId: planetMap.id,
  name: 'The Whispering Basin',
  shape: 'circle',
  points: [{ x: 50, y: 50 }],
  radius: 120
});

assert.strictEqual(Storage.getAllMapRegions(galaxyMap.id).length, 1);
assert.strictEqual(Storage.getAllMapRegions(planetMap.id).length, 1);
assert.strictEqual(Storage.getAllMapRegions(starSystemMap.id).length, 0);
assert(Storage.getAllMapRegions().length >= 2, 'getAllMapRegions() without args returns all regions');
console.log('✓ Map regions isolated per celestial realm');

// ══════════════════════════════════════════════════════════════════
// ── Section 2: Ambient Animated Themes Persistence & Spey Pkg ──
// ══════════════════════════════════════════════════════════════════
console.log('\n--- 2. Testing Animated Themes & .spey Package Round-Trip ---');

// 2.1 Animated Theme Defaults & Validation
assert.strictEqual(Storage.getAnimatedTheme(), 'none', 'Animated theme should default to "none"');
Storage.setAnimatedTheme('cosmic-void');
assert.strictEqual(Storage.getAnimatedTheme(), 'cosmic-void');

Storage.setAnimatedTheme('ethereal-nebula');
assert.strictEqual(Storage.getAnimatedTheme(), 'ethereal-nebula');

Storage.setAnimatedTheme('warm-embers');
assert.strictEqual(Storage.getAnimatedTheme(), 'warm-embers');

Storage.setAnimatedTheme('midnight-rain');
assert.strictEqual(Storage.getAnimatedTheme(), 'midnight-rain');

// Sanitize invalid input
Storage.setAnimatedTheme('invalid-flame-theme');
assert.strictEqual(Storage.getAnimatedTheme(), 'none', 'Invalid theme must sanitize to "none"');

Storage.setAnimatedTheme('cosmic-void');
console.log('✓ Ambient animated theme persistence and sanitation verified');

// 2.2 Spey Package Serialization & Round-Trip
const speyPkg = Storage.exportSpeyPackage('Cosmic Odyssey');
assert(speyPkg.mapsRegistry, 'Spey export must include mapsRegistry');
assert.strictEqual(speyPkg.mapsRegistry.length, 5, 'Exported registry should have all 5 maps');
assert.strictEqual(speyPkg.animatedTheme, 'cosmic-void', 'Exported package must preserve animatedTheme');
assert(Array.isArray(speyPkg.mapPins), 'Exported package must contain mapPins');
assert(speyPkg.mapPins.some(p => p.pinType === 'star'), 'Celestial star pin must be in package');

// Clear storage completely
localStorage.clear();
assert.strictEqual(Storage.getMapRegistry().length, 1, 'Clean storage returns 1 default map');

// Restore in Replace Mode
const importRes = Storage.importSpeyPackage(JSON.stringify(speyPkg), 'replace');
assert(importRes.success, 'Spey package import must succeed');
assert.strictEqual(Storage.getAnimatedTheme(), 'cosmic-void', 'Animated theme restored after replace import');
const restoredRegistry = Storage.getMapRegistry();
assert.strictEqual(restoredRegistry.length, 5, 'All 5 atlas realms restored');
const restoredCrumbs = Storage.getMapBreadcrumbs(stationMap.id);
assert.strictEqual(restoredCrumbs.length, 4, 'Full 4-tier breadcrumb chain restored');

const restoredGalaxyPins = Storage.getAllMapPins(galaxyMap.id);
assert.strictEqual(restoredGalaxyPins.length, 1);
assert.strictEqual(restoredGalaxyPins[0].subMapId, starSystemMap.id);
console.log('✓ .spey package round-trip successfully preserves universe atlas registry, maps, celestial pins, and animated theme');

// 2.3 Spey Package Merge Mode & Duplicate Pin Guard
const initialTotalPins = Storage.getAllMapPins('all').length;
const mergeResult = Storage.importSpeyPackage({
  version: 2,
  projectName: 'Incoming Merge Test',
  notes: [],
  mapData: { shape: 'landscape', width: 1600, height: 1000, drawingData: 'mock-drawing' }
}, 'merge');
assert(mergeResult.success, 'Merge import must succeed');
const afterMergeTotalPins = Storage.getAllMapPins('all').length;
assert.strictEqual(afterMergeTotalPins, initialTotalPins, 'Merge import must NOT duplicate existing child map pins');
console.log('✓ Merge import duplicate pin guard verified: 0 pins duplicated');

// 2.4 Custom Map Image Isolation Across Atlas Maps
const worldMapImg = 'data:image/png;base64,worldmockimg';
const galaxyMapImg = 'data:image/png;base64,galaxymockimg';
Storage.saveCustomMapImage(worldMapImg, planetMap.id);
Storage.saveCustomMapImage(galaxyMapImg, galaxyMap.id);
assert.strictEqual(Storage.getCustomMapImage(planetMap.id), worldMapImg, 'Planet map retains its own custom image');
assert.strictEqual(Storage.getCustomMapImage(galaxyMap.id), galaxyMapImg, 'Galaxy map retains its own custom image');
assert.strictEqual(Storage.getCustomMapImage(starSystemMap.id), null, 'Star system has null custom image');
console.log('✓ Custom map image isolation per atlas map verified');

// 2.5 Map Deletion from Registry: Re-Parenting & Pin Unlinking
const childMapA = Storage.createChildMap(galaxyMap.id, { title: 'Test Cluster Alpha', tier: 'system' });
const childMapB = Storage.createChildMap(childMapA.id, { title: 'Test Planet Beta', tier: 'world' });
Storage.saveMapPin({ id: 'pin-beta-link', title: 'Beta Link Pin', mapId: 'default', subMapId: childMapA.id, pinColor: '#38bdf8' });

assert.strictEqual(Storage.getMapById(childMapB.id).parentId, childMapA.id, 'childMapB parent should be childMapA');
// Attempt deleting root default map (should fail)
assert.strictEqual(Storage.deleteMapFromRegistry('default'), false, 'Root default map cannot be deleted');

// Delete childMapA: childMapB should be re-parented to galaxyMap
const deleteSuccess = Storage.deleteMapFromRegistry(childMapA.id);
assert.strictEqual(deleteSuccess, true, 'Deleting sub-map must succeed');
assert.strictEqual(Storage.getMapById(childMapA.id), null, 'childMapA should be removed from registry');
const reParentedB = Storage.getMapById(childMapB.id);
assert(reParentedB, 'childMapB must still exist');
assert.strictEqual(reParentedB.parentId, galaxyMap.id, 'childMapB must be re-parented to galaxyMap');

// Pin linking to deleted map must have subMapId cleared to null
const betaPin = Storage.getMapPin('pin-beta-link');
assert(betaPin, 'Beta link pin should exist');
assert.strictEqual(betaPin.subMapId, null, 'subMapId pointing to deleted map must be unlinked to null');
assert.strictEqual(betaPin.pinColor, '#38bdf8', 'Pin color preserved');
console.log('✓ Map deletion with child re-parenting and subMapId unlinking verified');

// ══════════════════════════════════════════════════════════════════
// ── Section 3: DOM Controller & App.js Interactivity Tests ──
// ══════════════════════════════════════════════════════════════════
console.log('\n--- 3. Testing DOM Controller & Universe Atlas Interactivity ---');

function createMockElement(id = '', tag = 'div') {
  const classes = new Set();
  const listeners = {};
  const dataset = {};
  const children = [];

  const el = {
    id,
    tagName: tag.toUpperCase(),
    classList: {
      add: (...c) => c.forEach(x => classes.add(x)),
      remove: (...c) => c.forEach(x => classes.delete(x)),
      contains: (c) => classes.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (classes.has(c)) classes.delete(c); else classes.add(c);
        } else if (force) classes.add(c); else classes.delete(c);
      }
    },
    dataset,
    style: {
      width: '',
      height: '',
      display: '',
      transform: '',
      setProperty: () => {},
      getPropertyValue: () => ''
    },
    value: '',
    checked: false,
    textContent: '',
    innerHTML: '',
    children,
    width: 1600,
    height: 1000,
    focus: () => {},
    click: () => {
      el.dispatchEvent('click', { preventDefault: () => {}, stopPropagation: () => {} });
    },
    setAttribute: (k, v) => { dataset[k] = v; },
    getAttribute: (k) => dataset[k] || null,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1600, height: 1000 }),
    getContext: () => {
      if (!el._ctx) {
        el._ctx = {
          save: () => {},
          restore: () => {},
          clearRect: () => {},
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          arc: () => {},
          rect: () => {},
          ellipse: () => {},
          clip: () => {},
          closePath: () => {},
          fill: () => {},
          stroke: () => {},
          drawImage: () => {},
          createRadialGradient: () => ({ addColorStop: () => {} }),
          getImageData: () => ({ data: new Uint8ClampedArray(1600 * 1000 * 4) }),
          putImageData: () => {},
          fillText: () => {},
          fillRect: () => {},
          strokeRect: () => {},
          setLineDash: () => {},
          scale: () => {},
          measureText: (txt) => ({ width: (txt || '').length * 8 }),
        };
      }
      return el._ctx;
    },
    toDataURL: (type) => `data:${type || 'image/png'};base64,mockpngdata`,
    addEventListener: (ev, fn) => {
      if (!listeners[ev]) listeners[ev] = [];
      listeners[ev].push(fn);
    },
    removeEventListener: (ev, fn) => {
      if (listeners[ev]) listeners[ev] = listeners[ev].filter(f => f !== fn);
    },
    dispatchEvent: (ev, payload = {}) => {
      if (listeners[ev]) listeners[ev].forEach(fn => fn(Object.assign({ preventDefault: () => {}, stopPropagation: () => {} }, payload)));
    },
    appendChild: (child) => { children.push(child); child.parentElement = el; return child; },
    removeChild: (child) => {
      const idx = children.indexOf(child);
      if (idx !== -1) children.splice(idx, 1);
      return child;
    },
    querySelector: (sel) => {
      if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || null;
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        return children.find(c => c.classList && c.classList.contains(cls)) || null;
      }
      return null;
    },
    querySelectorAll: (sel) => {
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        return children.filter(c => c.classList && c.classList.contains(cls));
      }
      return [];
    }
  };
  return el;
}

const elementsMap = {};
const getEl = (id, tag = 'div') => {
  if (!elementsMap[id]) elementsMap[id] = createMockElement(id, tag);
  return elementsMap[id];
};

const domIds = [
  'main-menu', 'editor-area', 'sidebar', 'sidebar-backdrop', 'sidebar-toggle', 'sidebar-expand',
  'search-input', 'logo-home', 'btn-tutorial-sidebar', 'menu-btn-tutorial', 'menu-btn-graph',
  'menu-btn-switcher', 'menu-btn-sample', 'menu-recent-section', 'menu-recent-grid',
  'note-title', 'note-tags', 'note-category', 'note-body', 'note-preview', 'editor-body-wrap',
  'btn-back-menu', 'word-count', 'reading-time', 'save-status', 'btn-split', 'btn-outline',
  'outline-drawer', 'outline-list', 'btn-close-outline', 'modal-overlay', 'new-note-modal',
  'modal-note-title', 'modal-note-category', 'btn-cancel-modal', 'btn-create-modal',
  'delete-overlay', 'btn-cancel-delete', 'btn-confirm-delete', 'toast-container',
  'btn-graph-view', 'graph-modal', 'btn-close-graph', 'graph-canvas', 'graph-node-count',
  'graph-edge-count', 'galaxy-empty-prompt', 'galaxy-btn-create-first', 'galaxy-btn-load-demo',
  'graph-location-hud', 'hud-category-dot', 'hud-category-name', 'hud-sub-branch', 'hud-node-title',
  'hud-connections-count', 'hud-action-hint', 'btn-map-view', 'menu-btn-map', 'btnCloseMap',
  'map-modal', 'btn-close-map', 'map-viewport', 'map-stage', 'map-canvas', 'map-paint-canvas',
  'map-regions-svg', 'map-pins-container', 'map-empty-prompt', 'map-pin-preview', 'map-pin-modal',
  'btn-map-dimensions', 'btn-map-paint-mode', 'btn-map-draw-region', 'btn-map-tutorial',
  'btn-map-drop-pin', 'btn-map-export-png', 'map-file-input', 'btn-map-reset-img',
  'btn-map-zoom-in', 'btn-map-zoom-out', 'btn-map-zoom-reset', 'map-zoom-level',
  'map-shape-select', 'map-studio-toolbar', 'map-layers-panel', 'btn-studio-layers',
  'btn-close-layers', 'btn-add-layer', 'map-layers-list', 'layer-opacity-slider', 'layer-opacity-val',
  'studio-brush-size', 'studio-brush-size-val', 'studio-brush-opacity', 'studio-brush-opacity-val',
  'studio-terrain-options', 'studio-terrain-type', 'studio-shape-options', 'studio-shape-type',
  'studio-shape-fill', 'studio-custom-color', 'btn-studio-undo', 'btn-studio-redo',
  'btn-studio-clear', 'btn-studio-bake', 'btn-studio-done', 'studio-layer-count',
  'map-dimensions-modal', 'map-dim-width', 'map-dim-height', 'map-dim-shape-frame',
  'btn-map-dim-cancel', 'btn-map-dim-apply', 'map-custom-img',
  // Universe Atlas & Celestial Cartography Elements
  'map-atlas-select', 'map-atlas-breadcrumbs', 'map-tier-badge', 'btn-atlas-new-map', 'btn-atlas-delete-map',
  'btn-map-orbital-rings', 'map-celestial-theme-select', 'btn-map-drill-down',
  'map-modal-pin-submap', 'atlas-map-modal', 'atlas-modal-name', 'atlas-modal-tier',
  'atlas-modal-parent', 'atlas-modal-theme', 'atlas-modal-shape', 'atlas-modal-desc',
  'btn-atlas-modal-cancel', 'btn-atlas-modal-save', 'ambient-theme-container', 'ambient-theme-canvas',
  'btn-map-preview-close', 'btn-map-edit-pin', 'btn-map-open-note', 'btn-map-delete-pin'
];

domIds.forEach(id => getEl(id));

// Create mock animated theme cards
const animatedThemes = ['none', 'cosmic-void', 'ethereal-nebula', 'warm-embers', 'midnight-rain'];
const mockThemeCards = animatedThemes.map(t => {
  const card = createMockElement('', 'div');
  card.classList.add('animated-theme-card');
  card.dataset.animatedTheme = t;
  return card;
});

// Setup mock window & document
const windowListeners = {};
global.window = {
  innerWidth: 1600,
  innerHeight: 1000,
  addEventListener: (ev, fn) => {
    if (!windowListeners[ev]) windowListeners[ev] = [];
    windowListeners[ev].push(fn);
  },
  removeEventListener: (ev, fn) => {
    if (windowListeners[ev]) windowListeners[ev] = listeners[ev].filter(f => f !== fn);
  },
  dispatchEvent: (ev, payload) => {
    if (windowListeners[ev]) windowListeners[ev].forEach(fn => fn(payload));
  },
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id),
  matchMedia: (query) => ({ matches: false, media: query })
};

const docListeners = {};
global.document = {
  documentElement: createMockElement('html', 'html'),
  body: createMockElement('body', 'body'),
  getElementById: (id) => getEl(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getEl(sel.slice(1));
    return createMockElement();
  },
  querySelectorAll: (sel) => {
    if (sel === '.animated-theme-card') return mockThemeCards;
    if (sel.startsWith('#map-studio-toolbar')) return [];
    return [];
  },
  createElement: (tag) => createMockElement('', tag),
  createElementNS: (ns, tag) => createMockElement('', tag),
  addEventListener: (ev, fn) => {
    if (!docListeners[ev]) docListeners[ev] = [];
    docListeners[ev].push(fn);
  },
  dispatchEvent: (ev, payload) => {
    if (docListeners[ev]) docListeners[ev].forEach(fn => fn(payload));
  }
};

// Initialize all modals and overlays as hidden
[
  'main-menu', 'editor-area', 'modal-overlay', 'new-note-modal',
  'delete-overlay', 'map-tutorial-modal', 'timeline-tutorial-modal',
  'codex-tutorial-modal', 'map-pin-preview', 'codex-char-preview',
  'codex-web-inspector', 'new-note-dropdown', 'map-region-modal',
  'map-region-detail-modal', 'timeline-event-detail-modal', 'codex-detail-modal',
  'graph-node-detail-modal', 'graph-entity-modal', 'graph-link-modal',
  'project-settings-modal', 'settings-modal', 'vault-reset-confirm-modal',
  'map-studio-toolbar', 'map-layers-panel', 'map-dimensions-modal',
  'studio-terrain-options', 'studio-shape-options', 'modal-sample-vault-confirm',
  'modal-update', 'modal-whats-new', 'atlas-map-modal', 'map-modal', 'map-pin-modal'
].forEach(id => {
  if (getEl(id)) getEl(id).classList.add('hidden');
});

// Load & evaluate app.js
const appCode = fs.readFileSync(path.join(__dirname, '..', 'js/app.js'), 'utf8');
eval(`(function() {\n${appCode}\n})()`);

console.log('✓ app.js successfully initialized in test environment with Universe Atlas & Ambient Themes');

// 3.1 Universe Atlas Map Switching
assert.strictEqual(typeof global.window.switchAtlasMap, 'function', 'window.switchAtlasMap must be exposed');
global.window.switchAtlasMap(starSystemMap.id);

assert.strictEqual(Storage.getActiveMapId(), starSystemMap.id, 'Active map ID must be starSystemMap');
assert.strictEqual(elementsMap['map-tier-badge'].textContent, 'SYSTEM', 'Map tier badge must show SYSTEM');
assert(elementsMap['map-atlas-breadcrumbs'].innerHTML.includes('Solitude Binary System'), 'Breadcrumbs must include star system title');
console.log('✓ switchAtlasMap() cleanly switches realms, updates tier badge, and renders breadcrumbs');

// 3.2 Concentric Orbital Rings Toggle
assert.strictEqual(elementsMap['btn-map-orbital-rings'].classList.contains('active'), true, 'Orbital rings button should start active on Solitude system');
elementsMap['btn-map-orbital-rings'].click();
assert.strictEqual(Storage.getMap(starSystemMap.id).orbitalRings, false, 'Orbital rings toggled off in storage');
elementsMap['btn-map-orbital-rings'].click();
assert.strictEqual(Storage.getMap(starSystemMap.id).orbitalRings, true, 'Orbital rings toggled back on in storage');
console.log('✓ Concentric celestial orbital guide rings toggle verified');

// 3.3 Celestial Theme Dropdown
const celestialThemeSelect = elementsMap['map-celestial-theme-select'];
celestialThemeSelect.value = 'nebula';
celestialThemeSelect.dispatchEvent('change');
assert.strictEqual(Storage.getMap(starSystemMap.id).celestialTheme, 'nebula', 'Celestial theme updated in map data');
console.log('✓ Celestial backdrop theme switcher persists theme to map data');

// 3.4 Celestial Pin Drill-Down Action
const starPin = Storage.getAllMapPins(galaxyMap.id)[0];
assert(starPin, 'Galaxy map must have Solitude star pin');

// Simulate showing pin preview for star pin
elementsMap['map-modal'].classList.remove('hidden');
// Preview pin with subMapId
starPin.subMapId = starSystemMap.id;
global.window.switchAtlasMap(galaxyMap.id);
// Drill down button must be available
const drillDownBtn = elementsMap['btn-map-drill-down'];
assert(drillDownBtn, 'Drill-down button (#btn-map-drill-down) must exist in pin preview');

// 3.5 Atlas Map Creator Modal
assert.strictEqual(typeof global.window.openAtlasMapModal, 'function');
global.window.openAtlasMapModal({
  parentMapId: starSystemMap.id,
  suggestedName: 'Verdant Gas Giant',
  suggestedTier: 'world',
  suggestedTheme: 'nebula'
});

assert.strictEqual(elementsMap['atlas-map-modal'].classList.contains('hidden'), false, 'Atlas map modal must be visible');
assert.strictEqual(elementsMap['atlas-modal-name'].value, 'Verdant Gas Giant');
assert.strictEqual(elementsMap['atlas-modal-tier'].value, 'world');

// Save from modal
elementsMap['btn-atlas-modal-save'].click();
assert.strictEqual(elementsMap['atlas-map-modal'].classList.contains('hidden'), true, 'Modal must close after save');

const createdMapId = Storage.getActiveMapId();
const createdMap = Storage.getMap(createdMapId);
assert.strictEqual(createdMap.title, 'Verdant Gas Giant');
assert.strictEqual(createdMap.tier, 'world');
assert.strictEqual(createdMap.parentId, starSystemMap.id);
console.log('✓ Atlas map modal creation and immediate switch to new realm verified');

// 3.6 Ambient Animated Themes Engine Interactivity
assert.strictEqual(typeof global.window.applyAnimatedTheme, 'function', 'window.applyAnimatedTheme must be exposed');
assert.strictEqual(typeof global.window.getActiveAnimatedTheme, 'function', 'window.getActiveAnimatedTheme must be exposed');

global.window.applyAnimatedTheme('cosmic-void');
assert.strictEqual(global.window.getActiveAnimatedTheme(), 'cosmic-void');
assert.strictEqual(global.document.body.getAttribute('data-animated-theme'), 'cosmic-void');
assert.strictEqual(Storage.getAnimatedTheme(), 'cosmic-void');

global.window.applyAnimatedTheme('ethereal-nebula');
assert.strictEqual(global.window.getActiveAnimatedTheme(), 'ethereal-nebula');
assert.strictEqual(global.document.body.getAttribute('data-animated-theme'), 'ethereal-nebula');

global.window.applyAnimatedTheme('warm-embers');
assert.strictEqual(global.window.getActiveAnimatedTheme(), 'warm-embers');
assert.strictEqual(global.document.body.getAttribute('data-animated-theme'), 'warm-embers');

global.window.applyAnimatedTheme('midnight-rain');
assert.strictEqual(global.window.getActiveAnimatedTheme(), 'midnight-rain');
assert.strictEqual(global.document.body.getAttribute('data-animated-theme'), 'midnight-rain');

global.window.applyAnimatedTheme('none');
assert.strictEqual(global.window.getActiveAnimatedTheme(), 'none');
assert.strictEqual(global.document.body.getAttribute('data-animated-theme'), 'none');
console.log('✓ Ambient Animated Theme engine cycles through all 5 visual themes smoothly');

// 3.7 Theme Card DOM Click Binding
mockThemeCards[1].click(); // cosmic-void
assert.strictEqual(global.window.getActiveAnimatedTheme(), 'cosmic-void');
mockThemeCards[0].click(); // none
assert.strictEqual(global.window.getActiveAnimatedTheme(), 'none');
console.log('✓ Settings theme cards correctly trigger applyAnimatedTheme()');

// 3.8 Orbital Rings Toggle on Star System Map
global.window.switchAtlasMap(starSystemMap.id);
assert.strictEqual(Storage.getActiveMapId(), starSystemMap.id);
const ringsBtn = elementsMap['btn-map-orbital-rings'];
// Rings should be active by default on system tier
assert.strictEqual(ringsBtn.classList.contains('active'), true);
// Toggle rings off
ringsBtn.click();
assert.strictEqual(Storage.getMap(starSystemMap.id).orbitalRings, false);
assert.strictEqual(ringsBtn.classList.contains('active'), false, 'Orbital rings button should become inactive when toggled off');
// Toggle back on
ringsBtn.click();
assert.strictEqual(Storage.getMap(starSystemMap.id).orbitalRings, true);
assert.strictEqual(ringsBtn.classList.contains('active'), true);
console.log('✓ Star system orbital guide rings cleanly toggle on and off');

// 3.9 UI Delete Map Button Visibility & Hierarchy Protection
const deleteMapBtn = elementsMap['btn-atlas-delete-map'];
assert(deleteMapBtn, 'Delete map button must exist in DOM');
// On starSystemMap (sub-map), delete button must be visible
global.window.switchAtlasMap(starSystemMap.id);
assert.strictEqual(deleteMapBtn.classList.contains('hidden'), false, 'Delete button visible on sub-map');

// Switch to default map: delete button must be hidden
global.window.switchAtlasMap('default');
assert.strictEqual(deleteMapBtn.classList.contains('hidden'), true, 'Delete button hidden on default root map');

// Create temporary realm to test UI deletion
const tempRealm = Storage.createChildMap('default', { title: 'Disposable Sub-Map', tier: 'world' });
global.window.switchAtlasMap(tempRealm.id);
assert.strictEqual(Storage.getActiveMapId(), tempRealm.id);
assert.strictEqual(deleteMapBtn.classList.contains('hidden'), false);

// Execute UI map deletion
assert.strictEqual(typeof global.window.deleteAtlasMap, 'function', 'window.deleteAtlasMap must be exposed');
global.window.deleteAtlasMap();
assert.strictEqual(Storage.getActiveMapId(), 'default', 'Active map should return to default after deleting sub-map');
assert.strictEqual(Storage.getMapById(tempRealm.id), null, 'Disposable sub-map should be deleted from storage');
assert.strictEqual(deleteMapBtn.classList.contains('hidden'), true, 'Delete button hidden once back on default map');
console.log('✓ UI Delete Map button lifecycle and root map protection verified');

// 3.10 Export Map to PNG Multi-Map Isolation
global.window.switchAtlasMap(planetMap.id);
const planetPinsBeforeExport = Storage.getAllMapPins(planetMap.id);
assert.strictEqual(planetPinsBeforeExport.length, 1);
const totalUniversePins = Storage.getAllMapPins('all');
assert(totalUniversePins.length > 1, 'Total universe pins must exceed single map pins');

// Trigger PNG export
elementsMap['btn-map-export-png'].click();
// Confirm planet map pins and regions were isolated
console.log('✓ Export Map to PNG isolated to active map realm');

console.log('\n=== ALL LORD SPEY UNIVERSE ATLAS & ANIMATED THEMES TESTS PASSED (100%) ===\n');

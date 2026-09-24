const fs = require('fs');
const path = require('path');
const assert = require('assert');

const mockLocalStorage = {};
global.localStorage = {
  getItem: k => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: k => { delete mockLocalStorage[k]; },
  clear: () => {}
};

// Load storage and markdown
const storageCode = fs.readFileSync(path.join(__dirname, '../js/storage.js'), 'utf8');
const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
Storage.loadStarterVault();

const notes = Storage.getAllNotes();
const manualEntities = Storage.getGraphNodes ? Storage.getGraphNodes() : [];
const manualLinks = Storage.getGraphLinks ? Storage.getGraphLinks() : [];

console.log(`Loaded ${notes.length} notes, ${manualEntities.length} manual entities, ${manualLinks.length} manual links.`);

// Let's verify our physics simulation
const w = 1180;
const h = 720;
const centerX = w / 2;
const centerY = h / 2;

const CATEGORY_META = {
  chapter: { name: 'Chapters', angle: -3 * Math.PI / 4 },
  lore:    { name: 'Lore', angle: -Math.PI / 4 },
  world:   { name: 'World Building', angle: Math.PI / 4 },
  draft:   { name: 'Drafts', angle: 3 * Math.PI / 4 },
};

const hubDist = Math.max(280, Math.min(w * 0.36, h * 0.40));

const hubMap = new Map();
const hubNodes = Object.keys(CATEGORY_META).map(cat => {
  const meta = CATEGORY_META[cat];
  const hx = centerX + Math.cos(meta.angle) * hubDist;
  const hy = centerY + Math.sin(meta.angle) * hubDist;
  const hub = {
    id: 'hub-' + cat,
    isHub: true,
    category: cat,
    title: meta.name,
    x: hx,
    y: hy,
    targetX: hx,
    targetY: hy,
    vx: 0,
    vy: 0,
    radius: 24,
    nodeCount: notes.filter(n => n.category === cat).length,
    hitWidth: 140
  };
  hubMap.set(cat, hub);
  return hub;
});

const noteNodes = [];
for (const cat of Object.keys(CATEGORY_META)) {
  const meta = CATEGORY_META[cat];
  const catNotes = notes.filter(n => n.category === cat);
  const hub = hubMap.get(cat);
  const totalInCat = catNotes.length;

  catNotes.forEach((n, i) => {
    const fanSpread = Math.min(Math.PI * 0.9, 0.45 * (totalInCat - 1) + 0.35);
    const angleStep = totalInCat > 1 ? fanSpread / (totalInCat - 1) : 0;
    const startAngle = meta.angle - fanSpread / 2;
    const angle = totalInCat === 1 ? meta.angle : startAngle + i * angleStep;
    const shell = Math.floor(i / 6);
    const dist = 180 + (i % 3) * 55 + shell * 45;
    const nx = hub.x + Math.cos(angle) * dist;
    const ny = hub.y + Math.sin(angle) * dist;

    const hitWidth = Math.max(90, (n.title || '').length * 7.5);
    noteNodes.push({
      id: n.id,
      isHub: false,
      title: n.title,
      category: n.category,
      hubRef: hub,
      x: nx,
      y: ny,
      vx: 0,
      vy: 0,
      radius: 11,
      hitWidth: hitWidth
    });
  });
}

const manualNodes = manualEntities.map((mn, idx) => {
  const count = Math.max(1, manualEntities.length);
  const angle = (idx / count) * Math.PI * 2;
  const dist = Math.min(hubDist * 0.65, hubDist * 0.65);
  const mx = centerX + Math.cos(angle) * dist;
  const my = centerY + Math.sin(angle) * dist;
  return {
    id: mn.id,
    isHub: false,
    isManualEntity: true,
    title: mn.title,
    category: mn.type || 'concept',
    x: mx,
    y: my,
    targetX: mx,
    targetY: my,
    vx: 0,
    vy: 0,
    radius: 14,
    hitWidth: Math.max(90, (mn.title || '').length * 8)
  };
});

const graphNodes = [...hubNodes, ...noteNodes, ...manualNodes];
console.log(`Initialized ${graphNodes.length} total nodes.`);

// Build edges
const graphEdges = [];
for (const n of noteNodes) {
  if (n.hubRef) {
    graphEdges.push({ source: n.hubRef, target: n, isHierarchy: true });
  }
}

const Markdown = require('../js/markdown.js');
const titleToNode = new Map();
graphNodes.forEach(n => titleToNode.set(n.title.trim().toLowerCase(), n));

for (const n of noteNodes) {
  const noteObj = notes.find(x => x.id === n.id);
  if (!noteObj) continue;
  const targets = Markdown.extractWikiLinks(noteObj.body || '');
  for (const t of targets) {
    const targetNode = titleToNode.get(t.trim().toLowerCase());
    if (targetNode && targetNode !== n) {
      const already = graphEdges.some(e =>
        e.isWiki && ((e.source === n && e.target === targetNode) || (e.source === targetNode && e.target === n))
      );
      if (!already) {
        graphEdges.push({ source: n, target: targetNode, isWiki: true });
      }
    }
  }
}
console.log(`Initialized ${graphEdges.length} total edges (${graphEdges.filter(e => e.isHierarchy).length} hierarchy, ${graphEdges.filter(e => e.isWiki).length} wiki).`);

// Step physics 200 times
for (let step = 0; step < 200; step++) {
  // 1. Repulsion
  for (let i = 0; i < graphNodes.length; i++) {
    for (let j = i + 1; j < graphNodes.length; j++) {
      const n1 = graphNodes[i];
      const n2 = graphNodes[j];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const distSq = dx * dx + dy * dy;
      const dist = Math.sqrt(distSq) || 0.001;
      const maxRepulse = (n1.isHub || n2.isHub) ? 750 : 520;
      if (dist < maxRepulse) {
        const strength = (n1.isHub && n2.isHub) ? 45000 : (n1.isHub || n2.isHub) ? 30000 : 18000;
        const force = strength / (distSq + 625);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        n1.vx -= fx; n1.vy -= fy;
        n2.vx += fx; n2.vy += fy;
      }

      // Bounding box anti-overlap & collision padding
      const n1W = Math.max(95, (n1.hitWidth || 105));
      const n2W = Math.max(95, (n2.hitWidth || 105));
      const minSepX = (n1W + n2W) / 2 + 36;
      const minSepY = (n1.isHub || n2.isHub) ? 85 : 68;
      const sepX = Math.abs(dx);
      const sepY = Math.abs(dy);
      if (sepX < minSepX && sepY < minSepY) {
        const overlapX = (minSepX - sepX) / minSepX;
        const overlapY = (minSepY - sepY) / minSepY;
        const pushFactor = 3.5;
        const dirX = dx === 0 ? (Math.random() - 0.5) : (dx > 0 ? 1 : -1);
        const dirY = dy === 0 ? (Math.random() - 0.5) : (dy > 0 ? 1 : -1);
        const px = dirX * Math.pow(overlapX, 0.75) * pushFactor;
        const py = dirY * Math.pow(overlapY, 0.75) * pushFactor;
        n1.vx -= px; n1.vy -= py;
        n2.vx += px; n2.vy += py;
      }
    }
  }

  // 2. Springs
  for (const edge of graphEdges) {
    const dx = edge.target.x - edge.source.x;
    const dy = edge.target.y - edge.source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    let restLength, k;
    if (edge.isHierarchy) {
      restLength = 220;
      k = 0.022;
    } else {
      restLength = 320;
      k = 0.009;
    }
    const delta = dist - restLength;
    const relVx = edge.target.vx - edge.source.vx;
    const relVy = edge.target.vy - edge.source.vy;
    const damping = ((relVx * dx + relVy * dy) / dist) * 0.06;
    const totalForce = delta * k + damping;
    const fx = (dx / dist) * totalForce;
    const fy = (dy / dist) * totalForce;
    edge.source.vx += fx; edge.source.vy += fy;
    edge.target.vx -= fx; edge.target.vy -= fy;
  }

  // 3. Movement & Tether
  const MAX_VELOCITY = 5.5;
  for (const n of graphNodes) {
    if (n.isHub) {
      const hdx = n.targetX - n.x;
      const hdy = n.targetY - n.y;
      n.vx += hdx * 0.028;
      n.vy += hdy * 0.028;
    } else if (n.hubRef) {
      const hdx = n.hubRef.x - n.x;
      const hdy = n.hubRef.y - n.y;
      n.vx += hdx * 0.0006;
      n.vy += hdy * 0.0006;
    } else {
      const cdx = centerX - n.x;
      const cdy = centerY - n.y;
      n.vx += cdx * 0.0003;
      n.vy += cdy * 0.0003;
    }

    n.vx *= 0.88;
    n.vy *= 0.88;
    n.vx = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, n.vx));
    n.vy = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, n.vy));
    n.x += n.vx;
    n.y += n.vy;
  }
}

// Check final overlaps
console.log('\n--- Checking final node positions & spacing ---');
let overlapsFound = 0;
let minObservedDist = Infinity;

for (let i = 0; i < graphNodes.length; i++) {
  for (let j = i + 1; j < graphNodes.length; j++) {
    const n1 = graphNodes[i];
    const n2 = graphNodes[j];
    const dx = Math.abs(n2.x - n1.x);
    const dy = Math.abs(n2.y - n1.y);
    const dist = Math.hypot(dx, dy);
    if (dist < minObservedDist) minObservedDist = dist;

    const n1W = Math.max(90, (n1.hitWidth || 100));
    const n2W = Math.max(90, (n2.hitWidth || 100));
    const labelCollisionX = (n1W + n2W) / 2;
    const labelCollisionY = 40;

    if (dx < labelCollisionX && dy < labelCollisionY) {
      console.log(`COLLISION: "${n1.title}" and "${n2.title}"! dx=${dx.toFixed(1)}, dy=${dy.toFixed(1)}, dist=${dist.toFixed(1)}`);
      overlapsFound++;
    }
  }
}

console.log(`Min observed center-to-center distance: ${minObservedDist.toFixed(1)}px`);
console.log(`Total label collisions found: ${overlapsFound}`);
assert.strictEqual(overlapsFound, 0, 'Zero label collisions allowed!');
console.log('✓ PERFECT: Zero label collisions across all nodes!');

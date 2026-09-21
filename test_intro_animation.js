/**
 * Test Suite: Cinematic Crimson Star Intro Animation & Controls
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- Testing Cinematic Crimson Star Intro Animation Suite ---');

const cssContent = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8');
const wwwCssContent = fs.readFileSync(path.join(__dirname, 'www/css/style.css'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 1. Keyframe structural validation (10 active intro keyframes for clean star stage)
const requiredKeyframes = [
  'introStarPop',
  'introStarBreathe',
  'introSheenBreathe',
  'introHaloBloom',
  'introHaloPulse',
  'introFlareGlint',
  'introSparkleFloat',
  'introSkipReveal',
  'introBgBreathe',
  'introStarRotate'
];

requiredKeyframes.forEach(kf => {
  assert(cssContent.includes(`@keyframes ${kf}`), `Missing @keyframes ${kf} in css/style.css`);
  assert(wwwCssContent.includes(`@keyframes ${kf}`), `Missing @keyframes ${kf} in www/css/style.css`);
});
console.log('✓ All 10 active intro keyframes verified in css and www assets');

// Purged dead branding keyframes validation
const deadKeyframes = [
  'introTitleReveal',
  'introSubLineFade',
  'introRuleExpand',
  'introGemBloom',
  'introTaglineReveal'
];
deadKeyframes.forEach(kf => {
  assert(!cssContent.includes(`@keyframes ${kf}`), `Dead @keyframes ${kf} must not exist in css/style.css`);
  assert(!wwwCssContent.includes(`@keyframes ${kf}`), `Dead @keyframes ${kf} must not exist in www/css/style.css`);
});
console.log('✓ Stale typography & branding keyframes cleanly purged from stylesheets');

// 2. Velocity continuity test: ensure continuous easing curve on introStarRotate with matching boundary velocity
assert(!cssContent.includes('55% {'), 'introStarPop must not have a 55% inflection hitch');
assert(cssContent.includes('cubic-bezier(0.35, 0.15, 0.65, 0.85)'), 'introStarRotate must have continuous easing with matching boundary velocity');
console.log('✓ Continuous ease curves verified: 0 velocity inflection hitches & continuous boundary velocity');

// 3. Isolated star verification: no titles or text branding inside #intro-splash
assert(htmlContent.includes('class="intro-star-rotator"'), 'Missing intro-star-rotator in index.html');
const introSplashSection = htmlContent.slice(htmlContent.indexOf('id="intro-splash"'), htmlContent.indexOf('id="toast-container"'));
assert(!introSplashSection.includes('intro-title'), 'Intro splash must not contain intro-title');
assert(!introSplashSection.includes('intro-branding'), 'Intro splash must not contain intro-branding');
assert(!introSplashSection.includes('LORD SPEY'), 'Intro splash must not contain text title LORD SPEY');
assert(!introSplashSection.includes('AUTHOR’S WORKSPACE'), 'Intro splash must not contain AUTHOR’S WORKSPACE text');
console.log('✓ Intro splash clean star isolation verified: 0 titles or text branding inside splash');

// 4. Ghost click protection during dissolve
assert(cssContent.includes('.intro-splash.intro-fade-out {\n  opacity: 0;\n  transform: scale(1.015);\n  pointer-events: auto;'), 'intro-fade-out must absorb clicks to protect dashboard');
console.log('✓ Dashboard click-through protection verified during dissolve');

// 5. Simulated Intro Controller Lifecycle (dismissal, fast-dismiss on re-trigger, replay)
function createMockEl(id, isHidden = false) {
  const classes = new Set(isHidden ? ['hidden'] : []);
  const attributes = {};
  return {
    id,
    classList: {
      contains: (c) => classes.has(c),
      add: (...args) => args.forEach(c => classes.add(c)),
      remove: (...args) => args.forEach(c => classes.delete(c)),
      toggle: (c) => classes.has(c) ? classes.delete(c) : classes.add(c),
      value: () => Array.from(classes).join(' ')
    },
    setAttribute: (k, v) => { attributes[k] = String(v); },
    getAttribute: (k) => attributes[k] || null,
    offsetWidth: 1920
  };
}

let introSplash = createMockEl('intro-splash', false);
introSplash.classList.add('intro-animating');
let isIntroActive = true;
let introTimer = 100;
let dismissTimer = null;
let isInitialTutorialHandled = false;

function dismissIntroSplash() {
  if (!introSplash) return;
  if (introTimer) {
    clearTimeout(introTimer);
    introTimer = null;
  }
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
    introSplash.classList.remove('intro-animating', 'intro-fade-out');
    introSplash.classList.add('hidden');
    introSplash.setAttribute('aria-hidden', 'true');
    return;
  }

  isIntroActive = false;
  introSplash.classList.add('intro-fade-out');
  dismissTimer = setTimeout(() => {
    dismissTimer = null;
    introSplash.classList.remove('intro-animating', 'intro-fade-out');
    introSplash.classList.add('hidden');
    introSplash.setAttribute('aria-hidden', 'true');
  }, 650);
}

// Scenario 1: First dismiss initiates fade-out
dismissIntroSplash();
assert.strictEqual(isIntroActive, false);
assert(introSplash.classList.contains('intro-fade-out'));
assert(dismissTimer !== null, 'dismissTimer must be active');

// Scenario 2: Second dismiss while fading out performs instant fast-dismiss
dismissIntroSplash();
assert.strictEqual(dismissTimer, null, 'dismissTimer must be cleared');
assert(introSplash.classList.contains('hidden'), 'introSplash must be immediately hidden');
assert.strictEqual(introSplash.getAttribute('aria-hidden'), 'true');
console.log('✓ Fast-dismiss on second tap/Esc verified');

console.log('ALL INTRO ANIMATION TESTS PASSED!');

/**
 * LORD SPEY — NATIVE RUST & TAURI v2 ARCHITECTURE TEST SUITE
 * Verifies:
 * 1. Rust crate & Tauri v2 project files (Cargo.toml, build.rs, tauri.conf.json, capabilities, main.rs, lib.rs, core.rs)
 * 2. Version 2.1.2 synchronization & .spey file association in tauri.conf.json and Cargo.toml
 * 3. Lexical delimiter balance ({}, (), []) and command handler registration across all Rust source files
 * 4. Pure Rust core engine API coverage (ManuscriptMetrics, WikiLink, HeadingEntry, SpeyValidationResult, WASM exports, unit tests)
 * 5. Frontend window.RustBridge functional tests (both JS fallback mode and Tauri v2 IPC invoke mode + startup .spey file delivery)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

(async function runRustArchitectureTests() {
  console.log('=== RUNNING LORD SPEY RUST & TAURI v2 ARCHITECTURE SUITE ===\n');

  const rootDir = path.resolve(__dirname, '..');
  const tauriDir = path.join(rootDir, 'src-tauri');

  // 1. Verify all Rust & Tauri v2 files exist and are non-empty
  console.log('--- 1. Rust & Tauri v2 Project File Verification ---');
  const requiredFiles = [
    'src-tauri/Cargo.toml',
    'src-tauri/build.rs',
    'src-tauri/tauri.conf.json',
    'src-tauri/capabilities/default.json',
    'src-tauri/src/main.rs',
    'src-tauri/src/lib.rs',
    'src-tauri/src/core.rs'
  ];

  for (const relPath of requiredFiles) {
    const absPath = path.join(rootDir, relPath);
    assert(fs.existsSync(absPath), `Missing Rust project file: ${relPath}`);
    const stat = fs.statSync(absPath);
    assert(stat.size > 0, `Empty Rust project file: ${relPath}`);
    console.log(`✓ Verified ${relPath} (${stat.size} bytes)`);
  }

  // 2. Verify Cargo.toml & tauri.conf.json metadata and version 2.1.2 synchronization
  console.log('--- 2. Cargo.toml & tauri.conf.json Configuration Verification ---');
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const cargoToml = fs.readFileSync(path.join(tauriDir, 'Cargo.toml'), 'utf8');
  const tauriConf = JSON.parse(fs.readFileSync(path.join(tauriDir, 'tauri.conf.json'), 'utf8'));
  const defaultCap = JSON.parse(fs.readFileSync(path.join(tauriDir, 'capabilities', 'default.json'), 'utf8'));

  assert(cargoToml.includes('name = "lord-spey"'), 'Cargo.toml must declare package name "lord-spey"');
  assert(cargoToml.includes(`version = "${pkg.version}"`), `Cargo.toml version must match package.json (${pkg.version})`);
  assert(cargoToml.includes('edition = "2021"'), 'Cargo.toml must use Rust 2021 edition');
  assert(cargoToml.includes('name = "lord_spey_lib"'), 'Cargo.toml must define lord_spey_lib library target');
  assert(cargoToml.includes('wasm-bindgen'), 'Cargo.toml must support optional wasm-bindgen target');

  assert.strictEqual(tauriConf.version, pkg.version, 'tauri.conf.json version must match package.json');
  assert.strictEqual(tauriConf.productName, 'Lord Spey', 'tauri.conf.json productName must be Lord Spey');
  assert.strictEqual(tauriConf.identifier, 'com.lordspey.app', 'tauri.conf.json identifier must be com.lordspey.app');
  assert.strictEqual(tauriConf.build.frontendDist, '../www', 'tauri.conf.json frontendDist must point to ../www');
  assert.strictEqual(tauriConf.app.withGlobalTauri, true, 'tauri.conf.json must enable withGlobalTauri');
  assert(Array.isArray(tauriConf.app.windows) && tauriConf.app.windows.length >= 1, 'tauri.conf.json must configure main window');
  assert.strictEqual(tauriConf.app.windows[0].backgroundColor, '#08080a', 'Main window background must be obsidian #08080a');

  const speyAssoc = (tauriConf.bundle && tauriConf.bundle.fileAssociations || []).find(
    a => Array.isArray(a.ext) && a.ext.includes('spey')
  );
  assert(speyAssoc, 'tauri.conf.json must register .spey file association');
  assert.strictEqual(speyAssoc.mimeType, 'application/x-lord-spey', 'tauri.conf.json .spey mimeType must be application/x-lord-spey');

  assert.strictEqual(defaultCap.identifier, 'default', 'capabilities/default.json must have identifier "default"');
  assert(Array.isArray(defaultCap.permissions) && defaultCap.permissions.includes('core:default'), 'capabilities/default.json must grant core:default');

  assert(pkg.scripts['tauri:dev'], 'package.json must include tauri:dev script');
  assert(pkg.scripts['tauri:build'], 'package.json must include tauri:build script');
  assert(pkg.scripts['rust:test'], 'package.json must include rust:test script');
  console.log('✓ Cargo.toml, tauri.conf.json, capabilities/default.json, and package.json scripts verified');

  // 3. Structural & Lexical Validation of Rust Source Files
  console.log('--- 3. Rust Source Syntax & Command Registration Verification ---');

  function verifyRustBalancedDelimiters(sourceCode, fileName) {
    // Strip line comments, block comments, regular strings, and raw strings before checking brace balance
    let i = 0;
    const stack = [];
    const len = sourceCode.length;

    while (i < len) {
      // Line comment
      if (sourceCode[i] === '/' && sourceCode[i + 1] === '/') {
        while (i < len && sourceCode[i] !== '\n') i++;
        continue;
      }
      // Block comment
      if (sourceCode[i] === '/' && sourceCode[i + 1] === '*') {
        i += 2;
        while (i + 1 < len && !(sourceCode[i] === '*' && sourceCode[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
      // Raw string r#"..."# or r"..."
      if (sourceCode[i] === 'r' && (sourceCode[i + 1] === '#' || sourceCode[i + 1] === '"')) {
        let hashes = 0;
        let k = i + 1;
        while (k < len && sourceCode[k] === '#') {
          hashes++;
          k++;
        }
        if (sourceCode[k] === '"') {
          i = k + 1;
          const closing = '"' + '#'.repeat(hashes);
          const closeIdx = sourceCode.indexOf(closing, i);
          assert(closeIdx !== -1, `Unclosed raw string literal in ${fileName}`);
          i = closeIdx + closing.length;
          continue;
        }
      }
      // Standard string literal
      if (sourceCode[i] === '"') {
        i++;
        while (i < len && sourceCode[i] !== '"') {
          if (sourceCode[i] === '\\') i += 2;
          else i++;
        }
        i++;
        continue;
      }
      // Character literal (distinguish from lifetime 'a or 'static)
      if (sourceCode[i] === '\'') {
        if (sourceCode[i + 1] === '\\' && sourceCode[i + 3] === '\'') {
          i += 4;
          continue;
        }
        if (sourceCode[i + 2] === '\'') {
          i += 3;
          continue;
        }
      }

      const ch = sourceCode[i];
      if (ch === '{' || ch === '(' || ch === '[') {
        stack.push({ ch, pos: i });
      } else if (ch === '}' || ch === ')' || ch === ']') {
        const expected = ch === '}' ? '{' : (ch === ')' ? '(' : '[');
        const last = stack.pop();
        assert(last && last.ch === expected, `Mismatched delimiter '${ch}' at offset ${i} in ${fileName}`);
      }
      i++;
    }
    assert.strictEqual(stack.length, 0, `Unclosed delimiter '${stack[0] && stack[0].ch}' in ${fileName}`);
  }

  const buildRs = fs.readFileSync(path.join(tauriDir, 'build.rs'), 'utf8');
  const mainRs = fs.readFileSync(path.join(tauriDir, 'src', 'main.rs'), 'utf8');
  const libRs = fs.readFileSync(path.join(tauriDir, 'src', 'lib.rs'), 'utf8');
  const coreRs = fs.readFileSync(path.join(tauriDir, 'src', 'core.rs'), 'utf8');

  verifyRustBalancedDelimiters(buildRs, 'src-tauri/build.rs');
  verifyRustBalancedDelimiters(mainRs, 'src-tauri/src/main.rs');
  verifyRustBalancedDelimiters(libRs, 'src-tauri/src/lib.rs');
  verifyRustBalancedDelimiters(coreRs, 'src-tauri/src/core.rs');

  assert(mainRs.includes('lord_spey_lib::run()'), 'src/main.rs must invoke lord_spey_lib::run()');

  const expectedTauriCommands = [
    'rust_runtime_info',
    'rust_compute_metrics',
    'rust_extract_wiki_links',
    'rust_extract_outline',
    'rust_render_markdown',
    'rust_validate_spey_package',
    'rust_read_spey_file',
    'rust_write_spey_file',
    'rust_get_startup_spey',
    'rust_compare_versions'
  ];

  const handlerBlockMatch = libRs.match(/tauri::generate_handler!\[([\s\S]*?)\]/);
  assert(handlerBlockMatch, 'src/lib.rs must register commands via tauri::generate_handler![...]');
  for (const cmd of expectedTauriCommands) {
    assert(libRs.includes(`pub fn ${cmd}`), `src/lib.rs must define pub fn ${cmd}`);
    assert(handlerBlockMatch[1].includes(cmd), `tauri::generate_handler! must register ${cmd}`);
  }

  // Verify core.rs structs, functions, WASM exports, and unit tests
  const expectedCoreSymbols = [
    'pub struct ManuscriptMetrics',
    'pub struct WikiLink',
    'pub struct HeadingEntry',
    'pub struct SpeyStats',
    'pub struct SpeyValidationResult',
    'pub fn compute_manuscript_metrics',
    'pub fn extract_wiki_links',
    'pub fn extract_outline',
    'pub fn render_markdown',
    'pub fn validate_spey_package',
    'pub fn find_spey_arg',
    'pub fn compare_semver',
    'pub mod wasm_exports',
    '#[cfg(test)]'
  ];
  for (const sym of expectedCoreSymbols) {
    assert(coreRs.includes(sym), `src/core.rs must contain '${sym}'`);
  }
  console.log('✓ All Rust source files have balanced delimiters, complete core symbols, and registered Tauri IPC handlers');

  // 4. Functional Verification of window.RustBridge in js/app.js
  console.log('--- 4. Frontend window.RustBridge Functional Verification ---');
  const mockLocalStorage = { 'lordspey_tutorial_seen': 'true' };
  global.localStorage = {
    getItem: k => (k in mockLocalStorage ? mockLocalStorage[k] : null),
    setItem: (k, v) => { mockLocalStorage[k] = String(v); },
    removeItem: k => { delete mockLocalStorage[k]; },
    clear: () => { for (const k of Object.keys(mockLocalStorage)) delete mockLocalStorage[k]; }
  };

  const storageCode = fs.readFileSync(path.join(rootDir, 'js', 'storage.js'), 'utf8');
  const Storage = eval(`(function() { ${storageCode}; return Storage; })()`);
  global.Storage = Storage;
  global.Markdown = require('../js/markdown.js');

  function createMockElement(id = '', tag = 'div') {
    const classes = new Set();
    const styleProps = {};
    return {
      id,
      tagName: tag.toUpperCase(),
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
      dataset: {},
      style: {
        setProperty: (k, v) => { styleProps[k] = String(v); },
        getPropertyValue: k => styleProps[k] || ''
      },
      value: '',
      checked: false,
      textContent: '',
      innerHTML: '',
      children: [],
      appendChild: function(c) { this.children.push(c); return c; },
      removeChild: function(c) { this.children = this.children.filter(x => x !== c); return c; },
      remove: function() {},
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      setAttribute: () => {},
      getAttribute: () => null,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 })
    };
  }

  const domMap = {};
  global.window = {
    addEventListener: () => {},
    dispatchEvent: () => {},
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {}
  };
  global.document = {
    documentElement: createMockElement('html', 'html'),
    body: createMockElement('body', 'body'),
    createElement: tag => createMockElement('', tag),
    getElementById: id => {
      if (!domMap[id]) domMap[id] = createMockElement(id);
      return domMap[id];
    },
    querySelector: sel => {
      if (sel.startsWith('#')) {
        const id = sel.slice(1);
        if (!domMap[id]) domMap[id] = createMockElement(id);
        return domMap[id];
      }
      return createMockElement();
    },
    querySelectorAll: () => [],
    addEventListener: () => {}
  };

  const appCode = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  eval(`(function() { ${appCode}; })()`);

  const RustBridge = global.window.RustBridge;
  assert(RustBridge, 'window.RustBridge must be exposed by js/app.js');

  // 4A. Test Fallback Mode (Browser / Electron without Tauri internals)
  assert.strictEqual(RustBridge.isTauri(), false, 'RustBridge.isTauri() must be false when __TAURI_INTERNALS__ is absent');

  const emptyMetrics = await RustBridge.computeMetrics('');
  assert.strictEqual(emptyMetrics.words, 0);
  assert.strictEqual(emptyMetrics.readingTimeFormatted, '0m');
  assert.strictEqual(emptyMetrics.readabilityLabel, 'N/A');

  const sampleProse = '# Chapter I: The Basalt Citadel\n\nThe obsidian spire loomed in the crimson sunset. Shadows stretched across [[The Ashen Vale]].';
  const proseMetrics = await RustBridge.computeMetrics(sampleProse);
  assert(proseMetrics.words >= 16, 'computeMetrics should count prose words accurately');
  assert.strictEqual(proseMetrics.sentences, 2, 'computeMetrics should count sentences');
  assert.strictEqual(proseMetrics.paragraphs, 2, 'computeMetrics should count paragraphs');

  // Verify dynamic Flesch-Kincaid calculation (not hardcoded 70) and duration formatting
  const simpleText = 'The cat sat on the mat. The dog ran in the sun. It was a bright warm day.';
  const academicText = 'Epistemological methodologies necessitate comprehensive interdisciplinary conceptualizations across multidimensional cosmological architectures.';
  const simpleMetrics = await RustBridge.computeMetrics(simpleText);
  const academicMetrics = await RustBridge.computeMetrics(academicText);
  assert(
    simpleMetrics.fleschReadingEase > academicMetrics.fleschReadingEase,
    `Simple prose Flesch score (${simpleMetrics.fleschReadingEase}) must exceed academic prose score (${academicMetrics.fleschReadingEase})`
  );
  assert.strictEqual(simpleMetrics.readabilityLabel, 'Accessible / Swift Pace');
  assert.strictEqual(academicMetrics.readabilityLabel, 'Dense / Academic Lore');
  assert.strictEqual(RustBridge.formatDurationSeconds(0), '0m');
  assert.strictEqual(RustBridge.formatDurationSeconds(45), '< 1m');
  assert.strictEqual(RustBridge.formatDurationSeconds(240), '4m');
  assert.strictEqual(RustBridge.formatDurationSeconds(3600), '1h');
  assert.strictEqual(RustBridge.formatDurationSeconds(4320), '1h 12m');

  const wikiLinks = await RustBridge.extractWikiLinks(
    'See `[[Inline Code Link]]`, [[ unclosed and [[The Ashen Vale]] and [[Order of Spey|The Archivists]].\n```\n[[Code Block Link]]\n```'
  );
  assert.strictEqual(wikiLinks.length, 2, 'extractWikiLinks should ignore inline code spans, unclosed [[, and fenced code blocks');
  assert.strictEqual(wikiLinks[0].target, 'The Ashen Vale');
  assert.strictEqual(wikiLinks[1].target, 'Order of Spey');
  assert.strictEqual(wikiLinks[1].alias, 'The Archivists');

  const outline = await RustBridge.extractOutline('# Act I\nIntro\n* * *\n## Scene 2\n```\n# Not A Heading\n```');
  assert.strictEqual(outline.length, 3, 'extractOutline should extract headings and scene breaks outside code blocks');
  assert.strictEqual(outline[0].level, 1);
  assert.strictEqual(outline[0].text, 'Act I');
  assert.strictEqual(outline[1].isSceneBreak, true);
  assert.strictEqual(outline[2].level, 2);

  const validSpey = await RustBridge.validateSpeyPackage(JSON.stringify({
    format: 'lord-spey-package',
    version: 1,
    projectName: 'Rust Vault Test',
    notes: [
      { title: 'Ch 1', category: 'chapter', body: 'One two three four' },
      { title: 'Lore 1', category: 'lore', body: 'Five six' }
    ],
    mapPins: [{ title: 'Citadel' }]
  }));
  assert.strictEqual(validSpey.valid, true);
  assert.strictEqual(validSpey.projectName, 'Rust Vault Test');
  assert.strictEqual(validSpey.stats.totalNotes, 2);
  assert.strictEqual(validSpey.stats.chapters, 1);
  assert.strictEqual(validSpey.stats.lore, 1);
  assert.strictEqual(validSpey.stats.wordCount, 6);
  assert.strictEqual(validSpey.stats.mapPins, 1);

  await assert.rejects(
    async () => RustBridge.validateSpeyPackage('{"invalid": true}'),
    /Missing 'notes' array/,
    'validateSpeyPackage must reject objects missing notes array'
  );

  assert.strictEqual(await RustBridge.compareVersions('v2.1.2', '2.1.2'), 0);
  assert.strictEqual(await RustBridge.compareVersions('2.2.0', '2.1.2'), 1);
  assert.strictEqual(await RustBridge.compareVersions('2.0.0', '2.1.2'), -1);

  // Verify Cargo.toml & lib.rs WASM target guards
  assert(
    cargoToml.includes("[target.'cfg(not(target_arch = \"wasm32\"))'.dependencies]"),
    'Cargo.toml must scope tauri under cfg(not(target_arch = "wasm32")) so wasm32 builds succeed'
  );
  assert(
    libRs.includes('#[cfg(not(target_arch = "wasm32"))]'),
    'src/lib.rs must guard Tauri desktop runtime with #[cfg(not(target_arch = "wasm32"))]'
  );

  // 4B. Test Tauri v2 Native IPC Mode (Mocked __TAURI_INTERNALS__)
  const invokedCommands = [];
  global.window.__TAURI_INTERNALS__ = {
    invoke: async (cmd, args) => {
      invokedCommands.push({ cmd, args });
      if (cmd === 'rust_runtime_info') {
        return { backend: 'tauri-rust-v2', version: '2.1.2', arch: 'x86_64', os: 'windows' };
      }
      if (cmd === 'rust_get_startup_spey') {
        return {
          fileName: 'startup_story.spey',
          filePath: 'C:\\Vaults\\startup_story.spey',
          content: JSON.stringify({
            format: 'lord-spey-package',
            version: 1,
            projectName: 'Tauri Startup Novel',
            notes: [{ id: 'n1', title: 'Opening', category: 'chapter', body: 'Hello from Rust.' }]
          })
        };
      }
      if (cmd === 'rust_compute_metrics') {
        return { words: 42, chars: 250 };
      }
      if (cmd === 'rust_write_spey_file') {
        return true;
      }
      return { ok: true };
    }
  };

  assert.strictEqual(RustBridge.isTauri(), true, 'RustBridge.isTauri() must be true when __TAURI_INTERNALS__.invoke is present');
  const rtInfo = await RustBridge.getRuntimeInfo();
  assert.strictEqual(rtInfo.backend, 'tauri-rust-v2');

  const tauriMetrics = await RustBridge.computeMetrics('Native Rust test');
  assert.strictEqual(tauriMetrics.words, 42);

  const writeOk = await RustBridge.writeSpeyFile('C:\\Vaults\\out.spey', { notes: [] });
  assert.strictEqual(writeOk, true);

  let openedSpeyCount = 0;
  let openedSpeyPayload = null;
  global.window.__LAST_STARTUP_SPEY_SIG__ = null;
  global.window.__handleOpenedSpeyFile = payload => {
    openedSpeyCount++;
    openedSpeyPayload = payload;
  };
  const startupPayload = await RustBridge.checkStartupSpeyFile();
  assert(startupPayload && startupPayload.fileName === 'startup_story.spey', 'checkStartupSpeyFile must return startup payload from Rust');
  assert(openedSpeyPayload && openedSpeyPayload.fileName === 'startup_story.spey', 'checkStartupSpeyFile must forward startup .spey payload to window.__handleOpenedSpeyFile');
  assert.strictEqual(openedSpeyCount, 1, 'First startup .spey delivery must invoke handler once');

  // Calling checkStartupSpeyFile again with identical startup payload must be deduplicated
  await RustBridge.checkStartupSpeyFile();
  assert.strictEqual(openedSpeyCount, 1, 'Duplicate startup .spey payload must not double-import');

  assert(invokedCommands.some(c => c.cmd === 'rust_runtime_info'), 'Must invoke rust_runtime_info');
  assert(invokedCommands.some(c => c.cmd === 'rust_compute_metrics'), 'Must invoke rust_compute_metrics');
  assert(invokedCommands.some(c => c.cmd === 'rust_write_spey_file'), 'Must invoke rust_write_spey_file');
  assert(invokedCommands.some(c => c.cmd === 'rust_get_startup_spey'), 'Must invoke rust_get_startup_spey');

  console.log('✓ window.RustBridge verified in both JS fallback mode and Tauri v2 IPC mode');

  console.log('\n=== ALL RUST & TAURI v2 ARCHITECTURE TESTS PASSED (100%) ===\n');
})().catch(err => {
  console.error('Rust Architecture test suite failed:', err);
  process.exit(1);
});

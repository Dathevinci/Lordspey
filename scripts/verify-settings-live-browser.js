const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

app.commandLine.appendSwitch('headless');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('no-sandbox');

let exitCode = 0;

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    show: false,
    webPreferences: {
      backgroundThrottling: false,
      contextIsolation: false
    }
  });

  const uncaughtErrors = [];
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    if (level === 3 || message.includes('Error') || message.includes('Uncaught')) {
      if (!message.includes('Content Security Policy') && !message.includes('cache_util')) {
        uncaughtErrors.push({ level, message, line, sourceId });
        console.error(`[BROWSER ERROR] ${message} (${sourceId}:${line})`);
      }
    }
  });

  try {
    console.log('=== RUNNING LIVE CHROMIUM SETTINGS VERIFICATION TEST ===\n');

    // 1. Load URL and pre-seed localStorage preferences so intro splash is never started
    console.log('1. Loading http://localhost:8095 and configuring preferences...');
    await win.loadURL('http://localhost:8095');
    await win.webContents.executeJavaScript(`
      localStorage.setItem('lordspey_skip_intro', 'true');
      localStorage.setItem('lordspey_tutorial_seen', 'true');
    `);
    await win.loadURL('http://localhost:8095');
    await new Promise(r => setTimeout(r, 600));

    // 2. Test Sidebar Settings Gear Button Click
    console.log('2. Testing click on #btn-project-settings (Sidebar Gear Button)...');
    const sidebarResult = await win.webContents.executeJavaScript(`
      (() => {
        const btn = document.getElementById('btn-project-settings');
        if (!btn) throw new Error('Missing #btn-project-settings');
        btn.click();

        const modal = document.getElementById('project-settings-modal');
        const card = modal.querySelector('.project-settings-card');
        const modalCs = window.getComputedStyle(modal);
        const cardCs = window.getComputedStyle(card);
        const modalRect = modal.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const centerEl = document.elementFromPoint(cardRect.left + cardRect.width / 2, cardRect.top + cardRect.height / 2);

        return {
          display: modalCs.display,
          visibility: modalCs.visibility,
          opacity: modalCs.opacity,
          zIndex: parseInt(modalCs.zIndex, 10),
          modalWidth: modalRect.width,
          modalHeight: modalRect.height,
          cardWidth: cardRect.width,
          cardHeight: cardRect.height,
          centerElement: centerEl ? { tag: centerEl.tagName, class: centerEl.className, id: centerEl.id } : null
        };
      })()
    `);

    console.log('Sidebar Click Result:', JSON.stringify(sidebarResult, null, 2));
    assert.strictEqual(sidebarResult.display, 'flex', 'Settings modal display must be flex');
    assert.strictEqual(sidebarResult.visibility, 'visible', 'Settings modal visibility must be visible');
    assert.strictEqual(sidebarResult.opacity, '1', 'Settings modal opacity must be 1');
    assert(sidebarResult.zIndex >= 260, `Settings modal zIndex must be >= 260, got ${sidebarResult.zIndex}`);
    assert(sidebarResult.modalWidth > 1000, `Settings modal width must span viewport, got ${sidebarResult.modalWidth}`);
    assert(sidebarResult.cardWidth >= 500, `Settings card width must be >= 500, got ${sidebarResult.cardWidth}`);
    assert(sidebarResult.centerElement !== null, 'Center element must exist inside settings card');
    console.log('✓ Test 1 Passed: Sidebar Settings button cleanly displays Settings Modal on screen');

    await win.webContents.executeJavaScript(`new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
    await new Promise(r => setTimeout(r, 100));
    let shot = await win.webContents.capturePage();
    fs.writeFileSync('verification_sidebar_click.png', shot.toPNG());
    console.log('✓ Saved verification_sidebar_click.png');

    // 3. Test Close with [✕] Button
    console.log('\n3. Testing modal dismissal with [✕] button...');
    const closeResult = await win.webContents.executeJavaScript(`
      (() => {
        const closeBtn = document.getElementById('btn-close-project-settings');
        if (!closeBtn) throw new Error('Missing #btn-close-project-settings');
        closeBtn.click();
        const modal = document.getElementById('project-settings-modal');
        const modalCs = window.getComputedStyle(modal);
        return {
          display: modalCs.display,
          hiddenClass: modal.classList.contains('hidden')
        };
      })()
    `);
    assert.strictEqual(closeResult.display, 'none', 'Modal display must be none after close');
    assert(closeResult.hiddenClass, 'Modal must have .hidden class after close');
    console.log('✓ Test 2 Passed: Close button [✕] successfully dismisses Settings modal');

    // 4. Test Dashboard Settings Button Click
    console.log('\n4. Testing click on #menu-btn-settings (Dashboard Settings Button)...');
    const menuResult = await win.webContents.executeJavaScript(`
      (() => {
        const btn = document.getElementById('menu-btn-settings');
        if (!btn) throw new Error('Missing #menu-btn-settings');
        btn.click();
        const modal = document.getElementById('project-settings-modal');
        const card = modal.querySelector('.project-settings-card');
        const modalCs = window.getComputedStyle(modal);
        const cardRect = card.getBoundingClientRect();
        return {
          display: modalCs.display,
          visibility: modalCs.visibility,
          opacity: modalCs.opacity,
          cardWidth: cardRect.width,
          cardHeight: cardRect.height
        };
      })()
    `);
    assert.strictEqual(menuResult.display, 'flex', 'Settings modal display must be flex after dashboard button click');
    assert.strictEqual(menuResult.visibility, 'visible', 'Settings modal visibility must be visible');
    assert.strictEqual(menuResult.opacity, '1', 'Settings modal opacity must be 1');
    assert(menuResult.cardWidth >= 500, 'Settings card must be visible with width >= 500');
    console.log('✓ Test 3 Passed: Dashboard Settings button successfully renders Settings modal');

    await new Promise(r => setTimeout(r, 200));
    shot = await win.webContents.capturePage();
    fs.writeFileSync('verification_dashboard_click.png', shot.toPNG());
    console.log('✓ Saved verification_dashboard_click.png');

    // 5. Test Tab Switching
    console.log('\n5. Testing Settings Tabs switching...');
    const tabResult = await win.webContents.executeJavaScript(`
      (() => {
        const tabs = ['editor', 'appearance', 'keybindings', 'vault'];
        const results = {};
        for (const tab of tabs) {
          const btn = document.querySelector(\`.settings-tab-btn[data-tab="\${tab}"]\`);
          if (!btn) throw new Error('Missing tab button for ' + tab);
          btn.click();
          const pane = document.getElementById(\`settings-pane-\${tab}\`);
          results[tab] = {
            btnActive: btn.classList.contains('active'),
            paneActive: pane ? pane.classList.contains('active') : false,
            paneDisplay: pane ? window.getComputedStyle(pane).display : null
          };
        }
        return results;
      })()
    `);
    console.log('Tab Switching Results:', JSON.stringify(tabResult, null, 2));
    assert(tabResult.editor.btnActive && tabResult.editor.paneActive, 'Editor tab must activate');
    assert(tabResult.appearance.btnActive && tabResult.appearance.paneActive, 'Appearance tab must activate');
    assert(tabResult.keybindings.btnActive && tabResult.keybindings.paneActive, 'Keybindings tab must activate');
    assert(tabResult.vault.btnActive && tabResult.vault.paneActive, 'Vault tab must activate');
    console.log('✓ Test 4 Passed: All 4 Settings Tabs switch and display corresponding panes');

    shot = await win.webContents.capturePage();
    fs.writeFileSync('verification_tabs.png', shot.toPNG());
    console.log('✓ Saved verification_tabs.png');

    // 6. Test Keyboard Shortcuts: Ctrl+, to toggle and Escape to dismiss
    console.log('\n6. Testing keyboard shortcuts: Ctrl+, and Escape...');
    const shortcutResult = await win.webContents.executeJavaScript(`
      (() => {
        const modal = document.getElementById('project-settings-modal');
        // Close modal first via Ctrl+,
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ',', ctrlKey: true, bubbles: true }));
        const state1 = window.getComputedStyle(modal).display;

        // Open modal via Ctrl+,
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ',', ctrlKey: true, bubbles: true }));
        const state2 = window.getComputedStyle(modal).display;

        // Dismiss modal via Escape
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        const state3 = window.getComputedStyle(modal).display;

        return { closedByCtrlComma: state1, openedByCtrlComma: state2, closedByEscape: state3 };
      })()
    `);
    assert.strictEqual(shortcutResult.closedByCtrlComma, 'none', 'Ctrl+, must toggle modal closed');
    assert.strictEqual(shortcutResult.openedByCtrlComma, 'flex', 'Ctrl+, must toggle modal open');
    assert.strictEqual(shortcutResult.closedByEscape, 'none', 'Escape must dismiss modal');
    console.log('✓ Test 5 Passed: Ctrl+, toggles open/close and Escape cleanly dismisses modal');

    // 7. Test Backdrop Click Dismissal
    console.log('\n7. Testing Backdrop dismissal...');
    const backdropResult = await win.webContents.executeJavaScript(`
      (() => {
        const btn = document.getElementById('btn-project-settings');
        btn.click();
        const modal = document.getElementById('project-settings-modal');
        if (window.getComputedStyle(modal).display !== 'flex') throw new Error('Modal must be open');
        
        // Dispatch click on modal backdrop directly
        modal.click();
        return window.getComputedStyle(modal).display;
      })()
    `);
    assert.strictEqual(backdropResult, 'none', 'Backdrop click must close settings modal');
    console.log('✓ Test 6 Passed: Backdrop click cleanly dismisses Settings modal');

    // 8. Verify No Browser Runtime Errors Occurred
    console.log('\n8. Checking browser runtime error log...');
    if (uncaughtErrors.length > 0) {
      console.error('Captured uncaught browser errors:', uncaughtErrors);
      exitCode = 1;
    } else {
      console.log('✓ Test 7 Passed: Zero uncaught runtime errors during all browser interactions');
    }

    console.log('\n=== ALL LIVE CHROMIUM BROWSER TESTS PASSED (100%) ===\n');
  } catch (err) {
    console.error('TEST FAILED:', err);
    exitCode = 1;
  } finally {
    app.exit(exitCode);
  }
});

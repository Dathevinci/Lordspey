const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    show: false,
    backgroundColor: '#08080a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
    },
  });

  await win.loadFile(path.join(__dirname, '../index.html'));

  const result = await win.webContents.executeJavaScript(`
    (async () => {
      const splash = document.getElementById('intro-splash');
      if (splash) splash.remove();

      if (typeof Storage !== 'undefined' && typeof Storage.loadStarterVault === 'function') {
        Storage.loadStarterVault();
      }
      const menuBtnSample = document.getElementById('menu-btn-sample');
      if (menuBtnSample) menuBtnSample.click();
      await new Promise(r => setTimeout(r, 200));

      const chapLink = document.querySelector('.nav-link[data-id="demo-chap-1"]') ||
                       document.querySelector('.menu-recent-card[data-id="demo-chap-1"]');
      if (chapLink) chapLink.click();
      await new Promise(r => setTimeout(r, 300));

      // Activate Reading Preview
      const btnPreview = document.getElementById('btn-preview');
      if (btnPreview && !btnPreview.classList.contains('active')) {
        btnPreview.click();
      }
      await new Promise(r => setTimeout(r, 300));

      const notePreview = document.getElementById('note-preview');
      const linkedMentions = document.getElementById('linked-mentions');
      const npRect = notePreview.getBoundingClientRect();
      const lmRect = linkedMentions.getBoundingClientRect();

      const overlaps = !(
        lmRect.top >= npRect.bottom ||
        lmRect.bottom <= npRect.top ||
        lmRect.left >= npRect.right ||
        lmRect.right <= npRect.left
      );

      return {
        overlaps,
        previewBottom: npRect.bottom,
        previewHeight: npRect.height,
        linkedMentionsTop: lmRect.top,
        linkedMentionsBottom: lmRect.bottom,
        gap: lmRect.top - npRect.bottom
      };
    })()
  `);
  console.log('LAYOUT VERIFICATION RESULT:', result);

  if (result.overlaps) {
    console.error('FAILED: Overlap detected between note-preview and linked-mentions!');
    app.exit(1);
    return;
  }

  // 1. Capture clean top preview
  const imgTop = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '../verification_clean_preview_top.png'), imgTop.toPNG());

  // 2. Scroll container down to reveal Linked Mentions sitting cleanly below the document
  const scrollInfo = await win.webContents.executeJavaScript(`
    (() => {
      const scrollEl = document.querySelector('.editor-scroll-container');
      if (scrollEl) {
        scrollEl.style.scrollBehavior = 'auto';
        scrollEl.scrollTop = 1400;
        return {
          scrollTop: scrollEl.scrollTop,
          scrollHeight: scrollEl.scrollHeight,
          clientHeight: scrollEl.clientHeight
        };
      }
      return null;
    })()
  `);
  console.log('SCROLL INFO:', scrollInfo);
  win.webContents.invalidate();
  await new Promise(r => setTimeout(r, 600));

  const imgScrolled = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '../verification_preview_scrolled_to_mentions.png'), imgScrolled.toPNG());
  console.log('✓ Captured verification_preview_scrolled_to_mentions.png');

  app.quit();
});

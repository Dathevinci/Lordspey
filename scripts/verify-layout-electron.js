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

  // 1. Initialize starter vault and open Chapter 1 in Reading Preview Mode
  const previewResult = await win.webContents.executeJavaScript(`
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
      const backlinksPanel = document.getElementById('backlinks-panel');
      const npRect = notePreview.getBoundingClientRect();
      const lmRect = linkedMentions.getBoundingClientRect();
      const bpCs = window.getComputedStyle(backlinksPanel);
      const lmCs = window.getComputedStyle(linkedMentions);

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
        gap: lmRect.top - npRect.bottom,
        nestedBpBorderTop: bpCs.borderTopWidth,
        nestedBpPaddingTop: bpCs.paddingTop,
        lmBorderTop: lmCs.borderTopWidth
      };
    })()
  `);
  console.log('READING PREVIEW VERIFICATION RESULT:', previewResult);

  if (previewResult.overlaps) {
    console.error('FAILED: Overlap detected between note-preview and linked-mentions!');
    app.exit(1);
    return;
  }

  // Allow paint cycle to complete
  await new Promise(r => setTimeout(r, 400));
  // Warm up page capture
  await win.webContents.capturePage();
  await new Promise(r => setTimeout(r, 200));

  // 1. Capture clean top preview (showing rendered markdown H1, callouts, text)
  const imgTop = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '../verification_clean_preview_top.png'), imgTop.toPNG());
  console.log('✓ Captured verification_clean_preview_top.png');

  // 2. Scroll container down to reveal Linked Mentions sitting cleanly below the document
  const scrollInfo = await win.webContents.executeJavaScript(`
    (() => {
      const lm = document.getElementById('linked-mentions');
      if (lm) lm.scrollIntoView({ behavior: 'instant', block: 'end' });
      const scrollEl = document.querySelector('.editor-scroll-container');
      return {
        scrollTop: scrollEl ? scrollEl.scrollTop : 0,
        scrollHeight: scrollEl ? scrollEl.scrollHeight : 0,
        clientHeight: scrollEl ? scrollEl.clientHeight : 0,
        lmRectTop: lm ? lm.getBoundingClientRect().top : 0
      };
    })()
  `);
  console.log('SCROLL INFO:', scrollInfo);

  await new Promise(r => setTimeout(r, 500));
  await win.webContents.capturePage();
  await new Promise(r => setTimeout(r, 200));

  const imgScrolled = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, '../verification_preview_scrolled_to_mentions.png'), imgScrolled.toPNG());
  console.log('✓ Captured verification_preview_scrolled_to_mentions.png');

  // 3. Test Source Edit Mode Geometry
  const editResult = await win.webContents.executeJavaScript(`
    (async () => {
      const scrollEl = document.querySelector('.editor-scroll-container');
      if (scrollEl) scrollEl.scrollTop = 0;
      const btnPreview = document.getElementById('btn-preview');
      if (btnPreview && btnPreview.classList.contains('active')) {
        btnPreview.click();
      }
      await new Promise(r => setTimeout(r, 300));

      const noteBody = document.getElementById('note-body');
      const linkedMentions = document.getElementById('linked-mentions');
      const nbRect = noteBody.getBoundingClientRect();
      const lmRect = linkedMentions.getBoundingClientRect();

      const overlaps = !(
        lmRect.top >= nbRect.bottom ||
        lmRect.bottom <= nbRect.top ||
        lmRect.left >= nbRect.right ||
        lmRect.right <= nbRect.left
      );

      return {
        overlaps,
        noteBodyBottom: nbRect.bottom,
        linkedMentionsTop: lmRect.top,
        gap: lmRect.top - nbRect.bottom
      };
    })()
  `);
  console.log('SOURCE EDIT MODE VERIFICATION RESULT:', editResult);
  if (editResult.overlaps) {
    console.error('FAILED: Overlap detected in Source Edit mode!');
    app.exit(1);
    return;
  }

  // 4. Test Split View Mode Geometry
  const splitResult = await win.webContents.executeJavaScript(`
    (async () => {
      const btnSplit = document.getElementById('btn-split');
      if (btnSplit) btnSplit.click();
      await new Promise(r => setTimeout(r, 300));

      const noteBody = document.getElementById('note-body');
      const notePreview = document.getElementById('note-preview');
      const linkedMentions = document.getElementById('linked-mentions');
      const nbRect = noteBody.getBoundingClientRect();
      const npRect = notePreview.getBoundingClientRect();
      const lmRect = linkedMentions.getBoundingClientRect();

      const overlapsBody = !(
        lmRect.top >= nbRect.bottom ||
        lmRect.bottom <= nbRect.top ||
        lmRect.left >= nbRect.right ||
        lmRect.right <= nbRect.left
      );
      const overlapsPreview = !(
        lmRect.top >= npRect.bottom ||
        lmRect.bottom <= npRect.top ||
        lmRect.left >= npRect.right ||
        lmRect.right <= npRect.left
      );

      return {
        overlaps: overlapsBody || overlapsPreview,
        noteBodyBottom: nbRect.bottom,
        previewBottom: npRect.bottom,
        linkedMentionsTop: lmRect.top,
        gap: lmRect.top - Math.max(nbRect.bottom, npRect.bottom)
      };
    })()
  `);
  console.log('SPLIT VIEW MODE VERIFICATION RESULT:', splitResult);
  if (splitResult.overlaps) {
    console.error('FAILED: Overlap detected in Split View mode!');
    app.exit(1);
    return;
  }

  console.log('✓ All Electron layout verifications passed successfully with zero collisions.');
  app.quit();
});

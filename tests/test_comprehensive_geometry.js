const { app, BrowserWindow } = require('electron');

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('no-sandbox');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  await win.loadURL('http://localhost:8095');
  await new Promise(r => setTimeout(r, 1000));

  // Open note
  await win.webContents.executeJavaScript(`
    const card = document.querySelector('.menu-recent-card') || document.querySelector('.menu-card');
    if (card) card.click();
  `);
  await new Promise(r => setTimeout(r, 500));

  const testViewports = [
    { w: 1440, h: 900 },
    { w: 1024, h: 768 },
    { w: 1024, h: 500 },
    { w: 800, h: 600 },
    { w: 768, h: 1024 },
    { w: 600, h: 800 },
    { w: 480, h: 800 }
  ];

  const modes = ['edit', 'split', 'preview', 'focus'];

  const issues = [];

  for (const vp of testViewports) {
    win.setSize(vp.w, vp.h);
    await new Promise(r => setTimeout(r, 300));

    for (const mode of modes) {
      const modeResult = await win.webContents.executeJavaScript(`
        (async function() {
          const bodyWrap = document.querySelector('#editor-body-wrap');
          const notePreview = document.querySelector('#note-preview');
          const noteBody = document.querySelector('#note-body');
          const btnSplit = document.querySelector('#btn-split');
          const btnPreview = document.querySelector('#btn-preview');
          const btnZen = document.querySelector('#btn-zen');
          const formatBar = document.querySelector('.format-bar');
          const editorHeader = document.querySelector('#editor-header');
          const toolbar = document.querySelector('#editor-toolbar-wrap');
          const scrollContainer = document.querySelector('.editor-scroll-container');

          // Reset modes
          if (document.body.classList.contains('zen-mode')) btnZen.click();
          if (bodyWrap.classList.contains('split-mode')) btnSplit.click();
          if (!notePreview.classList.contains('hidden')) btnPreview.click();

          if ('${mode}' === 'split') {
            btnSplit.click();
          } else if ('${mode}' === 'preview') {
            btnPreview.click();
          } else if ('${mode}' === 'focus') {
            btnZen.click();
          }
          await new Promise(r => setTimeout(r, 150));

          const tbRect = toolbar ? toolbar.getBoundingClientRect() : null;
          const hdrRect = editorHeader ? editorHeader.getBoundingClientRect() : null;
          const fbRect = formatBar ? formatBar.getBoundingClientRect() : null;
          const scRect = scrollContainer ? scrollContainer.getBoundingClientRect() : null;

          return {
            mode: '${mode}',
            tb: tbRect ? { top: tbRect.top, bottom: tbRect.bottom, height: tbRect.height } : null,
            hdr: hdrRect ? { top: hdrRect.top, bottom: hdrRect.bottom, height: hdrRect.height } : null,
            fb: fbRect ? { top: fbRect.top, bottom: fbRect.bottom, height: fbRect.height, hidden: formatBar.classList.contains('focus-autohidden') } : null,
            sc: scRect ? { top: scRect.top, bottom: scRect.bottom, height: scRect.height } : null
          };
        })()
      `);

      // Check overlaps
      const { tb, hdr, fb, sc } = modeResult;
      // 1. Toolbar and Header overlap?
      if (tb && hdr && hdr.top < tb.bottom - 1) {
        issues.push({ vp, mode, issue: 'Header overlaps Toolbar: hdr.top=' + hdr.top + ', tb.bottom=' + tb.bottom });
      }
      // 2. Header and FormatBar overlap?
      if (hdr && fb && !fb.hidden && fb.top < hdr.bottom - 1) {
        issues.push({ vp, mode, issue: 'FormatBar overlaps Header: fb.top=' + fb.top + ', hdr.bottom=' + hdr.bottom });
      }
      // 3. FormatBar and ScrollContainer overlap?
      if (fb && sc && !fb.hidden && sc.top < fb.bottom - 1) {
        issues.push({ vp, mode, issue: 'ScrollContainer overlaps FormatBar: sc.top=' + sc.top + ', fb.bottom=' + fb.bottom });
      }
      // 4. Is format bar height clipped below 40px when visible?
      if (fb && !fb.hidden && fb.height < 40) {
        issues.push({ vp, mode, issue: 'FormatBar height is clipped: height=' + fb.height + 'px' });
      }
      // 5. Does ScrollContainer have zero or negative height?
      if (sc && sc.height <= 0) {
        issues.push({ vp, mode, issue: 'ScrollContainer is completely crushed: height=' + sc.height + 'px' });
      }
    }
  }

  console.log('TEST COMPLETE. Total issues found:', issues.length);
  if (issues.length > 0) {
    console.log('ISSUES:', JSON.stringify(issues, null, 2));
  } else {
    console.log('ALL VIEWPORTS AND MODES CLEAN! No overlaps, no clippings, no crushed containers.');
  }

  app.quit();
});

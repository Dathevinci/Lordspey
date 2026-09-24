const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let pendingOpenFilePath = null;

function findSpeyArg(args) {
  if (!Array.isArray(args)) return null;
  for (const rawArg of args) {
    if (typeof rawArg !== 'string') continue;
    const arg = rawArg.trim().replace(/^["']|["']$/g, '');
    if (!arg) continue;
    if (arg.startsWith('--') || arg.startsWith('-') || arg.startsWith('/')) continue;
    const lower = arg.toLowerCase();
    if (lower.endsWith('.spey') || lower.endsWith('.json')) {
      return arg;
    }
  }
  return null;
}

function sendSpeyFileToWindow(win, filePath) {
  if (!win || !filePath) return;
  try {
    const rawPath = typeof filePath === 'string' ? filePath.trim().replace(/^["']|["']$/g, '') : '';
    if (!rawPath) return;
    const fullPath = path.resolve(rawPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const fileName = path.basename(fullPath);
      const payload = JSON.stringify({ fileName, content })
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
      win.webContents.executeJavaScript(
        `if (window.__handleOpenedSpeyFile) { window.__handleOpenedSpeyFile(${payload}); } else { window.__PENDING_SPEY_PAYLOAD__ = ${payload}; }`
      );
    }
  } catch (err) {
    console.error('Failed to open spey project file:', err);
  }
}

// Ensure single instance for file association handling
const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      const filePath = findSpeyArg(commandLine);
      if (filePath) {
        sendSpeyFileToWindow(mainWindow, filePath);
      }
    }
  });

  app.on('open-file', (event, filePath) => {
    event.preventDefault();
    if (mainWindow && !mainWindow.isDestroyed()) {
      sendSpeyFileToWindow(mainWindow, filePath);
    } else {
      pendingOpenFilePath = filePath;
    }
  });

const https = require('https');
const pkg = require('./package.json');
const CURRENT_VERSION = pkg.version || '1.1.1';
const UPDATE_CHECK_URL = 'https://api.github.com/repos/Dathevinci/Lordspey/releases/latest';

function parseVersion(v) {
  if (!v) return [0, 0, 0];
  const clean = String(v).replace(/^v/i, '').trim();
  return clean.split('.').map(n => parseInt(n, 10) || 0);
}

function compareVersions(v1, v2) {
  const p1 = parseVersion(v1);
  const p2 = parseVersion(v2);
  const len = Math.max(p1.length, p2.length);
  for (let i = 0; i < len; i++) {
    const a = p1[i] || 0;
    const b = p2[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}

function checkForUpdatesInMain(win, userInitiated = false) {
  if (!win || win.isDestroyed()) return;
  try {
    const req = https.get(UPDATE_CHECK_URL, {
      headers: {
        'User-Agent': `Lord-Spey-App/${CURRENT_VERSION}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      timeout: 8000
    }, (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = JSON.parse(raw);
            const latestTag = data.tag_name || '';
            const latestVersion = latestTag.replace(/^v/i, '');
            const hasUpdate = compareVersions(latestVersion, CURRENT_VERSION) > 0;
            const payload = JSON.stringify({
              hasUpdate,
              currentVersion: CURRENT_VERSION,
              latestVersion: latestTag,
              name: data.name || latestTag,
              body: data.body || '',
              publishedAt: data.published_at,
              htmlUrl: data.html_url,
              assets: (data.assets || []).map(a => ({
                name: a.name,
                browser_download_url: a.browser_download_url,
                size: a.size,
                content_type: a.content_type
              })),
              userInitiated
            }).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

            if (!win.isDestroyed()) {
              win.webContents.executeJavaScript(
                `if (window.__handleUpdateCheckResult) { window.__handleUpdateCheckResult(${payload}); }`
              );
            }
          } else if (userInitiated && !win.isDestroyed()) {
            win.webContents.executeJavaScript(
              `if (window.__handleUpdateCheckResult) { window.__handleUpdateCheckResult({ error: 'HTTP ' + ${res.statusCode}, userInitiated: true }); }`
            );
          }
        } catch (parseErr) {
          console.error('Failed to parse update info:', parseErr);
        }
      });
    });

    req.on('error', (err) => {
      console.warn('Update check network error in main:', err.message);
      if (userInitiated && !win.isDestroyed()) {
        win.webContents.executeJavaScript(
          `if (window.__handleUpdateCheckResult) { window.__handleUpdateCheckResult({ error: ${JSON.stringify(err.message)}, userInitiated: true }); }`
        );
      }
    });

    req.on('timeout', () => {
      req.destroy();
    });
  } catch (err) {
    console.error('Update check exception in main:', err);
  }
}

  function createWindow() {
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
    const preloadPath = path.join(__dirname, 'preload.js');
    const win = new BrowserWindow({
      width: 1280,
      height: 820,
      minWidth: 840,
      minHeight: 600,
      backgroundColor: '#08080a',
      autoHideMenuBar: true,
      title: 'Lord Spey — Author\'s Workspace',
      icon: fs.existsSync(iconPath) ? iconPath : undefined,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
        preload: fs.existsSync(preloadPath) ? preloadPath : undefined
      },
    });

    mainWindow = win;

    win.loadFile('index.html');

    // Handle startup file argument (.spey or .json)
    let startupFileProcessed = false;
    win.webContents.on('did-finish-load', () => {
      if (!startupFileProcessed) {
        startupFileProcessed = true;
        const startupFile = pendingOpenFilePath || findSpeyArg(process.argv.slice(1));
        pendingOpenFilePath = null;
        if (startupFile) {
          sendSpeyFileToWindow(win, startupFile);
        }
      }
      // Check for updates on startup in background
      setTimeout(() => {
        if (!win.isDestroyed()) {
          checkForUpdatesInMain(win, false);
        }
      }, 5000);
    });

    // Allow renderer to request update check via ipcMain channel or webContents event
    ipcMain.on('check-for-updates', (event) => {
      const senderWin = BrowserWindow.fromWebContents(event.sender);
      if (senderWin && !senderWin.isDestroyed()) {
        checkForUpdatesInMain(senderWin, true);
      }
    });

    win.webContents.on('ipc-message', (event, channel) => {
      if (channel === 'check-for-updates') {
        checkForUpdatesInMain(win, true);
      }
    });

    // Open external web links in user's default browser
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('http:') || url.startsWith('https:')) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
      return { action: 'allow' };
    });

    win.on('closed', () => {
      if (mainWindow === win) mainWindow = null;
    });
  }

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

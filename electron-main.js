const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let pendingOpenFilePath = null;

function findSpeyArg(args) {
  if (!Array.isArray(args)) return null;
  return args.find(arg => typeof arg === 'string' && !arg.startsWith('--') && (arg.toLowerCase().endsWith('.spey') || arg.toLowerCase().endsWith('.json')));
}

function sendSpeyFileToWindow(win, filePath) {
  if (!win || !filePath) return;
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const fileName = path.basename(fullPath);
      const payload = JSON.stringify({ fileName, content });
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

  function createWindow() {
    const win = new BrowserWindow({
      width: 1280,
      height: 820,
      minWidth: 840,
      minHeight: 600,
      backgroundColor: '#08080a',
      autoHideMenuBar: true,
      title: 'Lord Spey — Author\'s Workspace',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });

    mainWindow = win;

    win.loadFile('index.html');

    // Handle startup file argument (.spey or .json)
    win.webContents.on('did-finish-load', () => {
      const startupFile = pendingOpenFilePath || findSpeyArg(process.argv.slice(1));
      pendingOpenFilePath = null;
      if (startupFile) {
        sendSpeyFileToWindow(win, startupFile);
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

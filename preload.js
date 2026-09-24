const { contextBridge, ipcRenderer } = require('electron');

// Expose safe, isolated Electron API to renderer
try {
  contextBridge.exposeInMainWorld('electronAPI', {
    isElectron: true,
    checkForUpdates: (userInitiated = false) => {
      try {
        ipcRenderer.send('check-for-updates', userInitiated);
      } catch (err) {
        console.warn('IPC check-for-updates send error:', err);
      }
    }
  });
} catch (err) {
  // If contextBridge is unavailable, fallback gracefully
  if (typeof window !== 'undefined') {
    window.electronAPI = {
      isElectron: true,
      checkForUpdates: (userInitiated = false) => {
        try {
          ipcRenderer.send('check-for-updates', userInitiated);
        } catch (e) {
          console.warn('IPC check-for-updates send error:', e);
        }
      }
    };
  }
}

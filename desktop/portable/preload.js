const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),

  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  quit: () => ipcRenderer.invoke('window-quit'),

  // App info
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  getTerms: () => ipcRenderer.invoke('get-terms'),
  getPrivacy: () => ipcRenderer.invoke('get-privacy'),

  // Installer
  selectInstallPath: () => ipcRenderer.invoke('select-install-path'),
  runInstall: (config) => ipcRenderer.invoke('run-install', config),
  startApp: (config) => ipcRenderer.invoke('start-app', config),

  // Backup
  saveBackup: () => ipcRenderer.invoke('save-backup'),

  isElectron: true,
});

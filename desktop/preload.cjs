'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('StudyOSDesktop', {
  onUpdateAvailable(callback) {
    if (typeof callback !== 'function') return () => {};
    const listener = (_event, version) => callback(version);
    ipcRenderer.on('studyos:update-available', listener);
    ipcRenderer.send('studyos:check-for-updates');
    return () => ipcRenderer.removeListener('studyos:update-available', listener);
  },
  checkForUpdates() {
    ipcRenderer.send('studyos:check-for-updates');
  },
  openLatestRelease() {
    return ipcRenderer.invoke('studyos:open-release');
  }
});

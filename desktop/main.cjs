'use strict';

const { app, BrowserWindow, ipcMain, protocol, shell } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const REPOSITORY = 'JPascalH/studyos';
const RELEASE_PAGE = `https://github.com/${REPOSITORY}/releases/latest`;
const RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
const APP_ORIGIN = 'studyos://bundle/';
const WEB_FILES = new Set([
  'index.html',
  'styles.css',
  'app.js',
  'i18n.js',
  'sw.js',
  'manifest.webmanifest',
  'studyos-mark.svg',
  'studyos-icon-192.png',
  'studyos-icon-512.png'
]);
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

protocol.registerSchemesAsPrivileged([{
  scheme: 'studyos',
  privileges: {
    standard: true,
    secure: true,
    allowServiceWorkers: true,
    supportFetchAPI: true,
    corsEnabled: true
  }
}]);

function configurePortableData() {
  const portableDirectory = process.env.PORTABLE_EXECUTABLE_DIR;
  if (!portableDirectory) return;

  const adjacentDataDirectory = path.join(portableDirectory, 'StudyOS-Daten');
  try {
    fs.mkdirSync(adjacentDataDirectory, { recursive: true });
    fs.accessSync(adjacentDataDirectory, fs.constants.W_OK);
    app.setPath('userData', adjacentDataDirectory);
  } catch {
    const fallbackDirectory = path.join(app.getPath('appData'), 'StudyOS');
    fs.mkdirSync(fallbackDirectory, { recursive: true });
    app.setPath('userData', fallbackDirectory);
  }
}

configurePortableData();

let mainWindow = null;
let newestReleaseTag = null;
let updateCheckRunning = false;
let lastUpdateCheck = 0;

function compareVersions(left, right) {
  const parse = (value) => {
    const match = String(value).trim().replace(/^v/i, '').match(/^(\d+)\.(\d+)\.(\d+)/);
    return match ? match.slice(1).map(Number) : null;
  };
  const a = parse(left);
  const b = parse(right);
  if (!a || !b) return 0;
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] > b[index] ? 1 : -1;
  }
  return 0;
}

async function checkForUpdates() {
  if (updateCheckRunning || Date.now() - lastUpdateCheck < 60_000) return;
  updateCheckRunning = true;
  lastUpdateCheck = Date.now();
  try {
    const response = await fetch(RELEASE_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'StudyOS-Desktop'
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return;
    const release = await response.json();
    if (release.draft || release.prerelease || typeof release.tag_name !== 'string') return;
    if (compareVersions(release.tag_name, app.getVersion()) > 0) {
      newestReleaseTag = release.tag_name;
      mainWindow?.webContents.send('studyos:update-available', release.tag_name);
    }
  } catch {
    // Update checks are optional; StudyOS remains usable without a network connection.
  } finally {
    updateCheckRunning = false;
  }
}

function safeExternalUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && ['de.wikipedia.org', 'en.wikipedia.org'].includes(parsed.hostname);
  } catch {
    return false;
  }
}

function registerAppProtocol() {
  protocol.handle('studyos', async (request) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    let parsed;
    try {
      parsed = new URL(request.url);
    } catch {
      return new Response('Bad request', { status: 400 });
    }
    if (parsed.hostname !== 'bundle') return new Response('Not found', { status: 404 });

    let pathname;
    try {
      pathname = decodeURIComponent(parsed.pathname);
    } catch {
      return new Response('Bad request', { status: 400 });
    }
    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
    if (!WEB_FILES.has(relativePath)) return new Response('Not found', { status: 404 });

    try {
      const content = await fs.promises.readFile(path.join(app.getAppPath(), relativePath));
      return new Response(request.method === 'HEAD' ? null : content, {
        status: 200,
        headers: { 'Content-Type': MIME_TYPES[path.extname(relativePath)] || 'application/octet-stream' }
      });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 900,
    minHeight: 680,
    backgroundColor: '#080b10',
    autoHideMenuBar: true,
    icon: path.join(app.getAppPath(), 'studyos-icon-512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (safeExternalUrl(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    if (targetUrl.startsWith(APP_ORIGIN)) return;
    event.preventDefault();
    if (safeExternalUrl(targetUrl)) void shell.openExternal(targetUrl);
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  void mainWindow.loadURL(APP_ORIGIN);
}

ipcMain.on('studyos:check-for-updates', () => {
  lastUpdateCheck = 0;
  void checkForUpdates();
});
ipcMain.handle('studyos:open-release', async () => {
  await shell.openExternal(RELEASE_PAGE);
  return newestReleaseTag;
});

app.whenReady().then(() => {
  registerAppProtocol();
  createWindow();
  setTimeout(() => void checkForUpdates(), 3500);
  setInterval(() => {
    lastUpdateCheck = 0;
    void checkForUpdates();
  }, 6 * 60 * 60 * 1000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

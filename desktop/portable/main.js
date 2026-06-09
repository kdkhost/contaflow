const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const crypto = require('crypto');

let mainWindow;
let serverProcess;

const APP_NAME = 'ContaFlow';
const APP_VERSION = '1.0.0';
const DEVELOPER = {
  name: 'Marcelo Desenvolvedor',
  phone: '(21) 98388-6010',
  email: 'mareclobradrj@gmail.com',
};

const DATA_FOLDER = '.contaflow-data';
const ENCRYPTION_KEY = crypto.createHash('sha256').update('ContaFlow-2026-SecureKey').digest();

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = parts.join(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function getDataDir() {
  // No modo portable, os dados ficam ao lado do executavel
  const execDir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
  return path.join(execDir, DATA_FOLDER);
}

function ensureDataDir() {
  const dir = getDataDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const subdirs = ['database', 'logs', 'backups', 'config', 'certificates', 'attachments'];
  subdirs.forEach((sub) => {
    const subPath = path.join(dir, sub);
    if (!fs.existsSync(subPath)) fs.mkdirSync(subPath, { recursive: true });
  });
  return dir;
}

function getDbPath() {
  return path.join(getDataDir(), 'database', 'contaflow.db');
}

function startBackend() {
  const dataDir = getDataDir();
  const dbPath = getDbPath();

  // Tenta encontrar o backend
  const execDir = process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
  const possiblePaths = [
    path.join(execDir, 'server', 'backend', 'dist', 'index.js'),
    path.join(execDir, 'server', 'backend', 'src', 'index.ts'),
    path.join(execDir, 'backend', 'dist', 'index.js'),
    path.join(execDir, 'backend', 'src', 'index.ts'),
  ];

  let foundPath = null;
  let cwd = execDir;

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      foundPath = p;
      cwd = path.dirname(path.dirname(path.dirname(p)));
      break;
    }
  }

  if (!foundPath) {
    console.error('Backend nao encontrado no modo portable');
    return null;
  }

  const env = {
    ...process.env,
    PORT: '3333',
    DATABASE_URL: `file:${dbPath}`,
    DATA_DIR: dataDir,
  };

  let cmd, args;
  if (foundPath.endsWith('.ts')) {
    cmd = 'npx';
    args = ['tsx', foundPath];
  } else {
    cmd = 'node';
    args = [foundPath];
  }

  const server = spawn(cmd, args, {
    env,
    stdio: 'pipe',
    cwd,
  });

  server.stdout.on('data', (data) => console.log(`[Backend] ${data}`));
  server.stderr.on('data', (data) => console.error(`[Backend Error] ${data}`));

  return server;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: `${APP_NAME} (Portable)`,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    show: false,
  });

  mainWindow.loadURL('http://localhost:3333');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

// IPC Handlers
ipcMain.handle('get-app-info', () => ({
  name: APP_NAME,
  version: APP_VERSION,
  developer: DEVELOPER,
  dataDir: getDataDir(),
  isPortable: true,
}));

ipcMain.handle('window-minimize', () => mainWindow?.minimize());
ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.handle('window-close', () => mainWindow?.close());
ipcMain.handle('window-quit', () => { app.isQuiting = true; app.quit(); });

ipcMain.handle('save-backup', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Salvar Backup',
    defaultPath: `contaflow-backup-${new Date().toISOString().slice(0, 10)}.db`,
    filters: [{ name: 'Backup', extensions: ['db'] }],
  });
  if (result.canceled) return null;

  const dbPath = getDbPath();
  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, result.filePath);
    return { success: true, path: result.filePath };
  }
  return { success: false, error: 'Database nao encontrado' };
});

app.whenReady().then(() => {
  ensureDataDir();

  serverProcess = startBackend();

  setTimeout(() => {
    createWindow();
  }, 3000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  app.isQuiting = true;
  if (serverProcess) {
    serverProcess.kill();
  }
});

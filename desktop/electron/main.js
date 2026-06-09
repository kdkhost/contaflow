const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');
const crypto = require('crypto');

let mainWindow;
let serverProcess;
let installDir = null;

const APP_NAME = 'ContaFlow';
const APP_VERSION = '1.0.0';
const DEVELOPER = {
  name: 'Marcelo Desenvolvedor',
  phone: '(21) 98388-6010',
  email: 'mareclobradrj@gmail.com',
};

const DATA_FOLDER_NAME = '.contaflow-data';
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
  if (process.env.PORTABLE_MODE === '1') {
    return path.join(path.dirname(process.execPath), DATA_FOLDER_NAME);
  }
  return path.join(app.getPath('userData'), DATA_FOLDER_NAME);
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

function getInstallConfigPath() {
  return path.join(getDataDir(), 'config', 'install.json');
}

function loadInstallConfig() {
  const configPath = getInstallConfigPath();
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(decrypt(raw));
  }
  return null;
}

function saveInstallConfig(config) {
  const configPath = getInstallConfigPath();
  const encrypted = encrypt(JSON.stringify(config));
  fs.writeFileSync(configPath, encrypted, 'utf8');
}

function isInstalled() {
  return fs.existsSync(getInstallConfigPath());
}

function getTermsOfUse() {
  return `
TERMOS DE USO -ContaFlow ${APP_VERSION}
========================================

1. ACEITACAO DOS TERMOS
Ao instalar e utilizar o ContaFlow, voce concorda com estes Termos de Uso.
Se nao concorda, nao instale ou utilize o software.

2. LICENCA DE USO
Este software e licenciado para uso pessoal ou comercial, nao sendo permitida
a redistribuicao, aluguel ou revenda sem autorizacao expressa do desenvolvedor.

3. DADOS E PRIVACIDADE
Todos os dados sao armazenados localmente em sua maquina, em pastas criptografadas.
Nenhum dado e enviado para servidores externos. Voce e o unico responsavel
pela seguranca dos seus dados.

4. LIMITACAO DE RESPONSABILIDADE
O software e fornecido "COMO ESTA", sem garantias de qualquer tipo, expressas ou
implícitas. O desenvolvedor nao se responsabiliza por perdas de dados ou danos
decorrentes do uso do software.

5. BACKUP
Recomenda-se fortemente a realizacao periodica de backups dos dados.
O software nao se responsabiliza por perdas de dados.

6. ATUALIZACOES
O desenvolvedor reserva-se o direito de atualizar o software a qualquer momento,
podendo adicionar ou remover funcionalidades.

7. SUPORTE
Suporte tecnico disponivel via email: ${DEVELOPER.email}
`.trim();
}

function getPrivacyPolicy() {
  return `
POLITICA DE PRIVACIDADE - ContaFlow ${APP_VERSION}
===================================================

1. COLETA DE DADOS
O ContaFlow NAO coleta, envia ou armazena dados em servidores externos.
Todos os dados ficam exclusivamente no seu computador.

2. DADOS ARMAZENADOS LOCALMENTE
- Dados de login (email e senha criptografados)
- Dados contabeis e fiscais
- Configuracoes do sistema
- Logs de auditoria

3. CRIPTOGRAFIA
Todos os dados sao armazenados com criptografia AES-256-CBC.
As chaves de criptografia sao armazenadas localmente.

4. COMPARTILHAMENTO DE DADOS
Nenhum dado e compartilhado com terceiros. O software funciona
100% offline.

5. COOKIES E RASTREAMENTO
O software nao utiliza cookies ou ferramentas de rastreamento.

6. SEGURANCA
Recomendamos:
- Use senhas fortes
- Faca backups periodicos
- Mantenha o sistema operacional atualizado
- nao compartilhe seus dados de acesso

7. CONTATO
Para duvidas sobre privacidade: ${DEVELOPER.email}
`.trim();
}

function createInstallerWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    resizable: false,
    center: true,
    title: `${APP_NAME} - Instalador`,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    frame: false,
    transparent: false,
  });

  mainWindow.loadFile(path.join(__dirname, 'installer.html'));
}

function createAppWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: APP_NAME,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    show: false,
  });

  const config = loadInstallConfig();
  if (config && config.backendPort) {
    mainWindow.loadURL(`http://localhost:${config.backendPort}`);
  } else {
    mainWindow.loadURL('http://localhost:3333');
  }

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

function startBackend(installPath, port) {
  const serverDir = installPath || path.join(__dirname, '..', '..');
  const serverPath = path.join(serverDir, 'backend', 'src', 'index.ts');

  // Tenta encontrar o executavel do backend
  const possiblePaths = [
    path.join(serverDir, 'server', 'index.js'),
    path.join(serverDir, 'backend', 'dist', 'index.js'),
    path.join(serverDir, 'backend', 'src', 'index.ts'),
  ];

  let foundPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  if (!foundPath) {
    console.error('Backend nao encontrado');
    return null;
  }

  const dataDir = getDataDir();
  const dbPath = path.join(dataDir, 'database', 'contaflow.db');

  const env = {
    ...process.env,
    PORT: (port || 3333).toString(),
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
    cwd: serverDir,
  });

  server.stdout.on('data', (data) => console.log(`[Backend] ${data}`));
  server.stderr.on('data', (data) => console.error(`[Backend Error] ${data}`));

  return server;
}

// IPC Handlers
ipcMain.handle('get-app-info', () => ({
  name: APP_NAME,
  version: APP_VERSION,
  developer: DEVELOPER,
  dataDir: getDataDir(),
  isInstalled: isInstalled(),
  isPortable: process.env.PORTABLE_MODE === '1',
}));

ipcMain.handle('get-terms', () => getTermsOfUse());
ipcMain.handle('get-privacy', () => getPrivacyPolicy());

ipcMain.handle('select-install-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Selecionar pasta de instalacao',
    properties: ['openDirectory', 'createDirectory'],
    defaultPath: path.join('C:', 'Program Files', APP_NAME),
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('run-install', async (event, config) => {
  try {
    const installPath = config.installPath || path.join('C:', 'Program Files', APP_NAME);

    // Cria a pasta de instalacao
    if (!fs.existsSync(installPath)) {
      fs.mkdirSync(installPath, { recursive: true });
    }

    // Cria as pastas internas de dados
    const dataDir = path.join(installPath, DATA_FOLDER_NAME);
    const subdirs = ['database', 'logs', 'backups', 'config', 'certificates', 'attachments'];
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    subdirs.forEach((sub) => {
      const subPath = path.join(dataDir, sub);
      if (!fs.existsSync(subPath)) fs.mkdirSync(subPath, { recursive: true });
    });

    // Salva a configuracao criptografada
    const installConfig = {
      installPath,
      installedAt: new Date().toISOString(),
      version: APP_VERSION,
      backendPort: config.port || 3333,
      termsAccepted: config.termsAccepted,
      privacyAccepted: config.privacyAccepted,
    };

    const configPath = path.join(dataDir, 'config', 'install.json');
    fs.writeFileSync(configPath, encrypt(JSON.stringify(installConfig)), 'utf8');

    // Copia o database se nao existir
    const dbSource = path.join(__dirname, '..', '..', 'backend', 'prisma', 'data', 'contaflow.db');
    const dbDest = path.join(dataDir, 'database', 'contaflow.db');
    if (fs.existsSync(dbSource) && !fs.existsSync(dbDest)) {
      fs.copyFileSync(dbSource, dbDest);
    }

    // Cria atalho na area de trabalho
    try {
      const desktopPath = app.getPath('desktop');
      const shortcutPath = path.join(desktopPath, `${APP_NAME}.lnk`);
      // Nota: criacao de atalho .lnk requer biblioteca adicional
      // Por agora, cria um .bat como alternativa
      const batContent = `@echo off\nstart "" "${path.join(installPath, 'ContaFlow.exe')}"`;
      fs.writeFileSync(path.join(desktopPath, `${APP_NAME}.bat`), batContent);
    } catch (e) {
      console.error('Erro ao criar atalho:', e);
    }

    return { success: true, installPath, dataDir };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('start-app', async (event, config) => {
  try {
    installDir = config?.installPath;
    const port = config?.port || 3333;

    serverProcess = startBackend(installDir, port);

    // Aguarda o servidor iniciar
    await new Promise((resolve) => setTimeout(resolve, 3000));

    createAppWindow();
    mainWindow.on('closed', () => {
      if (serverProcess) serverProcess.kill();
      mainWindow = null;
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

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
    defaultPath: `contaflow-backup-${new Date().toISOString().slice(0, 10)}.zip`,
    filters: [{ name: 'Backup', extensions: ['zip'] }],
  });
  if (result.canceled) return null;

  const dataDir = getDataDir();
  // Cria backup simples copiando o database
  const dbPath = path.join(dataDir, 'database', 'contaflow.db');
  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, result.filePath);
    return { success: true, path: result.filePath };
  }
  return { success: false, error: 'Database nao encontrado' };
});

app.whenReady().then(() => {
  ensureDataDir();

  if (isInstalled()) {
    // Ja instalado - inicia direto
    const config = loadInstallConfig();
    serverProcess = startBackend(config?.installPath, config?.backendPort || 3333);
    setTimeout(() => {
      createAppWindow();
    }, 3000);
  } else {
    // Primeira vez - mostra instalador
    createInstallerWindow();
  }
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

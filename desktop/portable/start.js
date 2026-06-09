const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const PORT = 3333;
const BROWSER_URL = `http://localhost:${PORT}`;

// Verificar se o servidor ja esta rodando
function checkServer() {
  return new Promise((resolve) => {
    http.get(BROWSER_URL, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Aguardar o servidor iniciar
async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await checkServer()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

// Abrir navegador padrao
function openBrowser(url) {
  const platform = process.platform;
  let command;

  switch (platform) {
    case 'win32':
      command = `start ${url}`;
      break;
    case 'darwin':
      command = `open ${url}`;
      break;
    default:
      command = `xdg-open ${url}`;
  }

  exec(command, (error) => {
    if (error) {
      console.error('Erro ao abrir navegador:', error);
    }
  });
}

// Iniciar servidor
function startServer() {
  const serverPath = path.join(__dirname, 'server', 'index.js');

  if (!fs.existsSync(serverPath)) {
    console.error('Servidor nao encontrado:', serverPath);
    process.exit(1);
  }

  const server = spawn('node', [serverPath], {
    env: { ...process.env, PORT: PORT.toString() },
    stdio: 'inherit',
  });

  server.on('error', (error) => {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  });

  return server;
}

// Main
async function main() {
  console.log('ContaFlow - Modo Portatil');
  console.log('========================');
  console.log('');

  if (await checkServer()) {
    console.log('Servidor ja esta rodando. Abrindo navegador...');
    openBrowser(BROWSER_URL);
    return;
  }

  console.log('Iniciando servidor...');
  const server = startServer();

  console.log('Aguardando servidor iniciar...');
  const started = await waitForServer();

  if (started) {
    console.log('Servidor iniciado com sucesso!');
    console.log(`Abrindo navegador em ${BROWSER_URL}`);
    openBrowser(BROWSER_URL);
  } else {
    console.error('Falha ao iniciar servidor');
    server.kill();
    process.exit(1);
  }

  process.on('SIGINT', () => {
    console.log('\nEncerrando...');
    server.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    server.kill();
    process.exit(0);
  });
}

main();
import {
  app,
  BrowserWindow,
  utilityProcess,
  ipcMain,
  Menu,
  nativeImage,
  Tray,
} from 'electron';
import path from 'path';
import log from 'electron-log/main.js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'os';

let mainWindow;
log.initialize();
const __dirname = dirname(fileURLToPath(import.meta.url));
const iconPath = path.join(__dirname, 'chatbot.png');

function createTray() {
  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: 'Hide',
      click: () => {
        mainWindow.hide();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        mainWindow.removeAllListeners('close');
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Chatbot');
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: 'Chatbot',
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  //mainWindow.loadURL("http://localhost:5173"); // Load your React app
  mainWindow.loadFile('./dist/index.html');
  mainWindow.on('close', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startServer() {
  const server = utilityProcess.fork(path.join(__dirname, './server/app.js'), {
    stdio: 'pipe',
    stderr: 'pipe',
  });

  ipcMain.handle('get-system-ip-address', () => {
    const networkDetails = os.networkInterfaces();

    return networkDetails.Ethernet.find((network) => network.family === 'IPv4')
      .address;
  });

  server.on('spawn', () => {
    createWindow();
    createTray();

    log.info('server spawned');
  });

  server.stdout.on('data', (data) => {
    log.info(`Child stdout: ${data}`);
  });

  server.stderr.on('data', (data) => {
    log.error(`Child stderr: ${data}`);
  });
}

app.whenReady().then(startServer);

app.on('window-all-closed', function (event) {
  event.preventDefault();
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

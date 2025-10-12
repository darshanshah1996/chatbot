import { app, BrowserWindow, utilityProcess, ipcMain } from "electron";
import path from "path";
import log from "electron-log/main.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import os from "os";

let mainWindow;
log.initialize();
const __dirname = dirname(fileURLToPath(import.meta.url));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  mainWindow.loadURL("http://localhost:5173"); // Load your React app
  //mainWindow.loadFile("./dist/index.html");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
}

function startServer() {
  const server = utilityProcess.fork(path.join(__dirname, "./server/app.js"), {
    stdio: "pipe",
    stderr: "pipe",
  });

  ipcMain.handle("get-system-ip-address", () => {
    const networkDetails = os.networkInterfaces();

    return networkDetails.Ethernet.find((network) => network.family === "IPv4")
      .address;
  });

  server.on("spawn", () => {
    createWindow();

    log.info("server spawned");
  });

  server.stdout.on("data", (data) => {
    log.info(`Child stdout: ${data}`);
  });

  server.stderr.on("data", (data) => {
    log.error(`Child stderr: ${data}`);
  });
}

app.whenReady().then(startServer);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

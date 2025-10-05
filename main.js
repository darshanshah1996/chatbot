import { app, BrowserWindow, utilityProcess } from "electron";
import path from "path";
import log from "electron-log/main.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import os from "os";
import fs from "fs";

let mainWindow;
log.initialize();
const __dirname = dirname(fileURLToPath(import.meta.url));

function initializeServerBasePath() {
  const networkDetails = os.networkInterfaces();
  const ethernetDetails = networkDetails["Ethernet"];
  const ipv4ddress = ethernetDetails.find(
    (ethernetDetail) => ethernetDetail.family === "IPv4"
  ).address;

  const serverDetails = `export default {
    baseUrl: "http://${ipv4ddress}:3000", // ip addreess will be set at run time as per your system ip address
  };
  `;

  fs.writeFileSync("./server_config.js", serverDetails, {
    encoding: "utf-8",
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  //mainWindow.loadURL("http://localhost:5173"); // Load your React app
  mainWindow.loadFile("./dist/index.html");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

function startServer() {
  const server = utilityProcess.fork(path.join(__dirname, "./server/app.js"), {
    stdio: "pipe",
    stderr: "pipe",
  });

  server.on("spawn", () => {
    initializeServerBasePath();
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

app.on("ready", startServer);

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

import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("electronAPI", {
  getSystemIPAddress: () => ipcRenderer.invoke("get-system-ip-address"),
});

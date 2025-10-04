import fs from "fs";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const configFolder = "D://Chatbot";
const configFile = "config.json";
const __dirname = dirname(fileURLToPath(import.meta.url));
const configFilePath = path.join(configFolder, configFile);

(() => {
  if (!fs.existsSync(configFilePath)) {
    const configFileSource = path.join(__dirname, `../data/${configFile}`);
    if (!fs.existsSync(configFolder)) {
      fs.mkdirSync(configFolder);
    }

    fs.copyFileSync(configFileSource, configFilePath);
  }
})();

export function loadAppConfig() {
  return JSON.parse(fs.readFileSync(configFilePath));
}

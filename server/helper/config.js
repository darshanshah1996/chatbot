import fs from 'fs';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { indexAppShortcuts } from './index_app_shortcuts.js';

const configFolder = 'D://Chatbot';
const configFile = 'config.json';
const shortcutFile = 'shortcuts.json';
const __dirname = dirname(fileURLToPath(import.meta.url));
const configFilePath = path.join(configFolder, configFile);
const shortcutFilePath = path.join(configFolder, shortcutFile);

(() => {
  if (!fs.existsSync(configFilePath)) {
    const configFileSource = path.join(__dirname, `../data/${configFile}`);

    if (!fs.existsSync(configFolder)) {
      fs.mkdirSync(configFolder);
    }

    fs.copyFileSync(configFileSource, configFilePath);
  }

  indexAppShortcuts();
})();

export function loadAppConfig() {
  try {
    return JSON.parse(fs.readFileSync(configFilePath));
  } catch (error) {
    console.error('Error loading app config:', error);
  }
}

export function loadAppShortcuts() {
  try {
    return JSON.parse(fs.readFileSync(shortcutFilePath));
  } catch (error) {
    console.error('Error loading app shortcuts:', error);
  }
}

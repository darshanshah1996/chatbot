import childProcess from 'child_process';
import path from 'path';

import { loadAppConfig, loadAppShortcuts } from '../helper/config.js';

const appConfig = loadAppConfig();

export default class LaunchApplication {
  async executeCommand(command) {
    return new Promise((resolve) => {
      const child = childProcess.spawn(`"${command}"`, {
        shell: true,
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      });

      child.on('error', (error) => {
        console.log(error);
        resolve(false);
      });

      child.unref();

      resolve(true);
    });
  }

  async getAppShortcutPath(appName) {
    const shortcutList = loadAppShortcuts();

    const appNameFormList =
      Object.keys(shortcutList).find((app) => app === appName) ??
      Object.keys(shortcutList).find((app) => app.includes(appName));

    return { appPath: shortcutList[appNameFormList], name: appNameFormList };
  }

  async _call(appName) {
    try {
      appName = appName.toLowerCase();

      const applicationDetails = appConfig.appAlias[appName];

      if (Object.hasOwn(appConfig.appAlias, appName)) {
        appName = applicationDetails.name;

        if (applicationDetails.preRequisite) {
          const preRequisiteApp = appConfig.appAlias[
            applicationDetails.preRequisite
          ]
            ? appConfig.appAlias[applicationDetails.preRequisite].name
            : applicationDetails.preRequisite;

          await this._call(preRequisiteApp);
        }
      }

      const { appPath, name: appNameFormList } =
        await this.getAppShortcutPath(appName);

      if (!appPath) {
        return `Application ${appNameFormList ?? appName} not found.\n\n`;
      }

      const result = await this.executeCommand(appPath.replace('//', '\\'));

      if (result) {
        return `Application ${appNameFormList ?? appName} launched successfully.\n\n`;
      } else {
        return `Application ${appNameFormList ?? appName} launch failed.\n\n`;
      }
    } catch (error) {
      console.error(error);

      return `Something went wrong.`;
    }
  }
}

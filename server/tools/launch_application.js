import childProcess from 'child_process';
import path from 'path';
import os from 'os';

import { loadAppConfig } from '../helper/config.js';

const appConfig = loadAppConfig();
const appBasePath = path.join(os.homedir(), 'Desktop');

export default class LaunchApplication {
  async executeCommand(command) {
    return new Promise((resolve) => {
      const child = childProcess.spawn(command, {
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

  async _call(appName) {
    try {
      appName = appName.toLowerCase();

      console.log(appName);

      const applicationDetails = appConfig.appAlias[appName];

      if (applicationDetails === undefined) {
        console.log(`Application ${appName} not found in alias list.`);
      } else {
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

      const result = await this.executeCommand(
        `"${appBasePath}\/${appName}".lnk`,
      );

      if (result) {
        return `Application ${appName} launched successfully.\n\n`;
      } else {
        return `Application ${appName} launch failed.\n\n`;
      }
    } catch (error) {
      console.log(error);

      return `Something went wrong.`;
    }
  }
}

import { Tool } from 'langchain/tools';
import childProcess from 'child_process';

import { DDGS } from '@phukon/duckduckgo-search';
import path from 'path';
import os from 'os';

import { loadAppConfig } from './helper/config_helper.js';
import { getWebSearchResponseChain } from './chains.js';

const appConfig = loadAppConfig();
const appBasePath = path.join(os.homedir(), 'Desktop');

export class LaunchApplicationUsingTool extends Tool {
  name = 'Launch Application';
  description =
    'Use this tool to launch or open an application e.g. when the user enters query such as open vs code';

  res;

  constructor(res) {
    super();
    this.res = res;
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          console.log(error);

          resolve(false);
        }

        resolve(true);
      });
    });
  }

  async _call(appName) {
    try {
      appName = appName.toLowerCase();

      const applicationDetails = appConfig.appAlias[appName];

      if (applicationDetails === undefined) {
        console.log(`Application ${appName} not found in alias list.`);
      } else {
        appName = applicationDetails.name;

        if (applicationDetails.preRequisite) {
          const result = await this.executeCommand(
            `tasklist | findstr /I "MSIAfterburner.exe"`,
          );

          if (!result) {
            const preRequisiteApp = appConfig.appAlias[
              applicationDetails.preRequisite
            ]
              ? appConfig.appAlias[applicationDetails.preRequisite].name
              : applicationDetails.preRequisite;

            await this.executeCommand(
              `"${appBasePath}\/${preRequisiteApp}".lnk`,
            );
          }
        }
      }

      setTimeout(() => {
        // Temporary patch. Occasionally the executeCommand gets stuck in process of launching application and does not return result
        this.res.write(`Application ${appName} is being launched.\n\n`);

        this.res.end();
      }, 1500);

      const result = await this.executeCommand(
        `"${appBasePath}\/${appName}".lnk`,
      );

      console.log('============== Launch Application Called=============');

      if (result) {
        this.res.write(`Application ${appName} launched successfully.\n\n`);
      } else {
        this.res.write(`Application ${appName} launch failed.\n\n`);
      }

      this.res.end();
    } catch (error) {
      console.log(error);

      this.res.end();
    }
  }
}

export class SearchWebTool extends Tool {
  name = 'Search Web';
  description =
    'Use this tool to search the web to fetch real time information';

  res;
  deviceIP;

  constructor(res, deviceIP) {
    super();
    this.res = res;
    this.deviceIP = deviceIP;
  }

  async _call(query) {
    try {
      const ddgs = new DDGS();
      const results = await ddgs.text({
        keywords: query,
        maxResults: 7,
      });

      const formattedResult = results
        .map(
          (result) =>
            `title: ${result.title}\nhref: ${result.href}\nbody: ${result.body}\n\n`,
        )
        .join('\n');

      console.log('============== Search Tool Called==============');
      console.log(formattedResult);

      const llm_chain = getWebSearchResponseChain({
        res: this.res,
        deviceIP: this.deviceIP,
      });

      return await llm_chain.invoke({
        question: query,
        context: formattedResult,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

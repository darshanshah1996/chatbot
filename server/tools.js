import { Tool } from "langchain/tools";
import childProcess from "child_process";
import fs from "fs";

const appConfig = JSON.parse(fs.readFileSync("D:\\application.json"));

export class LaunchApplicationUsingTool extends Tool {
  name = "Launch Application";
  description = "Use this tool to launch or open an application";
  #toolCalled = false;

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, (error, stdout, stderr) => {
        if (stdout) {
          resolve(true);
        }

        if (error || stderr) {
          console.log(error);

          resolve(false);
        }
      });
    });
  }

  async _call(appName) {
    console.log("Calling Launch Application Tool ");

    if (!this.#toolCalled) {
      this.#toolCalled = true;
      appName = appName.toLowerCase();

      console.log("Tool Called");

      const applicationDetails = appConfig[appName];

      if (applicationDetails === undefined) {
        console.log(`Application ${appName} not found in alias list.`);
      } else {
        appName = applicationDetails.name;

        if (applicationDetails.lauchAfterBurner) {
          const result = await this.executeCommand(
            `tasklist | findstr /I "MSIAfterburner.exe"`
          );

          if (!result) {
            await this.executeCommand(`"${appConfig.basePath}\/msi".lnk`);
          }
        }
      }

      const result = await this.executeCommand(
        `"${appConfig.basePath}\/${appName}".lnk`
      );

      if (result) {
        return `Application ${appName} launched successfully.`;
      } else {
        return `Application ${appName} failed to launch.`;
      }
    }
  }
}

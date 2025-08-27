import { Tool } from "langchain/tools";
import childProcess from "child_process";
import fs from "fs";
import { error } from "console";

const application = JSON.parse(fs.readFileSync("D:\\application.json"));

export class LaunchApplicationUsingTool extends Tool {
  name = "Launch Application";
  description = "Use this tool to launch or open an application";

  toolCalled = false;

  async executeCommand(command) {
    const result = childProcess.exec(command, (error, stdout, stderr) => {
      if (stdout) {
        return result.toString();
      }

      if (error || stderr) {
        console.log(error);

        return false;
      }
    });
  }

  async _call(appName) {
    console.log("Calling Launch Application Tool ");

    if (!this.toolCalled) {
      this.toolCalled = true;

      console.log("Tool Called");

      let app = application[appName.toLowerCase()];

      if (app === undefined) {
        console.log(`Application ${appName} not found.`);

        return;
      }

      if (app.lauchAfterBurner) {
        const result = await this.executeCommand(
          `tasklist | findstr /I "MSIAfterburner.exe"`
        );

        app = app.name;

        if (!result) {
          await this.executeCommand(`"${application.basePath}\/msi".lnk`);
        }
      }

      await this.executeCommand(`"${application.basePath}\/${app}".lnk`);
    }
  }
}

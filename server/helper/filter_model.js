import fs from "fs";

const config = JSON.parse(fs.readFileSync("D:\\application.json"));

export function getGroqFilteredModels(models) {
  const groqExcludeModels = config.excludeGroqModels;

  const groqExcludedModelsRegex = new RegExp(groqExcludeModels.join("|"), "i");

  return models.filter((model) => !groqExcludedModelsRegex.test(model));
}

export function getOllamaFilteredModels(models) {
  const ollamaExcludeModels = config.excludeOllamaModels;
  const ollamaExcludedModelsRegex = new RegExp(
    ollamaExcludeModels.join("|"),
    "i"
  );

  return models.filter((model) => !ollamaExcludedModelsRegex.test(model));
}

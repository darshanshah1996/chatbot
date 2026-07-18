import { groqModels, llmProviders } from '../data/models.js';
import { loadAppConfig } from './config_helper.js';

const appConfig = loadAppConfig();

export function getFilteredGroqModels(models) {
  const groqExcludeModels = appConfig.excludeGroqModels;

  const groqExcludedModelsRegex = new RegExp(groqExcludeModels.join('|'), 'i');

  return models.filter((model) => !groqExcludedModelsRegex.test(model));
}

export function getFilteredOllamaModels(models) {
  const ollamaExcludeModels = appConfig.excludeOllamaModels;
  const ollamaExcludedModelsRegex = new RegExp(
    ollamaExcludeModels.join('|'),
    'i',
  );

  return models.filter((model) => !ollamaExcludedModelsRegex.test(model));
}

export function getDefaultModel() {
  return {
    modelProvider: llmProviders.groq,
    name: appConfig.defaultGroqModel || groqModels.gptOSS120B,
  };
}

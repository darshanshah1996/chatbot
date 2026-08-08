import { ChatGroq } from '@langchain/groq';
import { ChatOllama } from '@langchain/ollama';

import { groqModels, llmProviders } from '../data/models.js';
import { loadAppConfig } from './config.js';
import api from '../data/api.js';

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

export function initializeModel({ modelProvider, modelName, temperature = 0 }) {
  let model;

  switch (modelProvider) {
    case llmProviders.groq:
      model = new ChatGroq({
        apiKey: api.GROQ_API_KEY,
        model: modelName,
        temperature: temperature,
      });

      break;

    case llmProviders.ollama:
      model = new ChatOllama({
        model: modelName,
        temperature: temperature,
        keepAlive: 30,
      });

      break;

    default:
      throw new Error(`Invalid service name: ${serviceName}`);
  }

  return model;
}

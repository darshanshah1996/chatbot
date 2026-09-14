import { ChatGroq } from '@langchain/groq';
import { ChatOllama } from '@langchain/ollama';
import { ChatOpenRouter } from '@langchain/openrouter';

import { groqModels, llmProviders } from '../data/models.js';
import { loadAppConfig } from './config.js';
import api from '../data/api.js';

const appConfig = loadAppConfig();

export async function getGroqModels() {
  const response = await fetch(`${api.groq.baseUrl}/models`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${api.groq.apiKey}`,
    },
  });

  const parsedResponse = await response.json();
  const models = parsedResponse['data'];
  const groqFreeModels = models.map((model) => model.id);
  const groqExcludeModels = appConfig.excludeGroqModels;
  const groqExcludedModelsRegex = new RegExp(groqExcludeModels.join('|'), 'i');

  return groqFreeModels.filter((model) => !groqExcludedModelsRegex.test(model));
}

export async function getOpenRouterModels() {
  const response = await fetch(`${api.openRouter.baseUrl}/models`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${api.openRouter.apiKey}`,
    },
  });
  const parsedResponse = await response.json();
  const models = parsedResponse['data'];
  const freeOpenRouterModels = models.reduce((modelsList, model) => {
    if (model.id.includes('free')) modelsList.push(model.id);

    return modelsList;
  }, []);

  return freeOpenRouterModels;
}

export async function getOllamaModels() {
  const response = await fetch(`${api.ollama.baseUrl}/tags`, {
    method: 'GET',
  });

  const modelsData = await response.json();
  const models = modelsData['models'];
  const ollamaModels = models.map((model) => model.name);
  const ollamaExcludeModels = appConfig.excludeOllamaModels;
  const ollamaExcludedModelsRegex = new RegExp(
    ollamaExcludeModels.join('|'),
    'i',
  );

  return ollamaModels.filter((model) => !ollamaExcludedModelsRegex.test(model));
}

export function getDefaultModel() {
  return {
    modelProvider: llmProviders.groq,
    name: appConfig.defaultGroqModel || groqModels.gptOSS120B,
  };
}

export function initializeModel({ modelProvider, modelName, temperature = 0 }) {
  let model;

  console.log(modelProvider, modelName);

  switch (modelProvider) {
    case llmProviders.groq:
      model = new ChatGroq({
        apiKey: api.groq.apiKey,
        model: modelName,
        temperature: temperature,
      });

      break;

    case llmProviders.openRouter:
      model = new ChatOpenRouter(modelName, {
        apiKey: api.openRouter.apiKey,
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

import { ConversationSummaryBufferMemory } from "langchain/memory";
import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createReactAgent, AgentExecutor } from "langchain/agents";
import { LLMChain } from "langchain/chains";
import Groq from "groq-sdk";

import { modelServices, ollamaModels, groqModels } from "./data/models.js";
import api from "./data/api.js";
import promptTemplate from "./template.js";
import { LaunchApplicationUsingTool } from "./tools.js";
import fs from "fs";

const memory = initializeMemory(modelServices.groq, groqModels.scout);
const groq = new Groq({ apiKey: api.GROPQ_API_KEY });
const parser = new StringOutputParser();

function initializeNonStreamModel(serviceName, modelName, temperature = 0) {
  let model;

  switch (serviceName) {
    case modelServices.groq:
      model = new ChatGroq({
        apiKey: api.GROPQ_API_KEY,
        model: modelName,
        temperature: temperature,
      });

      break;

    case modelServices.ollama:
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

function initializeMemory(serviceName, modelName) {
  const model = initializeNonStreamModel(serviceName, modelName, 0.6);

  return new ConversationSummaryBufferMemory({
    memoryKey: "chat_history",
    llm: model,
    maxTokenLimit: 15000,
  });
}

function initializeStreamModel(serviceName, modelName, res) {
  const callbacks = [
    {
      handleLLMNewToken(token) {
        res.write(`${token}`);
      },
      handleLLMEnd() {
        res.end();
      },
      handleLLMError(err) {
        console.error("Stream error:", err);
        res.write(`data: [ERROR]: ${err.message}\n\n`);
        res.end();
      },
    },
  ];

  let model;

  switch (serviceName) {
    case modelServices.groq:
      model = new ChatGroq({
        apiKey: api.GROPQ_API_KEY,
        model: modelName,
        streaming: true,
        callbacks: callbacks,
        temperature: 0.6,
      });

      break;

    case modelServices.ollama:
      model = new ChatOllama({
        model: modelName,
        streaming: true,
        callbacks: callbacks,
        temperature: 0.6,
        keepAlive: 30,
      });

      break;

    default:
      throw new Error(`Invalid service name: ${serviceName}`);
  }

  return model;
}

export function getCodeChain(res, modelService, modelName) {
  console.log("Initializing code chain");

  const template = PromptTemplate.fromTemplate(promptTemplate.codeTemplate);
  const model = initializeStreamModel(modelService, modelName, res);

  const chain = new LLMChain({
    llm: model,
    prompt: template,
    memory: memory,
    outputParser: parser,
  });

  return chain;
}

export function getRouterChain() {
  const template = PromptTemplate.fromTemplate(promptTemplate.routerTemplate);
  const model = initializeNonStreamModel(modelServices.groq, groqModels.scout);

  const chain = template.pipe(model).pipe(parser);

  return chain;
}

export function getGeneralChain(res, modelService, modelName) {
  const template = PromptTemplate.fromTemplate(promptTemplate.generalTemplate);
  const model = initializeStreamModel(modelService, modelName, res);

  const chain = new LLMChain({
    llm: model,
    prompt: template,
    memory: memory,
    outputParser: parser,
  });

  return chain;
}

export async function launchApplications(res) {
  const template = PromptTemplate.fromTemplate(
    promptTemplate.launchApplication
  );
  const llm = initializeStreamModel(modelServices.groq, groqModels.scout, res);

  const tools = [new LaunchApplicationUsingTool()];

  const agent = await createReactAgent({
    tools,
    llm,
    prompt: template,
  });

  const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
    returnIntermediateSteps: true,
    handleParsingErrors: true,
  });

  return agentExecutor;
}

export async function getTextFromSpeech(audioFile) {
  const transaction = await groq.audio.transcriptions.create({
    file: fs.createReadStream(`./server/uploads/${audioFile}`),
    model: groqModels.whisper,
    language: "en",
    prompt: promptTemplate.speechToText,
    response_format: "verbose_json",
  });

  fs.unlink(`./server/uploads/${audioFile}`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  return transaction.text;
}

export const routes = Object.freeze({
  ApplicationRoute: launchApplications,
  CodeRoute: getCodeChain,
  GeneralRoute: getGeneralChain,
  Default: getGeneralChain,
});

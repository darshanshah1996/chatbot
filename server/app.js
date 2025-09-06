import express from "express";
import os from "os";

import morgan from "morgan";
import multer from "multer";

import { getRouterChain, routes, getTextFromSpeech } from "./chains.js";
import { getFormattedRoutes } from "./data/route_data.js";
import api from "./data/api.js";
import {
  getGroqFilteredModels,
  getOllamaFilteredModels,
} from "./helper/filter_model.js";

const appServer = express();

console.log("=================Starting Server=================");

appServer.use(express.json());

appServer.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./server/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

appServer.use(morgan("dev"));

appServer.get("/", (req, res) => {
  res.send("Chatbot Server 1.0");
});

appServer.get("/groq-models", async (req, res) => {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${api.GROQ_API_KEY}`,
      },
    });

    if (!response.ok) res.status(500).json({ error: error.message });

    const modelsData = await response.json();
    const models = modelsData["data"];
    const groqModels = models.map((model) => model.id);

    const filteredModels = getGroqFilteredModels(groqModels);

    res.status(200).json({
      models: filteredModels,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appServer.get("/ollama-models", async (req, res) => {
  try {
    const response = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
    });

    if (!response.ok) res.status(500).json({ error: error.message });

    const modelsData = await response.json();
    const models = modelsData["models"];
    const ollamaModels = models.map((model) => model.name);

    const filteredModels = getOllamaFilteredModels(ollamaModels);

    res.status(200).json({
      models: filteredModels,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appServer.get("/user", (req, res) => {
  const userName = os.userInfo().username;

  res.status(200).json({
    userName,
  });
});

appServer.post("/chat", async (req, res) => {
  const query = req.body.query;

  console.log("======ModelDetails===========");
  const { modelService, model } = req.body.selectedModel;
  console.log(modelService, model);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const routerChain = getRouterChain();

  const route = await routerChain.invoke({
    question: query,
    routes: getFormattedRoutes(),
  });

  console.log(`=========Route ${route}===========`);

  const chain = await routes[route](res, modelService, model);

  try {
    await chain.invoke({
      question: query,
    });
  } catch (error) {
    res.write(`data: [ERROR]: ${error.message}\n\n`);
    res.end();
  }
});

const upload = multer({ storage: storage });

appServer.post(
  "/speech-to-text",
  upload.single("recording"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No audio file uploaded.");
    }

    const convertedText = await getTextFromSpeech(req.file.filename);

    res.status(200).send({ text: convertedText });
  }
);

appServer.listen(3000, () => {
  console.log("Server started on port 3000");
});

export default appServer;

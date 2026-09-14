import express from 'express';
import os from 'os';
import morgan from 'morgan';
import multer from 'multer';
import appRootPath from 'app-root-path';
import path from 'path';

import api from './data/api.js';
import {
  getGroqModels,
  getDefaultModel,
  getOpenRouterModels,
  getOllamaModels,
} from './helper/model.js';
import {
  authenticateDevice,
  validateDeviceForAllowingNetworkAccess,
} from './helper/autenticate.js';
import chat from './graph.js';

const appServer = express();
const rootPath = appRootPath.path;

const reactAppPath = path.join(rootPath, './dist');

let areOtherDevicesAllowed = false;

console.log('=================Starting Server=================');

appServer.use(express.json());

appServer.use(async (req, res, next) => {
  const deviceIPAddress = req.ip;

  const isDeviceAllowed = await authenticateDevice(
    deviceIPAddress,
    areOtherDevicesAllowed,
  );

  if (!isDeviceAllowed) {
    console.log(`blocked device with ip address ${deviceIPAddress}`);

    res.status(401).json({ error: 'Unauthorized' });
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './server/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

appServer.use(morgan('dev'));

appServer.get('/', (req, res) => {
  res.send('Chatbot Server 1');
});

appServer.get('/groq-models', async (req, res) => {
  try {
    const models = await getGroqModels();

    res.status(200).json({
      models,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appServer.get('/ollama-models', async (req, res) => {
  try {
    const models = await getOllamaModels();

    res.status(200).json({
      models,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appServer.get('/openrouter-models', async (req, res) => {
  try {
    const models = await getOpenRouterModels();

    res.status(200).json({
      models,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

appServer.get('/default-model', (req, res) => {
  res.status(200).json({
    defaultModel: getDefaultModel(),
  });
});

appServer.get('/user', (req, res) => {
  const userName = os.userInfo().username;

  res.status(200).json({
    userName,
  });
});

appServer.post('/allow-other-devices', async (req, res) => {
  if (!(await validateDeviceForAllowingNetworkAccess(req.ip)))
    return res.status(401).json({ error: 'Unauthorized' });

  areOtherDevicesAllowed = req.body.areOtherDevicesAllowed;

  res.status(200).json({
    message: 'Updated access for other devices',
  });
});

appServer.get('/allow-other-devices', async (req, res) => {
  if (!(await validateDeviceForAllowingNetworkAccess(req.ip)))
    return res.status(401).json({ error: 'Unauthorized' });

  res.status(200).json({
    areOtherDevicesAllowed,
  });
});

appServer.use('/chatbot', express.static(reactAppPath));

appServer.post('/chat', async (req, res) => {
  const query = req.body.query;

  const { modelProvider, name: modelName } = req.body.selectedModel;

  try {
    const response = await chat({
      modelProvider,
      modelName,
      deviceIP: req.ip,
      message: query,
    });

    res.status(200).json({ message: response });
  } catch (error) {
    console.log(error.message);

    const errorMessage =
      error?.error?.error?.message ?? error?.message ?? 'Internal server error';

    res.status(500).json({ error: errorMessage });
  }
});

const upload = multer({ storage: storage });

appServer.listen(3000, () => {
  console.log('Server started on port 3000');
});

export default appServer;

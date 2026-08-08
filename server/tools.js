import { tool } from '@langchain/core/tools';
import { uuidv4, z } from 'zod';

import LaunchApplication from './tools/launch_application.js';
import SearchWeb from './tools/search_web.js';

const launchApplicationTool = new LaunchApplication();
const searchWebTool = new SearchWeb();

// Define Node And Sub Graph
const openApplication = tool(
  async (applicationName) => {
    return launchApplicationTool._call(applicationName);
  },
  {
    name: 'OpenApplication',
    description:
      'Use this tool to launch or open an application e.g. when the user enters query such as open vs code or launch vs code. Pass the application name as is passed as by the user. Do not include your thoughts in your response',
    schema: z.string().describe('Name of the application to launch or open'),
  },
);

const searchWeb = tool(
  async (query) => {
    return searchWebTool._call(query);
  },
  {
    name: 'SearchWeb',
    description:
      'Use this tool to search the web to fetch real time information',
    schema: z.string().describe('Web search query as string'),
  },
);

export const tools = [openApplication, searchWeb];

import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
  MemorySaver,
  Overwrite,
  Annotation,
} from '@langchain/langgraph';
import { ToolNode, toolsCondition } from '@langchain/langgraph/prebuilt';
import { DateTime } from 'luxon';

import { initializeModel } from './helper/model.js';
import template from './template.js';
import { tools } from './tools.js';
import { PromptTemplate } from '@langchain/core/prompts';
import { getUserThreadId } from './helper/user_thread.js';

function formatConversation(messages) {
  let conversation = '';

  for (const message of messages) {
    if (message.type === 'user')
      conversation += 'User: ' + message.content + '\n\n';
    else if (message.type === 'ai')
      conversation += 'AI: ' + message.content + '\n\n';
  }

  return conversation;
}

const checkpointer = new MemorySaver();
const state = Annotation.Root({
  ...MessagesAnnotation.spec,
  summary: Annotation({
    default: () => '',
  }),
});

const chatLLM = async (state, config) => {
  const currentTime = DateTime.now().toFormat('yyyy MMMM dd hh:mm a');
  const chat_history = state.summary ?? '';
  const system_prompt = await PromptTemplate.fromTemplate(
    template.chatTemplate,
  ).invoke({
    current_date_time: currentTime,
    chat_history,
  });

  const { modelProvider, modelName } = config.configurable;
  const model = initializeModel({ modelProvider, modelName });
  const response = await model
    .bindTools(tools)
    .invoke([new SystemMessage(system_prompt.value), ...state.messages]);

  return { messages: [response] };
};

const shouldSummarizeConversation = (state, config) => {
  const messages = state.messages;

  return messages.length < 10 ? END : 'summarize';
};

const summarizeConversation = async (state, config) => {
  const messages = state.messages;
  const conversation = state.messages.slice(0, -2);
  // Summarize the conversation except the last two messages
  const updatedMessages = state.messages.slice(-2);
  const formattedConversation = formatConversation(conversation);
  const { modelProvider, modelName } = config.configurable;
  const model = initializeModel({ modelProvider, modelName });
  const system_prompt = await PromptTemplate.fromTemplate(
    template.summaryTemplate,
  ).invoke({
    conversation_history: formattedConversation,
    summary: state.summary,
  });
  const response = await model.invoke([new SystemMessage(system_prompt.value)]);

  return {
    messages: new Overwrite(updatedMessages),
    summary: response.content,
  };
};

const toolSubGraph = new StateGraph(MessagesAnnotation)
  .addNode('toolsNode', new ToolNode(tools))
  .addEdge(START, 'toolsNode')
  .addEdge('toolsNode', END)
  .compile();

const graph = new StateGraph(state)
  .addNode('chatLLM', chatLLM)
  .addNode('toolSubGraph', toolSubGraph)
  .addNode('summarize', summarizeConversation)
  .addNode('shouldSummarize', () => {})
  .addEdge(START, 'chatLLM')
  .addConditionalEdges('chatLLM', toolsCondition, {
    tools: 'toolSubGraph',
    __end__: 'shouldSummarize',
  })
  .addConditionalEdges('shouldSummarize', shouldSummarizeConversation, {
    summarize: 'summarize',
    __end__: END,
  })
  .addEdge('toolSubGraph', 'chatLLM')
  .addEdge('summarize', END)
  .compile({ checkpointer });

export default async function chat({
  modelProvider,
  modelName,
  deviceIP,
  message,
}) {
  const userThreadId = getUserThreadId(deviceIP);

  const config = {
    configurable: {
      thread_id: userThreadId,
      modelProvider,
      modelName,
    },
  };

  const result = await graph.invoke(
    {
      messages: [new HumanMessage(message)],
    },
    config,
  );

  return result.messages.at(-1).content;
}

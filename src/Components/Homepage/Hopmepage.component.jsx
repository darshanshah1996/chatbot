import { useEffect } from 'react';
import { nanoid } from 'nanoid';

import styles from './Homepage.module.css';

import Welcome from '../Welcome/Welcome.component';
import ChatMessage from '../Chat/ChatMessage/ChatMessage.component';
import * as chatServices from '../../Services/chat';
import ThinkingDots from '../Loading/Loading.component';
import ChatInput from '../Input/Input.component';
import { useContext } from 'react';
import { Menu } from 'lucide-react';
import { ChatContext } from '../../Context/ChatContext';
import { SettingsContext } from '../../Context/SettingsContext';
import Sidebar from '../Sidebar/Sidebar.component';
import {
  getDefaultModel,
  getGroqModelList,
  getOpenRouterModelList,
} from '../../Services/model';
import Toast from '../Toast/Toast.component';
import { ToastContext } from '../../Context/ToastContext';
import { areOtherDevicesAllowed } from '../../Services/settings';

export default function Homepage() {
  const { updateIsLLMGeneratingResponse, updateChatMessages, chatMessages } =
    useContext(ChatContext);
  const { setToast } = useContext(ToastContext);
  const {
    showSidebar,
    updateShowSidebar,
    selectedModel,
    setGroqModelList,
    setAllowNetworkSharing,
    setOpenRouterModelList,
  } = useContext(SettingsContext);

  useEffect(() => {
    getGroqModelList()
      .then((models) => {
        setGroqModelList(models);
      })
      .catch((error) => {
        console.log(error);

        setToast({
          message: 'Error fetching groq models',
          type: 'Error',
        });
      });

    getOpenRouterModelList()
      .then((models) => {
        setOpenRouterModelList(models);
      })
      .catch((error) => {
        console.log(error);

        setToast({
          message: 'Error fetching openrouter models',
          type: 'Error',
        });
      });

    areOtherDevicesAllowed()
      .then((allowed) => {
        setAllowNetworkSharing(allowed);
      })
      .catch((error) => {
        console.log(error);

        setToast({
          message: 'Error fetching default model',
          type: 'Error',
        });
      });
  }, []);

  const updateChatHistory = async (message) => {
    if (!message || message.length === 0) return;

    updateIsLLMGeneratingResponse(true);

    updateChatMessages((messages) => [
      ...messages,

      <ChatMessage role='user' message={message} key={nanoid()} />,

      <ThinkingDots key={nanoid()} />,
    ]);

    try {
      const llmResponse = await chatServices.queryLLM(message, selectedModel);

      updateChatMessages((messages) => {
        if (messages[messages.length - 1].type === ThinkingDots) {
          messages.pop();
        }

        return [
          ...messages,

          <ChatMessage role='llm' message={llmResponse} key={nanoid()} />,
        ];
      });
    } catch (error) {
      console.error(error);

      updateChatMessages((messages) => {
        if (messages[messages.length - 1].type === ThinkingDots) {
          messages.pop();

          messages.push(
            <ChatMessage
              role='llm'
              message='<p>Something went wrong. Check console for more info.</p>'
              key={nanoid()}
            />,
          );
        }

        return [...messages];
      });

      setToast({
        message: 'Something went wrong. Check console for more info.',
        type: 'Error',
      });
    }

    updateIsLLMGeneratingResponse(false);
  };

  return (
    <div className={`${styles.container} homepage`}>
      <Toast />
      <p className={`${styles.modelInfo}`}>
        {selectedModel && `Selected Model: ${selectedModel.name}`}
      </p>
      <button
        className={`${styles.hamburgerMenu} settings ${
          showSidebar ? 'hide' : ''
        }`}
        onClick={() => {
          updateShowSidebar(true);
        }}
      >
        <Menu color='#ffffff' />
      </button>

      {chatMessages.length !== 0 ? (
        <div className={`${styles.chatContainer} chat`}>
          {showSidebar && <Sidebar />}
          {chatMessages}
        </div>
      ) : (
        <Welcome />
      )}

      <ChatInput updateChatHistory={updateChatHistory} />
    </div>
  );
}

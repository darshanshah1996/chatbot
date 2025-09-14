import { useEffect } from "react";

import styles from "./Homepage.module.css";
import Welcome from "../Welcome/Welcome.component";
import ChatMessage from "../Chat/ChatMessage/ChatMessage.component";
import * as chatServices from "../../Services/chat";
import ThinkingDots from "../Loading/Loading.component";
import ChatInput from "../Input/Input.component";
import { useContext } from "react";
import { Menu } from "lucide-react";
import { ChatContext } from "../../Context/ChatContext";

import { SettingsContext } from "../../Context/SettingsContext";
import Sidebar from "../Sidebar/Sidebar.component";
import { getGroqModelList, getOllamaModelList } from "../../Services/model";
import Toast from "../Toast/Toast.component";
import { ToastContext } from "../../Context/ToastContext";

export default function Homepage() {
  const { updateIsLLMGeneratingResponse, updateChatMessages, chatMessages } =
    useContext(ChatContext);
  const { setToast } = useContext(ToastContext);
  const {
    showSiedbar,
    updateShowSidebar,
    selectedModel,
    setModelList,
    setOllamaModelList,
  } = useContext(SettingsContext);

  useEffect(() => {
    getGroqModelList()
      .then((models) => {
        setModelList(models);
      })
      .catch((error) => {
        console.log(error);

        setToast({
          message: "Error fetching groq models",
          type: "Error",
        });
      });

    getOllamaModelList()
      .then((models) => {
        setOllamaModelList(models);
      })
      .catch((error) => {
        console.log(error);

        setToast({
          message: "Error fetching ollama models",
          type: "Error",
        });
      });
  }, []);

  const updateChatHistory = async (message) => {
    if (!message || message.length === 0) return;

    updateIsLLMGeneratingResponse(true);

    updateChatMessages((messages) => [
      ...messages,

      <ChatMessage role="user" message={message} key={new Date().getTime()} />,

      <ThinkingDots key={messages.length} />,
    ]);

    try {
      const llmResponse = await chatServices.queryLLM(message, selectedModel);

      updateChatMessages((messages) => {
        if (messages[messages.length - 1].type === ThinkingDots) {
          messages.pop();
        }

        return [
          ...messages,

          <ChatMessage
            role="llm"
            message={llmResponse}
            key={new Date().getTime()}
          />,
        ];
      });
    } catch (error) {
      console.log(error);

      updateChatMessages((messages) => {
        if (messages[messages.length - 1].type === ThinkingDots) {
          messages.pop();
        }

        return [...messages];
      });

      setToast({
        message: "Something went wrong",
        type: "Error",
      });
    }

    updateIsLLMGeneratingResponse(false);
  };

  return (
    <div className={`${styles.container} homepage`}>
      <Toast />
      <p className={`${styles.modelInfo}`}>
        {`Current selected model: ${selectedModel.model}`}
      </p>
      <button
        className={`${styles.hamburgerMenu} settings ${
          showSiedbar ? "hide" : ""
        }`}
        onClick={() => {
          updateShowSidebar(true);
        }}
      >
        <Menu color="#ffffff" />
      </button>

      {chatMessages.length !== 0 ? (
        <div className={`${styles.chatContainer} chat`}>
          {showSiedbar && <Sidebar />}
          {chatMessages}
        </div>
      ) : (
        <Welcome />
      )}

      <ChatInput updateChatHistory={updateChatHistory} />
    </div>
  );
}

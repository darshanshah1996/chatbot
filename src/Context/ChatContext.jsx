import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [isLLMGeneratingResponse, updateIsLLMGeneratingResponse] =
    useState(false);
  const [chatMessages, updateChatMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        isLLMGeneratingResponse,
        updateIsLLMGeneratingResponse,
        chatMessages,
        updateChatMessages,
        showSidebar,
        setShowSidebar,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

import styles from "./Input.module.css";
import TextareaAutosize from "react-textarea-autosize";

import { useState, useRef, useEffect, useContext } from "react";
import { Send } from "lucide-react";
import Microphone from "./Microphone/Microphone.component";
import { ChatContext } from "../../Context/ChatContext";

export default function ChatInput({ updateChatHistory }) {
  const { isLLMGeneratingResponse } = useContext(ChatContext);
  const [queryState, updateQueryState] = useState(false);
  const inputRef = useRef(null);

  const isQueryValid = () => {
    const textarea = inputRef.current;

    if (textarea.value.length > 0) {
      updateQueryState(true);
    } else {
      updateQueryState(false);
    }
  };

  useEffect(() => {
    if (!isLLMGeneratingResponse) {
      inputRef.current.focus();
    }
  }, [isLLMGeneratingResponse]);

  function chatWithLLM() {
    const query = inputRef.current.value.trim();

    if (query.length === 0) return;

    updateChatHistory(inputRef.current.value);

    inputRef.current.value = "";

    updateQueryState(false);
  }

  return (
    <div
      className={`flex items-center bg-[#2a2a2a] rounded-xl px-4 py-2 shadow-md ${styles.container}`}
      onKeyUp={(e) => {
        if (!e.shiftKey && e.key === "Enter") {
          chatWithLLM();
        }
      }}
    >
      <TextareaAutosize
        type="text"
        placeholder="Ask me anything..."
        className={`flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none ${
          styles.query
        } ${isLLMGeneratingResponse ? "disabled" : ""}`}
        id="query"
        ref={inputRef}
        disabled={isLLMGeneratingResponse}
        onChange={isQueryValid}
      />

      <button
        className={`ml-2 text-blue-400 hover:text-blue-600 transition ${
          !queryState ? styles.disable : ""
        }`}
        tabIndex={0}
        onClick={chatWithLLM}
        disabled={!queryState}
      >
        <Send className="w-5 h-5" />
      </button>
      {/* <Microphone updateChatHistory={updateChatHistory} /> */}
    </div>
  );
}

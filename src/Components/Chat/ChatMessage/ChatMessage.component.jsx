import React, { useEffect, useRef } from "react";
import styles from "./ChatMessage.module.css";
import ReactHighlightSyntax from "react-highlight-syntax";
import ReactDOM from "react-dom/client";
import language from "../../../Data/language";

function formatCode(code) {
  return code.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
}

export default React.memo(({ message, role }) => {
  const codeRef = useRef();

  useEffect(() => {
    if (role === "llm") {
      console.log(message);
      const nodes = document.querySelectorAll("SYNTAXHIGHLIGHTER");

      for (const node of nodes) {
        if (!node.classList.contains("format-code")) {
          node.classList.add("format-code");
          const codeSnippet = formatCode(node.innerHTML.trim());
          const codeLanguage =
            language[node.getAttribute("language").toLowerCase()];
          const root = ReactDOM.createRoot(node);

          root.render(
            <ReactHighlightSyntax
              language={codeLanguage}
              theme={"Base16Darcula"}
              copy={true}
              copyBtnTheme={"Dark"}
            >
              {`${codeSnippet}`}
            </ReactHighlightSyntax>
          );
        }
      }

      codeRef.current.style.display = "block";
    }

    codeRef.current.style.display = "block";

    document.querySelector("div.chat").scrollTop =
      document.querySelector("div.chat").scrollHeight;
  });

  return (
    <div
      className={`${styles.container} chat-message ${
        role === "llm" ? styles.llm : styles.user
      } `}
    >
      <div
        ref={codeRef}
        dangerouslySetInnerHTML={{ __html: message }}
        style={{ display: "none" }}
      ></div>
    </div>
  );
});

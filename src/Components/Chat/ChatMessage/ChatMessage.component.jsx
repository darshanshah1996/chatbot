import { Clipboard, Check } from "lucide-react";

import React, { useEffect, useRef } from "react";
import styles from "./ChatMessage.module.css";
import ReactDOM from "react-dom/client";
import language from "../../../Data/language";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

async function copyToClipboard(text, ref) {
  try {
    await navigator.clipboard.writeText(text);
    const button = ReactDOM.createRoot(ref.target.parentNode);

    button.render(<Check color="#109E10" />);

    setTimeout(() => {
      button.render(<Clipboard />);
    }, 500);

    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Could not copy text: ", err);
  }
}

export default React.memo(({ message, role }) => {
  const codeRef = useRef();
  const codeSnippetList = [];

  if (role === "llm") {
    message.split(/<\/SYNTAXHIGHLIGHTER>/).forEach((entry) => {
      let snippet = entry.match(/<SYNTAXHIGHLIGHTER .*>(.*)/s);

      if (snippet !== null) {
        codeSnippetList.push(snippet[0].replace(/<SYNTAXHIGHLIGHTER .*>/, ""));
      }
    });
  }

  useEffect(() => {
    if (role === "llm") {
      console.log(message);
      console.log(codeSnippetList);

      const nodes = Array.from(
        document.querySelectorAll("SYNTAXHIGHLIGHTER:not(.format-code)")
      );

      for (const [index, node] of nodes.entries()) {
        if (!node.classList.contains("format-code")) {
          node.classList.add("format-code");
          const codeSnippet = codeSnippetList[index];
          const codeLanguage =
            language[node.getAttribute("language").toLowerCase()];
          const root = ReactDOM.createRoot(node);

          root.render(
            <div className={`${styles.codeSnippet}`}>
              <SyntaxHighlighter language={codeLanguage} style={materialDark}>
                {`${codeSnippet}`}
              </SyntaxHighlighter>
              <div className={`${styles.copyToClipboard}`}>
                <button
                  title="Copy to Clipboard"
                  onClick={async (e) => {
                    await copyToClipboard(codeSnippet, e);
                  }}
                >
                  <Clipboard />
                </button>
              </div>
            </div>
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

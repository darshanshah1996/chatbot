import { Clipboard, Check } from "lucide-react";

import React, { useEffect, useRef } from "react";
import styles from "./ChatMessage.module.css";
import ReactDOM from "react-dom/client";
import language from "../../../Data/language";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

async function copyToClipboard(text, ref) {
  try {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      console.log("Copying using lecay method");

      const textarea = document.createElement("textarea");

      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    const button = ReactDOM.createRoot(ref.target.parentNode);

    button.render(<Check color="#109E10" />);

    setTimeout(() => {
      button.render(<Clipboard />);
    }, 1500);
  } catch (err) {
    console.error("Could not copy text: ", err);
  }
}

export default React.memo(({ message, role }) => {
  const codeRef = useRef();
  const codeSnippetList = [];
  let messagePurified;

  if (role === "llm") {
    messagePurified = message.replace(/<script>/g, "<>");

    message.split(/<\/SYNTAXHIGHLIGHTER>/).forEach((entry) => {
      const codeSnippet = entry.match(/<SYNTAXHIGHLIGHTER .*>(.*)/s);

      if (codeSnippet !== null) {
        codeSnippetList.push(
          codeSnippet[0].replace(/<SYNTAXHIGHLIGHTER .*>[\r\n]/, "").trimEnd()
        );
      }
    });
  }

  useEffect(() => {
    if (role === "llm") {
      const codeSnippetNodesList = Array.from(
        document.querySelectorAll("SYNTAXHIGHLIGHTER:not(.format-code)")
      );

      for (const [index, codeSnippetNode] of codeSnippetNodesList.entries()) {
        codeSnippetNode.classList.add("format-code");
        const codeSnippet = codeSnippetList[index];
        const codeLanguage =
          language[codeSnippetNode.getAttribute("language").toLowerCase()];
        const codeSnippetNodeRef = ReactDOM.createRoot(codeSnippetNode);

        codeSnippetNodeRef.render(
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

      codeRef.current.style.display = "block";
    }

    document.querySelector("div.chat").scrollTop =
      document.querySelector("div.chat").scrollHeight;
  });

  return (
    <div
      className={`${styles.container} chat-message ${
        role === "llm" ? styles.llm : styles.user
      } `}
    >
      {role === "llm" && (
        <div
          ref={codeRef}
          dangerouslySetInnerHTML={{ __html: messagePurified }}
          style={{ display: "none" }}
        ></div>
      )}
      {role === "user" && <p>{message}</p>}
    </div>
  );
});

/**    import React, { useRef } from 'react';

    const CopyButton = ({ text }) => {
      const textareaRef = useRef(null);

      const handleCopy = () => {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        // Move it off‑screen
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        // Select the text
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        // Execute the copy command
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          alert('Copied to clipboard!');
        } else {
          alert('Copy failed. Please copy manually.');
        }
      };

      return (
        <button onClick={handleCopy}>Copy</button>
      );
    };

    export default CopyButton; */

import styles from "./Microphone.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { speechToText } from "../../../Services/chat";
import { ChatContext } from "../../../Context/ChatContext";

export default React.memo(({ updateChatHistory }) => {
  console.log("Microphone intialized");

  const { isLLMGeneratingResponse } = useContext(ChatContext);

  const recordButton = useRef(null);

  let recording = false;
  let audioChunks = [];
  let mediaRecorder;

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
    })
    .catch((err) => {
      console.log(err);
    });

  function record() {
    if (recording) {
      recordButton.current.classList.remove(styles.active);

      recordButton.current.disabled = true;

      recording = false;

      mediaRecorder.stop();

      setTimeout(async () => {
        console.log(audioChunks.length);
        const blobObj = new Blob(audioChunks, { type: "audio/webm" });
        const file = new File([blobObj], "recording.webm", {
          type: "audio/webm",
        });

        updateChatHistory(await speechToText(file));

        audioChunks = [];

        recordButton.current.disabled = false;
      }, 350);
    } else {
      recordButton.current.classList.add(styles.active);
      recording = true;

      mediaRecorder.start();
    }
  }

  return (
    <>
      <button
        ref={recordButton}
        onClick={record}
        className={`${styles.microPhone} ${
          isLLMGeneratingResponse ? "disabled" : ""
        }`}
        disabled={isLLMGeneratingResponse}
      >
        <FontAwesomeIcon icon={faMicrophone} className={styles.icon} />
      </button>
    </>
  );
});

import { useState, useEffect } from "react";
import styles from "./Model.module.css";

import ModelDropdown from "./ModelDropdown/ModelDropdown.component";

import { getGroqModelList } from "../../../Services/model";
import modelData from "../../../Data/model_data";

export default function Model({ updatedSelectedModel, selectedModel }) {
  const [showModelSelectorDropdown, setShowModelSelectorDropdown] =
    useState(false);
  const [modelList, setModelList] = useState([]);

  useEffect(() => {
    getGroqModelList().then((models) => {
      setModelList(models);
    });
  }, []);

  function updateModel(modelName) {
    if (modelList.includes(modelName)) {
      updatedSelectedModel({
        modelProvider: modelData.llmProviders.groq,
        name: modelName,
      });
    } else {
      updatedSelectedModel({
        modelProvider: modelData.ollamaService,
        name: modelName,
      });
    }
  }

  return (
    <div className={`${styles.container} model-selector`}>
      {showModelSelectorDropdown && (
        <ModelDropdown
          modelList={modelList}
          updateModel={updateModel}
          selectedModel={selectedModel}
        />
      )}
      <button
        onClick={() => {
          setShowModelSelectorDropdown((currentState) => !currentState);
        }}
        className={`${styles.toggleModelSelectorButton}`}
      >
        <Brain color="#ffffff" />
      </button>
    </div>
  );
}

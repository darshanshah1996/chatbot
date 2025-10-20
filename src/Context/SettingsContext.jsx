import { createContext, useState } from "react";
import modelData from "../Data/model_data";

export const SettingsContext = createContext({});

export const SettingsContextProvider = ({ children }) => {
  const [showSiedbar, updateShowSidebar] = useState(false);
  const [groqModelList, setGroqModelList] = useState([]);
  const [ollamaModelList, setOllamaModelList] = useState([]);
  const [selectedModel, updatedSelectedModel] = useState({
    modelProvider: modelData.llmProviders.groq,
    name: modelData.defaultModel,
  });
  const [includeOllamaModels, setIncludeOllamaModels] = useState(false);
  const [allowNetworkSharing, setAllowNetowrkSharing] = useState(false);

  return (
    <SettingsContext.Provider
      value={{
        showSiedbar,
        updateShowSidebar,
        selectedModel,
        updatedSelectedModel,
        groqModelList,
        setGroqModelList,
        ollamaModelList,
        setOllamaModelList,
        includeOllamaModels,
        setIncludeOllamaModels,
        allowNetworkSharing,
        setAllowNetowrkSharing,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

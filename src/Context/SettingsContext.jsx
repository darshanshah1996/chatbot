import { createContext, useState } from "react";
import modelData from "../Data/model_data";

export const SettingsContext = createContext({});

export const SettingsContextProvider = ({ children }) => {
  const [showSiedbar, updateShowSidebar] = useState(false);
  const [modelList, setModelList] = useState([]);
  const [ollamaModelList, setOllamaModelList] = useState([]);
  const [selectedModel, updatedSelectedModel] = useState({
    modelService: modelData.groqService,
    model: modelData.defaultModel,
  });

  return (
    <SettingsContext.Provider
      value={{
        showSiedbar,
        updateShowSidebar,
        selectedModel,
        updatedSelectedModel,
        setModelList,
        modelList,
        ollamaModelList,
        setOllamaModelList,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

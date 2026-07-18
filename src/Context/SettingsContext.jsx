import { createContext, useEffect, useState } from 'react';
import modelData from '../Data/model_data';
import { getDefaultModel } from '../Services/model';

export const SettingsContext = createContext({});

export const SettingsContextProvider = ({ children }) => {
  const [showSidebar, updateShowSidebar] = useState(false);
  const [groqModelList, setGroqModelList] = useState([]);
  const [ollamaModelList, setOllamaModelList] = useState([]);
  const [selectedModel, updatedSelectedModel] = useState();
  const [includeOllamaModels, setIncludeOllamaModels] = useState(false);
  const [allowNetworkSharing, setAllowNetworkSharing] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [defaultGroqModel, setDefaultGroqModel] = useState('');

  useEffect(() => {
    console.log('Fetching Model Data');

    getDefaultModel()
      .then((model) => {
        setDefaultGroqModel(model);
        updatedSelectedModel(model);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        showSidebar,
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
        setAllowNetworkSharing,
        dialogMessage,
        setDialogMessage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

import { useContext, useRef, useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { SettingsContext } from '../../../Context/SettingsContext';
import styles from './ModelDropdown.module.css';
import modelData from '../../../Data/model_data';
import { ToastContext } from '../../../Context/ToastContext';
import Tooltip from '../../Tooltip/Tooltip.component';
import { getOllamaModelList } from '../../../Services/model';
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog.component';

export default function ModelDropdown() {
  const {
    selectedModel,
    updatedSelectedModel,
    updateShowSidebar,
    groqModelList,
    ollamaModelList,
    includeOllamaModels,
    setIncludeOllamaModels,
    setOllamaModelList,
  } = useContext(SettingsContext);
  const { setToast } = useContext(ToastContext);
  const { setDialogMessage } = useContext(SettingsContext);
  const includeOllamaCheckbox = useRef(null);
  const modelSelectionDropdown = useRef(null);
  const [selection, setSelection] = useState(selectedModel.name);

  async function updateOllamaModels(consent) {
    const isOllamaCheckboxChecked = includeOllamaCheckbox.current.checked;
    setDialogMessage('');

    if (consent === false) {
      includeOllamaCheckbox.current.checked =
        !includeOllamaCheckbox.current.checked;

      return;
    }

    if (isOllamaCheckboxChecked) {
      try {
        const ollamaModelList = await getOllamaModelList();

        setOllamaModelList(ollamaModelList);
        setIncludeOllamaModels(true);
        setToast({
          message: 'Model list updated successfully',
          type: 'Success',
        });
      } catch (error) {
        console.log(error);

        includeOllamaCheckbox.current.checked = false;

        setToast({
          message: 'Error fetching ollama models',
          type: 'Error',
        });
      }
    } else {
      includeOllamaCheckbox.current.checked = false;

      setOllamaModelList([]);
      setIncludeOllamaModels(false);

      if (!groqModelList.includes(selection)) {
        updatedSelectedModel({
          modelProvider: modelData.llmProviders.groq,
          name: modelData.defaultModel,
        });
        setSelection(modelData.defaultModel);
        updateShowSidebar(false);
      }
      setToast({
        message: 'Model list updated successfully',
        type: 'Success',
      });
    }
  }

  async function toggleOllamaSelection() {
    const isOllamaCheckboxChecked = includeOllamaCheckbox.current.checked;

    if (isOllamaCheckboxChecked) {
      setDialogMessage(
        'Do you want to include Ollama Models? Please ensure Ollama is running on the system before proceeding.',
      );
    } else {
      setDialogMessage(
        'Do you want to exclude Ollama Models? If the current selected model is an Ollama model, it will be reset to Groq Default Model.',
      );
    }
  }

  function updateModel(modelName) {
    if (groqModelList.includes(modelName)) {
      updatedSelectedModel({
        modelProvider: modelData.llmProviders.groq,
        name: modelName,
      });
    } else {
      updatedSelectedModel({
        modelProvider: modelData.llmProviders.ollama,
        name: modelName,
      });
    }

    updateShowSidebar(false);
    setToast({
      message: 'Model updated successfully',
      type: 'Success',
    });
  }

  return (
    <div className={`${styles.container} model-selector`}>
      <FormControl
        sx={{
          m: 1,
          '& .MuiFormLabel-root': {
            color: 'white !important',
          },
          '& .MuiSelect-select': {
            color: 'white',
            width: '200px !important',
          },
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#535050ff !important',
          },
          '& .MuiInputBase-root': {
            width: '70% !important',
          },
        }}
      >
        <InputLabel htmlFor='grouped-select'>Model</InputLabel>
        <Select
          onChange={(e) => {
            setSelection(e.target.value);
          }}
          ref={modelSelectionDropdown}
          defaultValue={selectedModel.name}
          id='grouped-select'
          label='Model'
        >
          {groqModelList.length > 0 && <ListSubheader>Groq</ListSubheader>}
          {groqModelList.length > 0 &&
            groqModelList.map((model) => (
              <MenuItem value={model}>{model}</MenuItem>
            ))}

          {ollamaModelList.length > 0 && <ListSubheader>Ollama</ListSubheader>}
          {ollamaModelList.length > 0 &&
            ollamaModelList.map((model) => (
              <MenuItem value={model}>{model}</MenuItem>
            ))}
        </Select>
      </FormControl>
      <section className={`${styles.includeOllamaCheckbox}`}>
        <input
          type='checkbox'
          id='ollamaCheckbox'
          ref={includeOllamaCheckbox}
          defaultChecked={includeOllamaModels}
          onChange={toggleOllamaSelection}
        />
        <label htmlFor='ollamaCheckbox'>Include Ollama models</label>
        <Tooltip text='Ensure Ollama is running on your system before enabling this option' />
      </section>
      <button
        onClick={() => {
          updateModel(selection);
        }}
        disabled={selectedModel.name === selection}
        className={styles.saveChangesButton}
        style={
          selectedModel.name === selection
            ? { opacity: 0.5, cursor: 'not-allowed' }
            : {}
        }
      >
        Save
      </button>
      <ConfirmDialog callBackFunction={updateOllamaModels} />
    </div>
  );
}

import { useContext, useRef } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { SettingsContext } from "../../../Context/SettingsContext";
import styles from "./ModelDropdown.module.css";
import modelData from "../../../Data/model_data";
import { ToastContext } from "../../../Context/ToastContext";
import Tooltip from "../../Tooltip/Tooltip.component";
import { getOllamaModelList } from "../../../Services/model";

export default function ModelDropdown() {
  const {
    selectedModel,
    updatedSelectedModel,
    updateShowSidebar,
    modelList,
    ollamaModelList,
    includeOllamaModels,
    setIncludeOllamaModels,
    setOllamaModelList,
  } = useContext(SettingsContext);
  const { setToast } = useContext(ToastContext);
  const includeOllamaCheckbox = useRef(null);
  const modelSelectionDropdown = useRef(null);
  let selection = selectedModel.model;

  function updateModel(modelName) {
    const isOllamaCheckboxChecked = includeOllamaCheckbox.current.checked;

    if (modelName !== selectedModel.model) {
      if (modelList.includes(modelName)) {
        updatedSelectedModel({
          modelService: modelData.groqService,
          model: modelName,
        });
      } else {
        updatedSelectedModel({
          modelService: modelData.ollamaService,
          model: modelName,
        });
      }
      updateShowSidebar(false);
      setToast({
        message: "Model updated successfully",
        type: "Success",
      });
    }

    if (isOllamaCheckboxChecked !== includeOllamaModels) {
      if (isOllamaCheckboxChecked) {
        getOllamaModelList()
          .then((models) => {
            setOllamaModelList(models);
            setIncludeOllamaModels(isOllamaCheckboxChecked);
            setToast({
              message: "Model list updated successfully",
              type: "Success",
            });
          })
          .catch((error) => {
            console.log(error);

            includeOllamaCheckbox.current.checked = false;

            setToast({
              message: "Error fetching ollama models",
              type: "Error",
            });
          });
      } else {
        setOllamaModelList([]);
        setIncludeOllamaModels(isOllamaCheckboxChecked);
        if (!modelList.includes(modelName)) {
          updatedSelectedModel({
            modelService: modelData.groqService,
            model: modelData.defaultModel,
          });
          selection = modelData.defaultModel;
          updateShowSidebar(false);
        }
        setToast({
          message: "Model list updated successfully",
          type: "Success",
        });
      }
    }
  }

  return (
    <div className={`${styles.container} model-selector`}>
      <FormControl
        sx={{
          m: 1,
          "& .MuiFormLabel-root": {
            color: "white !important",
          },
          "& .MuiSelect-select": {
            color: "white",
            width: "200px !important",
          },
          "& .MuiSvgIcon-root": {
            color: "white",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#535050ff !important",
          },
          "& .MuiInputBase-root": {
            width: "70% !important",
          },
        }}
      >
        <InputLabel htmlFor="grouped-select">Model</InputLabel>
        <Select
          onChange={(e) => {
            selection = e.target.value;
          }}
          ref={modelSelectionDropdown}
          defaultValue={selectedModel.model}
          id="grouped-select"
          label="Model"
        >
          {modelList.length > 0 && <ListSubheader>Groq</ListSubheader>}
          {modelList.length > 0 &&
            modelList.map((model) => (
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
          type="checkbox"
          id="ollamaCheckbox"
          ref={includeOllamaCheckbox}
          defaultChecked={includeOllamaModels}
        />
        <label htmlFor="ollamaCheckbox">Include Ollama models</label>
        <Tooltip text="Ensure Ollama is running on your system before enabling this option" />
      </section>
      <button
        onClick={() => {
          updateModel(selection);
        }}
        className={styles.saveChanges}
      >
        Save
      </button>
    </div>
  );
}

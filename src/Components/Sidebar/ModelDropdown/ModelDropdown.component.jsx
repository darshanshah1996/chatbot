import { useContext } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListSubheader from "@mui/material/ListSubheader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { SettingsContext } from "../../../Context/SettingsContext";
import styles from "./ModelDropdown.module.css";
import modelData from "../../../Data/model_data";
import { ToastContext } from "../../../Context/ToastContext";

export default function ModelDropdown() {
  const {
    selectedModel,
    updatedSelectedModel,
    updateShowSidebar,
    modelList,
    ollamaModelList,
  } = useContext(SettingsContext);
  const { setToast } = useContext(ToastContext);
  let selection;

  function updateModel(modelName) {
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
          "& .MuiFormControl-root": {
            margin: "0px !important",
          },
        }}
      >
        <InputLabel htmlFor="grouped-select">Model</InputLabel>
        <Select
          onChange={(e) => {
            selection = e.target.value;
          }}
          defaultValue={selectedModel.model}
          id="grouped-select"
          label="Model"
        >
          {modelList && <ListSubheader>Groq</ListSubheader>}
          {modelList &&
            modelList.map((model) => (
              <MenuItem value={model}>{model}</MenuItem>
            ))}

          {ollamaModelList && <ListSubheader>Ollama</ListSubheader>}
          {ollamaModelList &&
            ollamaModelList.map((model) => (
              <MenuItem value={model}>{model}</MenuItem>
            ))}
        </Select>
      </FormControl>
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

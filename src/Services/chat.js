import axios from "axios";
import server from "../../server_config.js";

export async function queryLLM(query, selectedModel) {
  const response = await axios.post(
    `${server.baseUrl}/chat`,
    {
      query,
      selectedModel,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
    {
      responseType: "stream",
    }
  );

  return response.data;
}

export async function speechToText(audioFile) {
  const formData = new FormData();
  formData.append("recording", audioFile);

  const response = await axios.post(
    `${server.baseUrl}/speech-to-text`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.text;
}

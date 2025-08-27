import axios from "axios";
import server from "../Data/server";

export async function queryLLM(query, selectedModel) {
  try {
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
  } catch (error) {
    console.log(error);
  }
}

export async function speechToText(audioFile) {
  const formData = new FormData();
  formData.append("recording", audioFile);

  try {
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
  } catch (error) {
    console.log(error);
  }
}

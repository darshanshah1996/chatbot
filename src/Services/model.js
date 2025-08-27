import axios from "axios";
import server from "../Data/server";

export async function getGroqModelList() {
  try {
    const { data: modelList } = await axios.get(
      `${server.baseUrl}/groq-models`
    );

    return modelList.models.sort();
  } catch (error) {
    console.log(error);
  }
}

export async function getOllamaModelList() {
  try {
    const { data: modelsData } = await axios.get(
      `${server.baseUrl}/ollama-models`
    );

    return modelsData.models.sort();
  } catch (error) {
    console.log(error);
  }
}

import axios from "axios";
import server from "../Data/server";

export async function getGroqModelList() {
  const { data: modelList } = await axios.get(`${server.baseUrl}/groq-models`);

  return modelList.models.sort();
}

export async function getOllamaModelList() {
  const { data: modelsData } = await axios.get(
    `${server.baseUrl}/ollama-models`
  );

  return modelsData.models.sort();
}

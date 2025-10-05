import axios from "axios";
import server from "../../server_config.js";

export async function getGroqModelList() {
  try {
    console.log("===========base url=============");
    console.log(server.baseUrl);

    const { data: modelList } = await axios.get(
      `${server.baseUrl}/groq-models`
    );

    return modelList.models.sort();
  } catch (error) {
    if (error.response.status === 401) {
      alert("Unauthorized Device. Please contact app manager");
    }
  }
}

export async function getOllamaModelList() {
  const { data: modelsData } = await axios.get(
    `${server.baseUrl}/ollama-models`
  );

  return modelsData.models.sort();
}

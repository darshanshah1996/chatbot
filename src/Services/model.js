import axios from 'axios';
import baseUrl from './base_url';

export async function getGroqModelList() {
  const { data: modelList } = await axios.get(`${baseUrl}/groq-models`);

  return modelList.models.sort();
}

export async function getOllamaModelList() {
  const { data: modelsData } = await axios.get(`${baseUrl}/ollama-models`);

  return modelsData.models.sort();
}

export async function getDefaultModel() {
  const { data: modelData } = await axios.get(`${baseUrl}/default-model`);

  return modelData.defaultModel;
}

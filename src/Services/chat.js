import axios from 'axios';
import baseUrl from './base_url';

export async function queryLLM(query, selectedModel) {
  const response = await axios.post(
    `${baseUrl}/chat`,
    {
      query,
      selectedModel,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      responseType: 'stream',
    },
  );

  return response.data;
}

export async function speechToText(audioFile) {
  const formData = new FormData();
  formData.append('recording', audioFile);

  const response = await axios.post(`${baseUrl}/speech-to-text`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.text;
}

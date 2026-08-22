import axios from 'axios';
import baseUrl from './base_url';

export async function queryLLM(query, selectedModel) {
  try {
    const response = await axios.post(`${baseUrl}/chat`, {
      query,
      selectedModel,
    });

    return response.data.message;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      throw new Error('Error setting up request:', error.message);
    }
  }
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

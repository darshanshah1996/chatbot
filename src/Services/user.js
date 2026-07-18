import axios from 'axios';
import baseUrl from './base_url';

export async function getUserName() {
  try {
    const { data } = await axios.get(`${baseUrl}/user`);

    return data.userName;
  } catch (error) {
    console.log(error);
  }
}

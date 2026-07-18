import axios from 'axios';
import baseUrl from './base_url';

export async function updateAppAccessFromOtherDevice(areOtherDevicesAllowed) {
  const response = await axios.post(`${baseUrl}/allow-other-devices`, {
    areOtherDevicesAllowed,
  });

  return response.data.message;
}

export async function areOtherDevicesAllowed() {
  if (window?.electronAPI === undefined) return false;

  const response = await axios.get(`${baseUrl}/allow-other-devices`);

  return response.data.areOtherDevicesAllowed;
}

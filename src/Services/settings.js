import axios from "axios";
import server from "../Data/server";

export async function updateAppAccessFromOtherDevice(areOtherDevicesAllowed) {
  const response = await axios.post(`${server.baseUrl}/allow-other-devices`, {
    areOtherDevicesAllowed,
  });

  return response.data.message;
}

export async function areOtherDevicesAllowed() {
  const response = await axios.get(`${server.baseUrl}/allow-other-devices`);

  return response.data.areOtherDevicesAllowed;
}

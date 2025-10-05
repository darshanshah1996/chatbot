import axios from "axios";
import server from "../../server_config.js";

export async function getUserName() {
  try {
    const { data } = await axios.get(`${server.baseUrl}/user`);

    return data.userName;
  } catch (error) {
    console.log(error);
  }
}

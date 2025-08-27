import axios from "axios";
import server from "../Data/server";

export async function getUserName() {
  try {
    const { data } = await axios.get(`${server.baseUrl}/user`);

    return data.userName;
  } catch (error) {
    console.log(error);
  }
}

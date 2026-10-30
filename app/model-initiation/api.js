import axios from "axios";
import { baseurl } from "../config";

export async function fetchMyInit(skip,status, token) {
  try {
    const { data } = await axios.get(
      `${baseurl}/user-exam-initiation/find-my-initiation?skip=${skip}&&status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

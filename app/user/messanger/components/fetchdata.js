import { baseurl } from "@/app/config";
import { useStore } from "@/app/global/DataProvider";
import axios from "axios";
import { commonLogout } from "../../components/common";

export const fetchAllFriendsByMessage = async (token,dispatch,page=1,limit=10) => {
  try {
    const response = await axios.get(
      `${baseurl}/messanger/my-friends-by-both-message-and-profile?page=${page}&limit=${limit}&status=multiple`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // ✅ No need for `await`, Axios already resolves it
  } catch (error) {
    commonLogout(dispatch,error)
    console.error("API Fetch Error:", error.response?.data || error.message);
    throw error; // ❗ Rethrow the error to handle it properly
  }
};

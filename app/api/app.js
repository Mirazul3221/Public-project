import axios from "axios";
import { baseurl } from "../config";
import { commonLogout } from "../user/components/common";

export const myScore =async (token,dispatch)=>{
  try {
              const { data } = await axios.get(`${baseurl}/auth/get-score`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return data.totalCountQuestions
  } catch (err) {
    commonLogout(dispatch,err)
  }

}
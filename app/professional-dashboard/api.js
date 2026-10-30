import axios from "axios";
import { baseurl } from "../config";

export const myInfo = async (token) => {
  try {
    const { data } = await axios.get(`${baseurl}/auth/find`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};


export const countExamRecord = async (token) => {
  try {
    const { data } = await axios.get(`${baseurl}/user-exam-initiation/count-exam-record`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const trackRecentActivities = async (token) => {
  try {
    const { data } = await axios.get(`${baseurl}/user-exam-initiation/track-recent-activities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

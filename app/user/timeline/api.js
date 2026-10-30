import { baseurl } from "@/app/config";
import axios from "axios";

export const fetchNextPage =async (token,skip,flug,tag) => {
           const { data } = await axios.get(
             `${baseurl}/userquestions/all-friends-questions?skip=${
               skip
             }&flug=${flug}&tag=${tag}`,
             {
               headers: {
                 Authorization: `Bearer ${token}`,
               },
             }
           ); 
           return data
}
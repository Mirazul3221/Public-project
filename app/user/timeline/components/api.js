import { suburl } from "@/app/config";
import axios from "axios";

  ////////////////////////////////////////////////////////////
 export const addReaction = async (targetId,publisherData, targetType, type, token, socket) => {
     try {
          const { data } = await axios.post(
      `${suburl}/user-reaction/toggle`, { targetId,publisherData, targetType, type },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

     socket && (await socket.emit("new-notification", data));
     } catch (error) {
       console.log(error)
     }
  }
    ////////////////notification api////////////////////////
    const handleNotification = async (type) => {
      try {
        const { data } = await axios.post(
          `${baseurl}/notification/create`,
          type === "like-question"
            ? {
              readerId: feed.userId,
              question: feed.question,
              slug: question.slug,
              type,
            }
            : {
              readerId: feed.userId,
              question: feed.question,
              slug: feed.slug,
              comment: message,
              type,
            },
          {
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          }
        );
        socket && (await socket.emit("new-notification", feed.userId));
      } catch (error) {
        commonLogout(dispatch, error);
      }
    };
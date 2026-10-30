"use client";
import React, { useCallback, useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import socketContext from "./socketContext";
import { baseurl } from "@/app/config";
import axios from "axios";
import { useStore } from "@/app/global/DataProvider";
import { commonLogout } from "../components/common";
const SocketProvider = ({ children }) => {
  let mysocketUrl = "https://edu-socket.onrender.com";
 // mysocketUrl = "http://localhost:3001"; 
  const { store ,dispatch} = useStore();
  const [socket, setSocket] = useState(null);
  const [myActiveFriends, setMyActiveFriends] = useState(null);
  useEffect(() => {
    const socketInstance = io(mysocketUrl, {
      query: {
        myId: store?.userInfo?.id,
      },
    });
    setSocket(socketInstance);
    socketInstance?.emit("myUserInfo", {
      id: store?.userInfo?.id,
      name: store.userInfo?.name,
    });
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  const fetchIds = async () => {
    try {
      const { data } = await axios.get(`${baseurl}/auth/current-friends`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      return data
    } catch (error) {
      // commonLogout(dispatch, error);
    }
  };
useEffect(() => {
  const fetchAndEmit = async () => {
    try {
      const friendsId = await fetchIds();
      socket?.emit('all-friendsid', friendsId);
    } catch (err) {
      console.error('Failed to fetch friend IDs:', err);
    }
  };

  if (socket) {
    fetchAndEmit();
  }
}, [socket]);


  useEffect(() => {
    socket &&
      socket.on("onlineFriends", (res) => {
        setMyActiveFriends(res);
        console.log(res);
      });
     () => {
      socket?.off("onlineFriends");
    };
  }, [socket]);

/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////
  return (
    <socketContext.Provider value={{ socket, myActiveFriends,}}>
      {children}
    </socketContext.Provider>
  );
};


export default SocketProvider;
export const useSocket = () => {
  const socketCall = useContext(socketContext);
  return socketCall && socketCall;
};
// console.log(useSocket())
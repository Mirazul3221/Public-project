"use client";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useStore } from "@/app/global/DataProvider";
import MessageBar from "./MessageBar";
import axios from "axios";
import { baseurl } from "@/app/config";
import { useGlobalData } from "../../global/globalDataProvider.jsx";
import { useSocket } from "../../global/SocketProvider";
import { commonLogout } from "../../components/common";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const MessageBox = ({ setId, setUserDetails }) => {
  const { store} = useStore();
  const [messangerFriends, setMessangerFriends] = useState(null);
  const [loading, setLoading] = useState(false);
  const { appData } = useGlobalData();
  const containerRef = useRef(null);
  const sortedMessages = appData?.user?.sort(
    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );
  const [friends, setFriends] = useState();
  const [page, setPage] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  useEffect(() => {
    const load = () => setFriends(sortedMessages);
    load();
  }, [sortedMessages]);
  // useEffect(() => {
  //   socket && socket.on('lastMsgWithProfile',(data)=>{
  //     dispatch({type:'STORE_REMOTE_USER_PROFILE',payload:{data,id:'122'}})
  //   })
  //   return () => {
  //      socket && socket.off('lastMsgWithProfile')
  //   };
  // }, [socket]);
  const fetchFriends = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const { data } = await axios.get(
      `${baseurl}/messanger/my-friends-by-both-message-and-profile?page=${page}&limit=${limit}&status=multiple`,
      {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      }
    );

    setFriends((prev) => [...prev, ...data]);
    setPage((p) => p + 1);

    // no more data
    if (data.length < 10) {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || isLoading || !hasMore) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      fetchFriends();
    }
  };

  return (
    <div className="w-full bg-white">
      {loading ? (
        <div className="mt-4 h-[72vh] overflow-y-auto space-y-2">
          <div className="py-2 rounded-md bg-gray-300 animate-pulse px-4 flex justify-between">
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="w-10/12 space-y-2 mt-1">
              <p className="py-1 bg-white w-11/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-10/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-9/12 ml-4 rounded-3xl"></p>
            </div>
          </div>
          <div className="py-2 rounded-md bg-gray-300 animate-pulse px-4 flex justify-between">
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="w-10/12 space-y-2 mt-1">
              <p className="py-1 bg-white w-11/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-10/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-9/12 ml-4 rounded-3xl"></p>
            </div>
          </div>
          <div className="py-2 rounded-md bg-gray-300 animate-pulse px-4 flex justify-between">
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="w-10/12 space-y-2 mt-1">
              <p className="py-1 bg-white w-11/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-10/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-9/12 ml-4 rounded-3xl"></p>
            </div>
          </div>
          <div className="py-2 rounded-md bg-gray-300 animate-pulse px-4 flex justify-between">
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="w-10/12 space-y-2 mt-1">
              <p className="py-1 bg-white w-11/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-10/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-9/12 ml-4 rounded-3xl"></p>
            </div>
          </div>
          <div className="py-2 rounded-md bg-gray-300 animate-pulse px-4 flex justify-between">
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="w-10/12 space-y-2 mt-1">
              <p className="py-1 bg-white w-11/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-10/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-9/12 ml-4 rounded-3xl"></p>
            </div>
          </div>
          <div className="py-2 rounded-md bg-gray-300 animate-pulse px-4 flex justify-between">
            <div className="bg-white rounded-full w-12 h-12"></div>
            <div className="w-10/12 space-y-2 mt-1">
              <p className="py-1 bg-white w-11/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-10/12 ml-4 rounded-3xl"></p>
              <p className="py-1 bg-white w-9/12 ml-4 rounded-3xl"></p>
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="mt-4 h-[72vh] overflow-y-auto"
        >
          {friends &&
            friends?.map((friend, i) => {
              return (
                <MessageBar
                  setId={setId}
                  setUserDetails={setUserDetails}
                  key={i}
                  friend={friend}
                  setMessangerFriends={setMessangerFriends}
                />
              );
            })}
                        {
                  isLoading &&                <div className="flex justify-center mb-4">
                                  <div className="flex items-center gap-2">
                                    <AiOutlineLoading3Quarters
                                      size={20}
                                      className="animate-spin"
                                    />
                                    <h2 className="text-center text-gray-700">Loading...</h2>
                                  </div>
                                </div>
                }
        </div>
      )}
    </div>
  );
};

export default MessageBox;

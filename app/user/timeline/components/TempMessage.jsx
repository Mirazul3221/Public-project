import React, { useRef, useState } from "react";
import { useSocket } from "../../global/SocketProvider";
import { baseurl } from "@/app/config";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const TempMessage = ({globalDispatch, sortedMessages, setUserDetails, token }) => {
  const { myActiveFriends } = useSocket();
  const containerRef = useRef(null);
  const [page, setPage] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchFriends = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const { data } = await axios.get(
      `${baseurl}/messanger/my-friends-by-both-message-and-profile?page=${page}&limit=${limit}&status=multiple`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    globalDispatch({type:'MERGE_ALL_MESSANGER_USER', payload:data})
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
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-[calc(100vh-20rem)] overflow-y-auto"
    >
      {sortedMessages?.map((friend) => {
        return (
          <div
            key={friend.userId}
            onClick={() =>
              setUserDetails({
                name: friend.userName,
                profile: friend.userProfile,
                _id: friend.userId,
              })
            }
            className="relative hover:bg-white border border-gray-100 hover:border-gray-200 duration-150 cursor-pointer rounded-md flex items-center gap-2 p-2"
          >
            <div className="relative">
              <img
                className="w-10 rounded-full"
                src={friend.userProfile}
                alt={friend.userName}
              />
              {myActiveFriends?.includes(friend.userId) ? (
                <div className="w-3 h-3 border-2 border-white bg-green-500 absolute rounded-full -right-[2px] bottom-1"></div>
              ) : (
                ""
              )}
            </div>
            <h2>{friend.userName}</h2>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2">
            <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            <h2 className="text-center text-gray-700">Loading...</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempMessage;

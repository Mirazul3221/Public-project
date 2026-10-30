import { baseurl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import axios from "axios";
import moment from "moment";
import React, { useContext, useState } from "react";
import { useSocket } from "../../global/SocketProvider";
import { commonLogout } from "../common";
import { FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import { RiUserReceivedLine } from "react-icons/ri";

const FriendRequest = ({ item }) => {
  const [closeContainer, setCloseContainer] = useState(false)
  const { store, dispatch } = useContext(storeContext);
  const { socket } = useSocket()
  const handleAcceptRequest = async (item) => {
    try {
     const {data} = await axios.get(`${baseurl}/friend-request/${item?.senderId?._id}/respond`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      handleNotification();
      setCloseContainer(true)
    } catch (error) {
      console.log(error);
      commonLogout(dispatch, error)
    }
  };

  //================================================
  //================================================
  const handleNotification = async () => {
    try {
      const { data } = await axios.post(
        `${baseurl}/notification/create`,
        { receiverId: item?.senderId?._id, type: "accept-request" },
        {
          headers: {
            Authorization: `Bearer ${store?.token}`,
          },
        }
      );
    socket && await socket.emit('new-notification', data)
      await axios.get(`${baseurl}/notification/delete-one/${user.senderId.name}`, {
        headers: {
          Authorization: `Bearer ${store?.token}`,
        },
      });
    } catch (error) { commonLogout(dispatch, error) }
  };
  ///////////////////////////////////////////////Cancel friend request//////////////////////////////////////////
  const cancleFriendRequest = async () => {
    try {
      await axios.post(
        `${baseurl}/friend-request/cancel`,
        { id: item?._id},
        {
          headers: {
            Authorization: `Bearer ${store?.token}`,
          },
        }
      );
      ////////////////////////////////////////////////////////////////////////////////////////////////////
      await axios.get(`${baseurl}/notification/delete-one/${item?.senderId?.name}`, {
        headers: {
          Authorization: `Bearer ${store?.token}`,
        },
      });
      setCloseContainer(true)
    } catch (error) {
      console.log(error)
      commonLogout(dispatch, error)
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className={`${closeContainer ? "hidden" : ""}`}>
      <p>{moment(item.createdAt).fromNow()}</p>
      <div className="flex gap-4 items-center">

        <div>
          <div className="w-12 h-12 relative text-gray-700">
            <div className="bg-white border p-1 rounded-full flex justify-center items-center absolute -right-1 -bottom-1">
              <RiUserReceivedLine color="#7305fa" size={15} style={{
                filter: "drop-shadow(0 0 0 white) drop-shadow(0 0 1px white)",
              }} />
            </div>
                     <Link
                       href={`/profile/${item?.senderId?._id}`}
                      //  onClick={(e) => e.stopPropagation()}
                     >
                       <img
                         className="rounded-full"
                         src={item?.senderId.profile}
                         alt={item?.senderId.name}
                       />
                     </Link>
          </div>
        </div>
        <div className="">
          <p>
            A new friend request from{" "}
          <Link
            href={`/profile/${item?.senderId?._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-bold text-[#7305fa] hover:underline">
              {item?.senderId.name}
            </span>
          </Link>
          </p>
          <div className="flex gap-3 mt-2">
            <div onClick={() => cancleFriendRequest()} className="px-4 cursor-pointer py-[3px] bg-gray-200 text-gray-700 w-fit rounded-md">
            <h2>Delete</h2>
            </div>
            <div onClick={() => handleAcceptRequest(item)} className="px-4 cursor-pointer py-[3px] bg-[#3e19fa] text-white w-fit rounded-md">
              <h2>Confirm</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;

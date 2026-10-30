import { baseurl } from "@/app/config";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import AddAndDeleteFriendRequestButton from "../../components/messanger/components/AddAndDeleteFriendRequestButton";

const FriendCard = ({id}) => {
  const [getAllAcceptedFriend, setGetAllAcceptedFriend] = useState(null);
  const load = async () => {
    try {
      const accepted = await axios.get(
        `${baseurl}/friend-request/get-friend/accepted/${id}`,
      );
      setGetAllAcceptedFriend(accepted.data);
    } catch (error) {
    }
  };
  useEffect(() => load(), []);

  return <div>
                  <div className="md:grid grid-cols-3 gap-4">
                    {getAllAcceptedFriend !== null &&
                      getAllAcceptedFriend?.map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                              <div className="relative rounded-full w-fit">
                                {myActiveFriends &&
                                myActiveFriends?.some((O) => O === item._id) ? (
                                  <div className="w-3 h-3 border border-white bg-green-500 absolute rounded-full right-3 bottom-1"></div>
                                ) : (
                                  <div className="w-3 h-3 border border-white bg-gray-400 absolute rounded-full right-3 bottom-1"></div>
                                )}
                                <img
                                  className="w-20 border-2 rounded-full"
                                  src={item.profile}
                                />
                              </div>
                              <div>
                                <a href={`${viewurl}/user/profile/${item._id}`}>
                                  <h2 className="hover:underline duration-200 font-semibold text-gray-700 mt-2">
                                    {item.name}
                                  </h2>
                                </a>
                                <h2 className="text-gray-700">
                                  Status : {item.status}
                                </h2>
                              </div>
                            </div>
                            {/* <CallMessageContainer id={item?._id} userDetails={item} /> */}
                            <div>
                              <AddAndDeleteFriendRequestButton id={item._id} />
                              {myActiveFriends &&
                                myActiveFriends?.some((O) => O === item._id) && (
                                  <h2
                                    onClick={() => {
                                      inviteYourFriend(item._id);
                                    }}
                                    className="py-1 px-2 cursor-pointer bg-[#3e19fa] rounded-md text-sm text-white"
                                  >
                                    Invite
                                  </h2>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
  </div>;
};

export default FriendCard;

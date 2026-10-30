"use client";
import { baseurl, viewurl } from "@/app/config";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import banner from "@/public/banner/profile-banner.jpg";
import moment from "moment";
import Footer from "@/app/components/Footer";
import ProtectRoute from "@/app/global/ProtectRoute";
import storeContext from "@/app/global/createContex";
import { toast, ToastContainer } from "react-toastify";
import SuperHeader from "../../components/SuperHeader";
import Link from "next/link";
import { useSocket } from "../../global/SocketProvider";
import CallMessageContainer from "../../components/messanger/CallMessageContainer";
import AddAndDeleteFriendRequestButton from "../../components/messanger/components/AddAndDeleteFriendRequestButton";
import { CiUser } from "react-icons/ci";
import { commonLogout } from "../../components/common";
import McqCard from "./McqCard";
import RadarChart from "../../components/RaderChart";
import FeedCard from "./FeedCard";
import { MdOutlineLockPerson } from "react-icons/md";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getColorSync } from "colorthief";

const Page = () => {
  const pram = useParams();
    const router = useRouter();
  const user = pram.user;
  const [userDetails, setUserDetails] = useState();
  const [lockedProf, setLockedProf] = useState(null);
  const [myUserId, setMyUserId] = useState(0);
  const [acceptedFriendsId, setAcceptedFriendsId] = useState(null);
  const [loderReq, setLoaderReq] = useState(false);
  const [isfriend, setIsfriend] = useState(null);
  const [openMessangerBox1, setOpenMessangerBox1] = useState(false);
  const [record, setRecord] = useState("Posts");
  const { store, dispatch } = useContext(storeContext);
  const { socket, myActiveFriends } = useSocket();
  const [switcher, setSwitcher] = useState(0);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        //   setLoader(true);
        const { data } = await axios.get(
          `${baseurl}/auth/publicuser/findbyid/${user}`,
        );
        setMyUserId(localStorage.getItem("userId"));
        //================================================
        setUserDetails(data);
        setLockedProf(data.isLocked);
        someUserProAndIds(data?._id);
        //   setLoader(false);
        const isLock = true
        if (isLock) {
          const checkFriendStatus = await axios.get(
            `${baseurl}/friend-request/isFriend?profileVisitorId=${data?._id}`,
            {
              headers: {
                Authorization: `Bearer ${store.token}`,
              },
            },
          );
          setIsfriend(checkFriendStatus.data)
        }
        //===========================================================================
        //===========================================================================
        const allFriendId = await axios.get(
          `${baseurl}/friend-request/get-friend/acceptedFriendId`,
          {
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          },
        );
        setAcceptedFriendsId(allFriendId?.data);
        //======================================================================
        //======================================================================
      } catch (error) {
        //   setLoader(false);
        console.log(error);
        commonLogout(dispatch, error);
      }
    };
    fetchUser();
  }, []);
  //=======================================================
  //=======================================================
  const [someFriendProfileAndId, setSomeFriendProfileAndId] = useState(null);
  const someUserProAndIds = async (id) => {
    try {
      const someFriendsProfileAndId = await axios.get(
        `${baseurl}/friend-request/get-your-friend/${id}/somefriendandid`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        },
      );
      someOfMyFriend(id);
      setSomeFriendProfileAndId(someFriendsProfileAndId.data);
    } catch (error) {
      commonLogout(dispatch, error);
    }
  };
  //=======================================================
  //=======================================================
  const [someOfMyFriendDetails, setSomeOfMyFriendDetails] = useState(null);
  const someOfMyFriend = async (id) => {
    try {
      const someFriendsProfileAndId = await axios.get(
        `${baseurl}/friend-request/get-your-friend/${id}/somefriend`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        },
      );
      setSomeOfMyFriendDetails(someFriendsProfileAndId.data);
    } catch (error) {
      commonLogout(dispatch, error);
    }
  };

  const hasInList = acceptedFriendsId?.includes(userDetails._id);
  const [resize, setResize] = useState(0);
  useEffect(() => {
    const r = window.innerWidth;
    if ((r >= 320 || r >= 375) && r < 425) {
      setResize(240);
    }
    if (r >= 425 && r < 768) {
      setResize(350);
    }
    if (r >= 768 && r < 1024) {
      setResize(350);
    }
    if (r >= 1024 && r < 1440) {
      setResize(350);
    }
    if (r >= 1440 && r < 2560) {
      setResize(350);
    }
    if (r >= 2560) {
      setResize(400);
    }
  }, []);
  ////////////////////////friend request api////////////////////////
  const friendRequestApi = async (recipient) => {
    try {
      //   setLoader(true);
      setLoaderReq(true);
      const { data } = await axios.post(
        `${baseurl}/friend-request/add`,
        { recipient },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        },
      );
      setLoaderReq(false);
      handleNotification(recipient);
      // setAllQuestions(totalReadQuestions),
      //   setLoader(false);
    } catch (error) {
      //   setLoader(false);
      setLoaderReq(false);
      toast.error(error.response.data.message);
      commonLogout(dispatch, error);
    }
  };
  ////////////////send message api////////////////////////
  // const sendMessageApi = async (id, name, profile) => {
  //   const { data } = await axios.post(`${baseurl}/messanger/create`, {
  //     message: "Hi",
  //     id,
  //     name,
  //     profile,
  //   });
  // };
  ////////////////notification api////////////////////////
  const handleNotification = async (recipient) => {
    try {
      const { data } = await axios.post(
        `${baseurl}/notification/create`,
        { readerId: recipient, type: "friend-request" },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        },
      );
      socket && (await socket.emit("new-notification", recipient));
    } catch (error) {
      commonLogout(dispatch, error);
    }
  };
  //================================================================
  const cancleFriendRequest = async (id) => {
    await axios.post(
      `${baseurl}/friend-request/cancel`,
      { ID: id },
      {
        headers: {
          Authorization: `Bearer ${store?.token}`,
        },
      },
    );
  };
  const [showHeader, setShowHeader] = useState(false);
    const [randProfShow, setRandProfShow] = useState(null)


  const [randNum, setRandNum] = useState();
  useEffect(() => {
        const handleScroll = () => {
      setShowHeader(window.scrollY > 150);
    };
    setRandProfShow(Math.floor(Math.random() * 2))
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const [bgColor, setBgColor] = useState("rgb(240,240,240)");
  useEffect(() => {
    const rnd = Math.floor(Math.random() * 78) + 1;
  
    setRandNum(rnd);
  
    const img = new Image();
  
    img.crossOrigin = "Anonymous";
  
    img.onload = () => {
      const color = getColorSync(img);
  
      const { r, g, b } = color.rgb();
  
      const gradient = `linear-gradient(
        135deg,
        rgba(${r}, ${g}, ${b}, 0.25),
        rgba(${r}, ${g}, ${b}, 0.08)
      )`;
  
      setBgColor(gradient);
  
      console.log("Color:", color.css());
    };
  
    img.onerror = () => {
      console.log("Image failed to load");
    };
  
    // IMPORTANT
    img.src = `/cover-photo/background-${rnd}.jpg`;
  
  }, []);
  // async function someFriendProfileAndIdd (){
  //   const {data} = await axios.get(
  //      `${baseurl}/friend-request/get-your-friend/${userDetails?._id}`,
  //      {
  //        headers: {
  //          Authorization: `Bearer ${store.token}`,
  //        },
  //      }
  //    );
  //    setSomeFriendProfileAndId(data)
  //   }
  return (
    <ProtectRoute>
      {/* <div onClick={someFriendProfileAndIdd}>jsgdkgjsdkjgjkzdjis</div> */}
      <div  style={{
    background: bgColor,
    transition: "background 0.3s ease",
  }} className="bg-gray-50">
      {
        showHeader && <div className="z-[9999] fixed top-0 left-0 w-full bg-white md:hidden">
          <SuperHeader />
        </div>
      }
      <div className="md:px-10 py-1 hidden md:block">
        <SuperHeader />
      </div>
      <button className="text-white md:hidden bg-gray-700/50 absolute left-1 top-1 z-50 cursor-pointer" onClick={() => router.push("/")}>
        <FaAngleLeft size={30} />
      </button>
        <ToastContainer />
        <div className="md:flex md:w-9/12 min-h-[80vh] gap-4 mx-auto">
          <div className={`md:w-5/12 md:sticky md:-top-0 bg-white shadow-md h-fit ${switcher == 22 ? "relative z-40" : ""}`}>
            <div className="md:flex justify-center">
              <div>
                <div className="relative">
                  <img
                    className="rounded-b-2xl w-full object-cover"
                    src={`/cover-photo/background-${randNum}.jpg`}
                    alt="cover"
                  />

                  {userDetails?.name ? (
                    <div className="absolute bottom-0 left-5 translate-y-[50%]">
                      <div className="relative">
                        <img
                          className="md:w-[120px] md:h-[120px] w-[150px] h-[150px] border-4 rounded-full border-white md:ml-4"
                          src={`${userDetails?.profile}`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-0 translate-y-[50%]">
                      <div className="w-[100px] bg-gray-100 animate-pulse h-[100px] border-4 rounded-full border-white">Loading...</div>
                    </div>
                  )}
                </div>
                <div className="px-2">
                  {userDetails?.name ? (
                    <div className="mt-20 text-gray-500 px-4 py-2 border-t">
                      <h2 className="font-bold text-2xl">
                        {userDetails?.name} <sup className="font-thin text-violet-600">({userDetails?.status})</sup>
                      </h2>
                      <div className="flex">
                        <div className="relative w-3/12">
                          {someFriendProfileAndId?.profile?.map((item, i) => {
                            return (
                              <div
                                className={`absolute top-0 left-0 ml-${i * 6}`}
                                key={i}
                              >
                                <div>
                                  <img
                                    className="w-10 h-10 border-[3px] border-gray-300 rounded-full"
                                    src={item.profile}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {someFriendProfileAndId?.profile?.length > 0 && (
                          <h2 className="flex gap-2 mt-2">
                            Total Friends : {someFriendProfileAndId?.totalUsers}
                          </h2>
                        )}
                      </div>
                      <h2 className="text-sm mt-3">{userDetails?.title}</h2>
                      {userDetails?.isOnline ? (
                        <div className="flex gap-2 items-center mt-2">
                          <div className="flex">Online Status : </div>
                          <div className="border border-green-500 flex gap-1 justify-center items-center py-1 px-5 rounded-full">
                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>{" "}
                            <p className="text-green-500 text-[12px]">Active</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex gap-2 items-center mt-2">
                            <div className="flex">Online Status : </div>
                            <div className="border border-[#e7523a] flex gap-1 justify-center items-center py-1 px-5 rounded-full">
                              <div className="h-3 w-3 bg-[#e7523a] rounded-full"></div>{" "}
                              <p className="text-[#e7523a] text-[12px]">{`Inactive`}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center mt-2">
                            <div className="flex">Last moment : </div>
                            <p className="text-[#e7523a] text-[12px]">
                              {moment(userDetails.updatedAt).fromNow()}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="md:flex items-center gap-4">
                        <div className="flex items-center gap-1 mt-2 text-gray-700">
                          <CiUser />
                          <h3>
                            Member since{" "}
                            <span className="font-semibold">
                              {moment(userDetails.createdAt).format("MMM YYYY")}
                            </span>
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 z-[100]">
                        <AddAndDeleteFriendRequestButton
                          id={userDetails?._id}
                        />
                        <CallMessageContainer className="z-50"
                         val={22}
                        switchHandler={setSwitcher}
                          id={userDetails?._id}
                          userDetails={userDetails}
                        />
                      </div>
                      {/* ---------------------------------------------Messanger Box System-------------------------------------------- */}
                    </div>
                  ) : (
                    <div className="p-4 mt-20 space-y-2">
                      <div className="animate-pulse w-48 h-8 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-36 h-6 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-52 h-6 bg-gray-100 rounded-md"></div>
                    </div>
                  )}
                  {userDetails?.name ? (
                    <div className="mt-4 p-4 border-t">
                      <h2 className="font-bold text-md text-gray-500">
                        About me
                      </h2>
                      {userDetails?.description?.length == 0 && (
                        <div className="mt-10 text-[14px] text-center">
                          No data found
                        </div>
                      )}
                      <div className="mt-2">{userDetails?.description}</div>
                    </div>
                  ) : (
                    <div className="p-2 mt-2 space-y-2">
                      <div className="animate-pulse w-28 h-4 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-72 h-2 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-full h-2 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-full h-2 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-full h-2 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-full h-2 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-full h-2 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-full h-2 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-full h-2 bg-gray-100 rounded-md"></div>
                      <div className="animate-pulse w-full h-2 bg-gray-100 rounded-md"></div>
                    </div>
                  )}
                  {/* {
                userDetails?.name ? '':""
               }
               {
                userDetails?.name ? '':""
               } */}
                </div>
              </div>
            </div>
          </div>

        <div className={`md:w-7/12 mt-10 md:mt-0 md:px-4 py-6 ${switcher == 11 ? "relative z-40" : ""}`}>
            <div className="flex w-full items-center justify-center mb-4 gap-1 md:gap-2">
              <div
                onClick={() => setRecord("Posts")}
                className={`md:px-6 px-1 border cursor-pointer ${record == "Posts"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
                  } rounded-md`}
              >
                Posts
              </div>
              <div
                onClick={() => setRecord("MCQs")}
                className={`md:px-6 px-1 border cursor-pointer ${record == "MCQs"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
                  } rounded-md`}
              >
                MCQs
              </div>
              <div
                onClick={() => setRecord("Friends")}
                className={`md:px-6 px-1 border cursor-pointer ${record == "Friends"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
                  } rounded-md`}
              >
                Friends
              </div>
              <div
                onClick={() => setRecord("Performance")}
                className={`md:px-6 px-1 border cursor-pointer ${record == "Performance"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
                  } rounded-md`}
              >
                Performance
              </div>
              <div
                onClick={() => setRecord("More")}
                className={`md:px-6 px-1 border cursor-pointer ${record == "More"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
                  } rounded-md`}
              >
                More
              </div>
            </div>
            {record == "MCQs" && (
              <div >{userDetails && <McqCard id={userDetails?._id} />}</div>
            )}
            {record == "Posts" && (

              <div> {userDetails && <div>
                {
                  (lockedProf && isfriend) && <FeedCard id={userDetails?._id} isfriend = {isfriend} /> 
                }

                {
                  (lockedProf == false  && isfriend == true) && <FeedCard id={userDetails?._id} isfriend = {isfriend} /> 
                }

                {
                  (lockedProf == false  && isfriend == false) && <FeedCard id={userDetails?._id} isfriend = {isfriend} /> 
                }

{lockedProf && !isfriend && (
  <div className="mx-auto my-4 w-full max-w-xl">
    <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
      
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          
          {/* Lock Icon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-50">
            <MdOutlineLockPerson
              className="h-8 w-8 text-violet-600"
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              {userDetails?.name} has a locked profile
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-gray-500">
              Only friends can see posts shared on this profile.
              MCQs and exams are still visible to all users.
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3">
          <MdOutlineLockPerson className="h-5 w-5 shrink-0 text-violet-500" />

          <span className="text-xs leading-5 text-violet-700 sm:text-sm">
            Send a friend request to see posts shared only with friends.
          </span>
        </div>
      </div>
    </div>
  </div>
)}

              </div>}</div>
            )}

            {record == "Performance" && (
              <div className="bg-white">
                <h2 className="text-center md:text-3xl text-violet-700 mb-2">
                  All The Questions You Have read
                </h2>
                {userDetails?.totalCountQuestions && (
                  <div>
                    <RadarChart resize={resize} scoreData={userDetails?.totalCountQuestions} />
                  </div>
                )}
              </div>
            )}

            {record == "Friends" && (
              <div className="bg-white p-2">
                <div className="grid md:grid-cols-1 gap-2">
                  {someOfMyFriendDetails &&
                    someOfMyFriendDetails
                      .filter((user) => user._id !== store.userInfo.id)
                      .map((item, i) => {
                        return (
                          <div key={i}>
                            <div
                              key={i}
                              className="bg-gray-100 p-2 flex gap-4 justify-between items-center rounded-lg border"
                            >
                              <div className="flex items-center gap-2">
                                <div className="relative rounded-full w-fit mx-auto">
                                  {myActiveFriends &&
                                    myActiveFriends?.some((O) => O === item._id) ? (
                                    <div className="w-3 h-3 border-2 border-white bg-green-500 absolute rounded-full right-3 bottom-1"></div>
                                  ) : (
                                    <div className="w-3 h-3 border-2 border-white bg-gray-400 absolute rounded-full right-3 bottom-1"></div>
                                  )}
                                  <img
                                    className="w-20 mx-auto border md:border-4 rounded-full"
                                    src={item.profile}
                                  />
                                </div>
                                <div>
                                  <Link href={`${viewurl}/user/profile/${item._id}`}>
                                    <h2 className="font-semibold text-gray-700 mt-2">
                                      {item.name}
                                    </h2>
                                  </Link>
                                  <h4 className=" text-gray-700 mt-2 text-sm">
                                    Reader Type :{" "}
                                    <span className="text-violet-700">
                                      {item.status}
                                    </span>
                                  </h4>
                                </div>
                              </div>
                              <div className="mt-2 space-y-3">
                                <AddAndDeleteFriendRequestButton id={item?._id} />
                                <CallMessageContainer switchHandler={setSwitcher} val={11}
                                  id={item?._id}
                                  userDetails={item}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                </div>
                
                  <div className="bg-gray-100 mt-4 flex justify-center items-center font-bold text-gray-500">
                    View All your Friends
                  </div>
              </div>
            )}


          </div>
        </div>
        <div className="hidden  md:block">
          <Footer />
        </div>
      </div>
    </ProtectRoute>
  );
};

export default Page;

"use client";
import Logo from "@/app/components/Logo";
import { baseurl, suburl, viewurl } from "@/app/config";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { GoHistory } from "react-icons/go";
import { MdAppRegistration, MdOutlineMenuBook } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import Profile from "./Profile";
import Search from "./Search";
import { RiMessage2Line } from "react-icons/ri";
import { useSocket } from "../global/SocketProvider";
import NotificationContainer from "./notification-component/NotificationContainer";
import MessageBox from "./messanger/MessageBox";
import { fetchAllFriendsByMessage } from "../messanger/components/fetchdata";
import CurrentWindowChecker from "../global/CurrentWindowChecker";
import { useGlobalData } from "../global/globalDataProvider.jsx";
import MessageContainerBoxMobile from "./messanger/MessageContainerBoxMobile";
import { commonLogout, myDetailsApi } from "./common";
import RightSideBar from "./RightSideBar";
import { LuSearch, LuSearchX } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { GrDocumentStore, GrHistory } from "react-icons/gr";
import { CgProfile } from "react-icons/cg";
import { FiPlusCircle } from "react-icons/fi";
import { TbTimeDuration45 } from "react-icons/tb";
import { useStore } from "@/app/global/DataProvider";
import { FaUsers } from "react-icons/fa";

const SuperHeader = ({ onNavigate }) => {
  const [isOpenMessage, setIsOpenMessage] = useState(false);
  const [isOpenMobileMessage, setIsOpenMobileMessage] = useState(false);
    const [countNotif, setCountNotif] = useState(false);
  const [notif, setNotif] = useState(null);
  const messageContainerRef = useRef(null);
  const notifContainerRef = useRef(null);
  const rightBarRef = useRef(null);
  const [openSearch, setOpenSearch] = useState(false);
  const { store, dispatch } = useStore();
  const { appData, dispatch: dataDispatch } = useGlobalData();
  const { socket } = useSocket();
  const pathname = usePathname();

  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchProfile = async () => {
      const isData = JSON.parse(localStorage.getItem("myDetails"));
      if (isData) {
        dataDispatch({ type: "GLOBALUSERDATA", payload: isData });
      } else {
        const data = await myDetailsApi(store.token);
        localStorage.setItem("myDetails", JSON.stringify(data));
        dataDispatch({ type: "GLOBALUSERDATA", payload: data });
      }
    };
    fetchProfile();
  }, []);



  useEffect(() => {
  console.log("EFFECT RUNNING");
  if (!socket) return;
  const handleMessageFrom = (data) => {
    alert("EFFECT RUNNING")
    // move user to first position
    dataDispatch({
      type: "INSURT_LAST_MESSANGER_USER",
      payload: {
        userId: data?.senderId,
        lastMessage: data?.message,
        userName: data?.name,
        userProfile: data?.profile,
      },
    });
  };

  socket.on("message-from", handleMessageFrom);
  return () => {
    socket.off("message-from", handleMessageFrom);
  };
}, [socket]);
  //=============set scroll for header================
  const [header, setHeader] = useState(false);
  const scrollHeader = () => {
    if (window.scrollY >= 1) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${baseurl}/userquestions/get-tag/subject/chapter`,
          {
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          },
        );

        dataDispatch({ type: "STORE_RIGHTSIDEBAR_DATA", payload: data });
      } catch (error) {
        console.error("Error fetching data:", error);
        commonLogout(dispatch, error);
      }
    };

    fetchData();
  }, [store.token]);

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  }, []);
  CurrentWindowChecker();
  const [me, setMe] = useState({
    name: "",
    profile: store.userInfo.profile,
    balance: 0,
  });

  useEffect(() => {
    async function loadmessage() {
      const data = await fetchAllFriendsByMessage(store.token, dispatch,1,20);
      dataDispatch({ type: "STORE_ALL_MESSANGER_USER", payload: data });
    }
    loadmessage();
  }, []);

  useEffect(() => {
    socket &&
      socket.on("lastMsgWithProfile", (data) => {
        dataDispatch({
          type: "STORE_REMOTE_USER_PROFILE",
          payload: { data, id: "122" },
        });
      });
    return () => {
      socket && socket.off("lastMsgWithProfile");
    };
  }, [socket]);

  useEffect(() => {
    async function fetchData() {
      try {
        const myDetails = JSON.parse(localStorage.getItem("myDetails"));
        setMe({
          id: appData.globalUserProfile._id,
          isOnline: appData.globalUserProfile.isOnline,
          name: appData.globalUserProfile.name || "",
          status: appData.globalUserProfile.status,
          profile: appData.globalUserProfile.profile,
          balance: appData.globalUserProfile.balance,
          email: appData.globalUserProfile.email,
        });
        localStorage.setItem("userId", myDetails._id);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [appData]);

  const route = useRouter();
  const logout = () => {
    dispatch({ type: "logout" });
    route.push("/login");
  };

  //==============================notification logic=====================
  const handleNotification = async () => {
    try {
      const { data } = await axios.get(`${suburl}/notification/find`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
      // setNotificationList(data);
      dataDispatch({ type: 'STORE_NOTIF', payload: data });
    } catch (error) {
      commonLogout(dispatch, error);
    }
  };
  //====================================================================
  //====================================================================
  //====================================================================
  const seenAndDeleteNotif = async () => {
   dataDispatch({ type: 'CHANGE_NOTIF'});
    try {
      await axios.get(`${baseurl}/notification/seen-and-delete`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      });
    } catch (error) {
      commonLogout(dispatch, error);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // const sortedMessages = appData?.user?.sort(
  //   (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
  // );

  // const unreadMessage = sortedMessages?.reduce((acc, qb) => {
  //   return acc + qb?.unseenMessageCount;
  // }, 0);
  /////////////////////////////Here is the logic for new notification come//////////////////////////////
  const [openNotif, setOpenNotif] = useState(false);
useEffect(() => {
  if (!socket) return;

  const handleNewNotification = (data) => {
    dataDispatch({
      type: "NEW_NOTIF",
      payload: data,
    });

    if (openNotif) {
      seenAndDeleteNotif();
    }
  };

  socket.on("new-notification", handleNewNotification);

  return () => {
    socket.off("new-notification", handleNewNotification);
  };
}, [socket, openNotif]);

  // useEffect(() => {
  //   openNotif && handleNotification();
  // }, [openNotif]);

  useEffect(() => {
    handleNotification();
  }, []);
  useEffect(() => {
    const unseenNotificationCount = appData.notifications?.filter((item) => item.seen === false).length || 0;
    setCountNotif(unseenNotificationCount);
  }, [appData.notifications]);
  //  openNotif && seenAndDeleteNotif();
  //////////////////////////////////////////////////////////////////////////////

  const sayThanks = async (id) => {
    try {
      const { data } = await axios.post(
        `${baseurl}/notification/create`,
        { readerId: id, type: "respond-from-invitation" },
        {
          headers: {
            Authorization: `Bearer ${store?.token}`,
          },
        },
      );
      socket && (await socket.emit("new-notification", id));
    } catch (error) {
      console.log(error);
      commonLogout(dispatch, error);
    }
  };

  const fullName = me.name?.split(" ");
  const firstname = fullName[0];

  const [countUnreadMessage, setCountUnreadMessage] = useState(0);
  async function countMessage() {
    try {
      const { data } = await axios.get(
        `${baseurl}/messanger/count-all-unseen-message`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        },
      );
      setCountUnreadMessage(data);
    } catch (error) {
      commonLogout(dispatch, error);
    }
  }

  useEffect(() => {
    countMessage(); //
  }, []);


useEffect(() => {
  if (!socket) return;
  const handleMessageFrom = (data) => {
    // unread count
    if (!isOpenMobileMessage) {
      countMessage();
    }
  };

  socket.on("message-from", handleMessageFrom);

  return () => {
    socket.off("message-from", handleMessageFrom);
  };
}, [socket, isOpenMobileMessage]);

  /////////////////////////////////Here is the logic to check current message window or not//////////////////////////////////////////
  useEffect(() => {
    socket &&
      socket.on("get-seen-validation", (data) => {
        if (
          !pathname.includes("userdashboard/messanger") &&
          !pathname.includes("userdashboard/q")
        ) {
          socket &&
            socket.emit("validation-status", {
              sender: data.senderId,
              status: false,
            });
        }
      });
    return () => {
      socket && socket.off("get-seen-validation");
    };
  }, [socket]);

  const toggleMessage = () => setIsOpenMessage(!isOpenMessage);
  useEffect(() => {
    const handleMessage = (e) => {
      if (
        messageContainerRef.current &&
        !messageContainerRef.current.contains(e.target)
      ) {
        setIsOpenMessage(false);
      }
    };

    if (isOpenMessage) {
      document.addEventListener("click", handleMessage);
    } else {
      document.removeEventListener("click", handleMessage);
    }
    return () => {
      document.removeEventListener("click", handleMessage);
    };
  }, [isOpenMessage]);

  ////////////////////////////////////Notification open/close logic////////////////////////////
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  // const [isOpenMobileMessage, setIsOpenMobileMessage] = useState(false);
  const handleNotificationToggle = () => {
    setIsOpenNotif(!isOpenNotif);
  };

  useEffect(() => {
    const handleNotif = (e) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(e.target)
      ) {
        setIsOpenNotif(false);
      }
    };

    if (isOpenNotif) {
      document.addEventListener("click", handleNotif);
    } else {
      document.removeEventListener("click", handleNotif);
    }
    return () => {
      document.removeEventListener("click", handleNotif);
    };
  }, [isOpenNotif]);

  const [showParent, setShowParent] = useState(false);
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    const handleRightBar = (e) => {
      if (rightBarRef.current && !rightBarRef.current.contains(e.target)) {
        setShowParent(false);
      }
    };

    // if (share || openCommentsBox) {
    //   document.body.style.overflow = "hidden";
    // } else {
    //   document.body.style.overflow = "auto";
    // }

    if (showParent) {
      document.addEventListener("click", handleRightBar);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("click", handleRightBar);
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("click", handleRightBar);
    };
  }, [showParent]);

  const handleClick = () => {
    setShowParent(true);
    setShowChild(false);

    setTimeout(() => {
      setShowChild(true);
    }, 100);
  };
  ////////////////////////////////////////////////Scrolling Logic////////////////////////////////////////
  const [offset, setOffset] = useState(0); // 0 = fully visible, 100 = hidden
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // If scrolling down → increase offset (hide footer)
      if (delta > 0) {
        setOffset((prev) => Math.min(prev + delta, 100));
      } else if (delta < 0) {
        // If scrolling up → decrease offset (show footer)
        setOffset((prev) => Math.max(prev + delta, 0));
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  return (
    <div className="">
      <div 
        className={`font-title ${header
          ? "fixed top-0 left-0 w-screen z-50 backdrop-blur-md px-2 md:px-20"
          : ""
          }`}
      >
        <div className="flex justify-between items-center px-2">
          <div className="md:w-20 w-16">
            {!header ? (
              <Logo w={80} />
            ) : (
              <Link className="text-violet-500 text-[18px] md:text-[25px]" href="/">
                {/* <Image src={logo} alt="bffd" /> */}
                Edu<sup>++</sup>
              </Link>
            )}
          </div>
          <div className="w-3/12 hidden md:block">
            <Search />
          </div>
          <div className="flex gap-4 items-center">
            <div className="hidden md:block">
              <div className="flex gap-4 items-center">
                <ul className="md:w-full md:flex hidden justify-center py-4 gap-3 text-sm">
                  {/* <li
                    className={`font-normal px-4 py-[4px] text-gray-700 w-fit cursor-pointer duration-500 rounded-md`}
                  >
                    <Link
                      href={"/user/myfavourite"}
                      className="flex justify-between items-center gap-2"
                    >
                      <AiOutlineHeart /> Favourite
                    </Link>
                  </li> */}
                  <li
                    className={`font-normal px-2 py-[6px] w-fit cursor-pointer duration-500 rounded-md border-r-2`}
                  >
                    <Link
                      href={"#"}
                      className="flex justify-between hover:text-md duration-75 items-center gap-2"
                    >
                      <GoHistory /> History
                    </Link>
                  </li>
                  <li
                    className={`font-normal px-2 py-[6px] w-fit cursor-pointer duration-500 rounded-md border-r-2`}
                  >
                    <Link
                      href={`${viewurl}/model-test`}
                      className="flex hover:text-md duration-75 justify-between items-center gap-2"
                    >
                      <FaUsers />
                      Live exams
                    </Link>
                  </li>
                  <li
                    className={`font-normal px-2 py-[6px] w-fit cursor-pointer duration-500 rounded-md border-r-2`}
                  >
                    <Link
                      href={`${viewurl}/model-initiation`}
                      className="flex hover:text-md duration-75 justify-between items-center gap-2"
                    >
                      <MdAppRegistration />
                      Your Exams
                    </Link>
                  </li>
                  <li
                    className={`font-normal px-2 py-[6px] w-fit cursor-pointer duration-500 rounded-md border-r-2`}
                  >
                    <Link
                      href={"/user/myfavourite"}
                      className="flex hover:text-md duration-75 justify-between items-center gap-2"
                    >
                      <MdOutlineMenuBook /> BCS Corner
                    </Link>
                  </li>
                  {!pathname.includes("userdashboard/messanger") && (
                    <li
                      onClick={() => {
                        toggleMessage();
                        setOpenNotif(false);
                      }}
                      className={`text-lg header-box font-normal relative text-gray-700 p-1 w-fit cursor-pointer duration-500`}
                    >
                      <div className={`absolute top-1 right-[0px]`}>
                        {countUnreadMessage > 0 && (
                          <div
                            className={`bg-[#ff0000]/90 header-box w-[15px] h-[15px] rounded-full flex justify-center items-center`}
                          >
                            <p className="text-white header-box text-[10px]">
                              {countUnreadMessage > 9
                                ? 9 + "+"
                                : countUnreadMessage}
                            </p>
                          </div>
                        )}
                      </div>
                      <RiMessage2Line className="header-box" size={26} />
                    </li>
                  )}
                  <li
                    onClick={() => {
                      handleNotificationToggle();
                      seenAndDeleteNotif();
                      setCountNotif(0)
                    }}
                    className={`text-lg header-box font-normal relative text-gray-700 p-1 w-fit cursor-pointer duration-500`}
                  >
                    <div className={`absolute top-1 right-[3px]`}>
                      {countNotif > 0 && (
                        <div
                          className={`bg-[#ff0000]/90 header-box w-[15px] h-[15px] rounded-full flex justify-center items-center`}
                        >
                          <p className="text-white header-box text-[10px]">
                            {countNotif}
                          </p>
                        </div>
                      )}
                    </div>
                    <IoIosNotificationsOutline
                      className="header-box"
                      size={26}
                    />
                  </li>
                  {/* ==================Open and close message in desktop==================== */}
                  {isOpenMessage && (
                    <MessageBox
                      sortedMessages={appData?.user}
                      setCountUnreadMessage={setCountUnreadMessage}
                      messageContainerRef={messageContainerRef}
                      toggleMessage={toggleMessage}
                    />
                  )} 
                  {/* ==================Open and close notification in desktop==================== */}

                  {/* <li className="text-lg font-normal px-4 py-[4px] hover:bg-slate-100 hover:border-gray-200 text-gray-700 w-fit cursor-pointer duration-500 rounded-md border-[1px] border-white">
          Contact Info//
        </li> */}
                </ul>
              </div>
            </div>

            {!openSearch ? (
              <div
                onClick={() => {
                  setOpenSearch(true);
                }}
                className="md:hidden text-gray-700"
              >
                <LuSearch size={26} />
              </div>
            ) : (
              <div
                onClick={() => {
                  setOpenSearch(false);
                }}
                className="md:hidden text-gray-700"
              >
                <LuSearchX size={26} />{" "}
              </div>
            )}

            {isOpenNotif && (
              <NotificationContainer onNavigate={onNavigate}
                notificationList={appData.notifications}
                notifContainerRef={notifContainerRef}
                sayThanks={sayThanks}
                handleNotificationToggle={handleNotificationToggle}
              />
            )}
            {/* ///////////////////////////////////////////////////////////////////message box for mobile from here///////////////////////////////////////////// */}
            {!pathname.includes("userdashboard/messanger") && (
              <div
                onClick={() => {
                  setIsOpenMobileMessage(!isOpenMobileMessage);
                  setOpenNotif(false);
                }}
                className={`text-lg header-box font-normal md:hidden relative text-gray-700 p-1 w-fit cursor-pointer duration-500`}
              >
                <div className={`absolute top-1 right-[0px]`}>
                  {countUnreadMessage > 0 && (
                    <div
                      className={`bg-[#ff0000]/90 header-box w-[15px] h-[15px] rounded-full flex justify-center items-center`}
                    >
                      <p className="text-white header-box text-[10px]">
                        {countUnreadMessage > 9 ? 9 + "+" : countUnreadMessage}
                      </p>
                    </div>
                  )}
                </div>
                <RiMessage2Line className="header-box" size={26} />
              </div>
            )}
            {isOpenMobileMessage && (
              <MessageContainerBoxMobile
                sortedMessages={appData?.user}
                setIsOpenMobileMessage={setIsOpenMobileMessage}
                setCountUnreadMessage={setCountUnreadMessage}
              />
            )}

            {/* ///////////////////////////////////////////////////////////////////Notification box for mobile from here///////////////////////////////////////////// */}
            <div
              onClick={() => {
                handleNotificationToggle();
                seenAndDeleteNotif();
                setCountNotif(0)
              }}
              className={`text-lg header-box font-normal md:hidden relative text-gray-700 p-1 w-fit cursor-pointer duration-500`}
            >
              <div className={`absolute top-1 right-1`}>
                {countNotif > 0 && (
                  <div
                    className={`bg-[#ff0000] w-[16px] h-[16px] rounded-full flex justify-center items-center`}
                  >
                    <p className="text-white text-[10px]">
                      {countNotif}
                    </p>
                  </div>
                )}
              </div>
              <IoIosNotificationsOutline className="header-box" size={26} />
            </div>
            {/* {openNotif && (
            <NotificationContainer
              notificationList={notificationList}
              sayThanks={sayThanks}
              setOpenNotif={setOpenNotif}
            />
          )} */}
            {/* ////////////////////////////////////////////////////////////// */}
            <div className="relative duration-100">
              {me?.profile?.length > 0 ? (
                <div onClick={handleClick} className="relative cursor-pointer">
                  <Profile profile={me?.profile} myId={me?.id} />
                  {/* <div className="absolute w-full">
                  {me?.balance === 0 ? (
                    <h2 className="text-center flex justify-center items-center gap-1">
                      0.00 <span className="font-bold text-[12px]">৳</span>{" "}
                    </h2>
                  ) : (
                    <h2 className="text-center text-gray-700">
                      {me?.balance?.toFixed(2) + " ৳"}
                    </h2>
                  )}
                </div> */}
                </div>
              ) : (
                <div className="w-16 h-16 animate-pulse border-4 bg-gray-100 rounded-full"></div>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden">
          {openSearch && (
            <div>
              <Search />
            </div>
          )}
        </div>

        {showParent && (
          <div className="fixed z-50 top-0 left-0 w-[100dvw] h-[100dvh] bg-black/50">
            {showChild && (
              <div
                ref={rightBarRef}
                className="h-full w-2/3 md:w-3/12 bg-white ml-auto transition-transform duration-1000 transform translate-x-0 animate-slide-in"
              >
                <RightSideBar
                  me={me}
                  rightSideBarData={appData.rightSideBarData}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className="fixed md:hidden bottom-0 left-0 w-full z-30"
        style={{
          transform: `translateY(${offset}%)`,
          transition: "transform 0.1s linear", // very fast update, tied to scroll < />
        }}
      >
        <div
          className={`bg-white rounded-t-2xl border text-gray-700 px-4 py-2 flex justify-around items-center shadow-lg ${pathname.includes("/user/messanger") || pathname.includes("/user/memory-create") ? "hidden" : "block"}`}
        >
          <a
            className={`${pathname === "/" ? "text-[#5236f0]" : ""} duration-150`}
            href="/"
          >
            <IoHomeOutline size={22} />
          </a>
          <a
            className={`${pathname == "/model-test" ? "text-[#5236f0]" : ""} duration-150`}
            href="/model-test"
          >
            <TbTimeDuration45 size={25} />
          </a>
          {/* <a className="hover:bg-[#5236f0] duration-150" href="/user/archaiv"><GrHistory size={22}/></a> */}

          <button className={`${pathname.includes("/user/timeline/create-post") ? "text-[#5236f0]" : ""} duration-150 -mt-8 bg-white rounded-full`} onClick={() => dispatch({ type: "OPEN_FEEDMAKER" })}>
            <FiPlusCircle size={35} />
          </button>

          <a
            className={`${pathname.includes("/user/timeline/my-questions") ? "text-[#5236f0]" : ""} duration-150`}
            href="/user/timeline/my-questions"
          >
            <GrDocumentStore size={22} />
          </a>
          <a className={"w-6 h-6 rounded-full"} href="/user/myprofile">
            <img
              className="w-full h-full rounded-full border"
              src={store.userInfo.profile}
              alt=""
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuperHeader;


<button
  onClick={() => (window.location.href = `${viewurl}/exam/create`)}
  className="relative text-sm overflow-hidden rounded-xl px-2 py-1 font-semibold
    bg-transparent
    bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600
    bg-clip-text text-transparent
    hover:scale-105 transition-transform duration-300"
>
  {/* Shiny ray */}
  <span className="pointer-events-none absolute inset-0">
    <span
      className="absolute left-[-75%] top-0 h-full w-1/2 
        bg-gradient-to-r from-transparent via-white/40 to-transparent
        skew-x-12 animate-shine"
    />
  </span>

  Generate Revenue
</button>

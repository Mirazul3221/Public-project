"use client";
import { baseurl, suburl, viewurl } from "@/app/config";
import ProtectRoute from "@/app/global/ProtectRoute";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SuperHeader from "../../components/SuperHeader";
import QuestionCard from "../components/QuestionCard";
import { useStore } from "@/app/global/DataProvider";
import Footer from "@/app/components/Footer";
import { IoMdSettings } from "react-icons/io";
import { FiFileText } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { BsCardText } from "react-icons/bs";
import VerticleBanner from "@/app/adsterra/VerticleBanner";
import { RxCross2 } from "react-icons/rx";
import NearbyUserProfileCard from "../../components/NearbyUserProfileCard";
import { PiBookOpenTextDuotone } from "react-icons/pi";
import { TiDocumentText } from "react-icons/ti";
import { commonLogout } from "../../components/common";
import FloatingMessageContainer from "../../components/messanger/MessageContainer";
import { useSocket } from "../../global/SocketProvider";
import { useRouter } from "next/navigation";
import DisplayMemoryCard from "../components/DisplayMemoryCard";
import FrindSuggestedCard from "../../suggested_card/FrindSuggestedCard";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGlobalData } from "../../global/globalDataProvider.jsx.jsx";
import HorizontalCardScroll from "../../components/HorizontalCardScroll";
import DraggableFloatingButton from "../../components/DraggableFloatingButton";
import ProgressCard from "@/app/components/ProgressCard";
import TempMessage from "../components/TempMessage";
import ExamCard from "../components/ExamCard";
import PostCard from "../components/PostCard";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import SingleFeedModal from "../components/SingleFeedModal";
import FeedContainer from "../components/FeedContainer";
import { RiLoader3Fill } from "react-icons/ri";
import ImageCard from "../components/ImageCard";
import ImagesPostCard from "../components/ImagesPostCard";
const TurnAsHome = () => {
  const router = useRouter();
  const { dispatch, store } = useStore();
  const { appData, dispatch: globalDispatch } = useGlobalData()
  const { socket, myActiveFriends } = useSocket();
  const [deletedIds, setDeletedIds] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [switcher, setSwitcher] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [tag, setTag] = useState(null);
  const [flug, setFlug] = useState("all");
  const [randNumber, setRandNumber] = useState(0);
  // const [randNum, setRandNum] = useState(0);
  const hasMoreRef = useRef(true);

  const [feedId, setFeedId] = useState(null);
  const [type, setType] = useState(null);
  const randN = Math.floor(Math.random() * 3);
  const randRef = useRef(null)
  // Initial Fetch
  useEffect(() => {
    const rand = Math.floor(Math.random() * 10);
    const rand1 = Math.floor(Math.random() * 3 + 1);
    setRandNumber(rand)
    randRef.current = rand1
    // setRandNum(randN)
    // fetchChunkData();
  }, []); // Only once on component mount
  useEffect(() => {
    // Parse initial URL
    const params = new URLSearchParams(window.location.search);
    setFeedId(params.get("feedid"));
    setType(params.get("type"));

    // Listen to URL changes
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setFeedId(params.get("feedid"));
      setType(params.get("type"));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ["questions", flug, tag, store.token],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam?.lastCreatedAt) {
        params.append("lastCreatedAt", pageParam.lastCreatedAt);
      }

      if (pageParam?.lastId) {
        params.append("lastId", pageParam.lastId);
      }
      if (pageParam?.stage) {
        params.append("stage", pageParam.stage);
      }
      if (pageParam?.engagementScore) {
        params.append("engagementScore", pageParam.engagementScore);
      }

      if (flug) params.append("flug", flug);
      if (tag) params.append("tag", tag);
      const { data } = await axios.get(
        `${suburl}/${randRef.current === 1 ? "feed/get-all" : "userquestions/all-friends-questions"}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.nextCursor) return undefined;
      return lastPage.nextCursor;
    },

    enabled: !!store.token,
  });
  const isFeedLoading = status === "pending";

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2000
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  const reFormate = async (sub, val) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTag(val);
    setFlug(sub);

    await refetch();
  };

  // flatten questions
  const questions = (
    data?.pages?.flatMap((page) => page.data) || []
  ).filter((q) => !deletedIds.includes(q._id));
  //-----------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  //////////////////Floating messanger logic////////////////////////

  const [gard, setGard] = useState(1);
  useEffect(() => {
    setGard(gard + 1);
    if (window.innerWidth > 900) {

    }
          socket &&
        socket.on("message-from", (data) => {
          alert('data vfasfasdfadrfd')
          const { name, profile, senderId } = data;
          if (gard < 2) {
            new Audio("/notification-soun/openBox.mp3").play();
          }

          setUserDetails({ name, profile, _id: senderId });
        });
    return () => {
      socket && socket.off("message-from");
    };
  }, [socket]);

  ///////////////////////////////////////////////////////////////
  useEffect(() => {
    setSwitcher(true);
  }, [userDetails]);
  useEffect(() => {
    if (!switcher) setUserDetails(null);
  }, [switcher]);

  const [myDetails, setMyDetails] = useState();
  useEffect(() => {
    setMyDetails(appData?.globalUserProfile);
  }, [appData]);

  const logout = () => {
    dispatch({ type: "logout" });
    router.push("/login");
  };

  const [openSideMenu, setOpenSideMenu] = useState(false);


  //////////////////////////////////////locked scroll///////////////////////////////
  useEffect(() => {
    /////////////////////////////////////////////////////////////////////////////////
    if (feedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [feedId])

  const feedAfterDelete = (feed) => {
    setDeletedIds((prev) => [...prev, feed._id]);
  };

  function getGreetingMessage() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "🌅Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "☀️Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "🌇Good Evening";
    } else {
      return "🌙Good Night";
    }
  }

  return (
    <div>
      <ProtectRoute questions={questions} isFeedLoading={isFeedLoading}>
        {
          isFeedLoading && <div className="fixed top-0 left-0 z-[9999] w-[100dvw] h-[100dvh] bg-black/20 flex justify-center items-center backdrop-blur-sm animate-pulse">
            <div className="bg-white rounded-2xl"><RiLoader3Fill className="animate-spin" size={30} /></div>
          </div>
        }

        {/* Header */}
        <div className="md:px-10 px-2 py-3">
          {/* <DraggableFloatingButton /> */}
          <SuperHeader onNavigate={(id, type) => {
            setFeedId(id);
            setType(type);
          }} />
          <div className="md:hidden flex justify-between items-center">
            <div className="gap-1 justify-between md:flex my-2 px-3">
              {getGreetingMessage()}{" "}
              <span className="text-violet-500">{store?.userInfo?.name?.split(" ")[0]}!👏</span>
            </div>
          </div>
          <HorizontalCardScroll>
            <div className="md:flex whitespace-nowrap hidden">
              {appData?.rightSideBarData &&
                appData?.rightSideBarData[0]?.chapter.map((chap, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setTag(chap);
                        setFlug("chapter");
                        reFormate("chapter", chap);
                      }}
                      className=" px-4 py-1 bg-white text-gray-700 cursor-pointer rounded-md border whitespace-nowrap"
                    >
                      {chap}
                    </div>
                  );
                })}
              {appData?.rightSideBarData &&
                appData?.rightSideBarData[1]?.chapter.map((chap, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setTag(chap);
                        setFlug("chapter");
                        reFormate("chapter", chap);
                      }}
                      className=" px-4 py-1 bg-white text-gray-700 cursor-pointer rounded-md border whitespace-nowrap"
                    >
                      {chap}
                    </div>
                  );
                })}
              {appData?.rightSideBarData &&
                appData?.rightSideBarData[2]?.chapter.map((chap, i) => {
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setTag(chap);
                        setFlug("chapter");
                        reFormate("chapter", chap);
                      }}
                      className=" px-4 py-1 bg-white text-gray-700 cursor-pointer rounded-md border whitespace-nowrap"
                    >
                      {chap}
                    </div>
                  );
                })}
            </div>
          </HorizontalCardScroll>
        </div>

        {/* Main Content */}
        <div className="md:px-6 relative flex gap-4">
          {/* Sidebar (Sticky - Desktop Only) */}
          <div className="w-3/12 h-fit sticky top-24 hidden md:block">
            <div className="text-gray-700">
              {/* User Profile Link */}
              <a
                className="hover:bg-gray-200/60 rounded-md duration-300 bg-white border px-4 py-2 flex gap-2 items-center"
                href="https://eduplusplus.vercel.app/user/myprofile"
              >
                <img
                  className="w-10 rounded-full"
                  src={myDetails?.profile}
                  alt={store?.userInfo?.name}
                />
                <h2 className="font-bold">{store?.userInfo?.name}</h2>
              </a>

              {/* Sidebar Links */}
              <div className="bg-white border mt-2">
                <a
                  href="#"
                  className="flex gap-2 items-center hover:bg-gray-200/60 rounded-md duration-300 px-4 py-2"
                >
                  <BsCardText /> About
                </a>
                <a
                  href="#"
                  className="flex gap-2 items-center hover:bg-gray-200/60 rounded-md duration-300 px-4 py-2"
                >
                  <FiFileText /> Bcs Question
                </a>
                <a
                  href={`${viewurl}/user/setting`}
                  className="flex gap-2 items-center hover:bg-gray-200/60 rounded-md duration-300 px-4 py-2"
                >
                  <IoMdSettings /> Setting
                </a>
              </div>

              {/* Subject & Topic Filters */}
              <div className="max-h-[48vh] overflow-auto">
                <div className="px-4 py-2 bg-white border mt-2">
                  <p className="flex gap-2 items-center hover:bg-gray-200/60 rounded-md duration-300">
                    <PiBookOpenTextDuotone /> Subject Based Query
                  </p>
                  {appData?.rightSideBarData &&
                    appData?.rightSideBarData?.map((tag, i) => (
                      <h3
                        key={i}
                        onClick={() => {
                          setTag(tag.subject);
                          setFlug("subject");
                          reFormate("subject", tag.subject);
                        }}
                        className="mt-2 space-y-1 hover:text-black duration-200 cursor-pointer"
                      >
                        {tag.subject}
                      </h3>
                    ))}
                </div>

                <div className="px-4 py-2 bg-white border mt-2">
                  <p className="flex gap-2 items-center hover:bg-gray-200/60 rounded-md duration-300">
                    <TiDocumentText /> Topic Based Query
                  </p>
                  {appData?.rightSideBarData &&
                    appData?.rightSideBarData?.map((tag, i) => (
                      <div key={i}>
                        <h3 className="mt-2 font-semibold">{tag.subject}</h3>
                        {[...tag.chapter].reverse().map((chap, i) => (
                          <p
                            key={i}
                            onClick={() => {
                              setTag(chap);
                              setFlug("chapter");
                              reFormate("chapter", chap);
                            }}
                            className="ml-2 space-y-1 hover:text-black duration-200 cursor-pointer"
                          >
                            {chap}
                          </p>
                        ))}
                      </div>
                    ))}
                </div>
              </div>

              {/* Logout Button */}
              <div
                onClick={logout}
                className="flex gap-2 mt-2 bg-rose-100 border cursor-pointer items-center hover:bg-rose-200/60 rounded-md duration-300 px-4 py-2"
              >
                <LuLogOut /> Log out
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div
            className={`w-1/2 duration-150 fixed z-50 ${openSideMenu ? "-translate-x-[0%]" : "-translate-x-[110%]"
              } md:hidden bg-white`}
          >
            <div
              onClick={() => setOpenSideMenu(false)}
              className="ml-4 flex justify-end w-full"
            >
              <RxCross2 size={22} />
            </div>
            <div className="text-gray-700">
              <a
                href="#"
                className="flex gap-2 items-center hover:bg-gray-200/60 rounded-md duration-300 px-4 py-2"
              >
                <BsCardText /> About
              </a>
              <a
                href="#"
                className="flex gap-2 items-center hover:bg-gray-200/60 rounded-md duration-300 px-4 py-2"
              >
                <FiFileText /> Bcs Question
              </a>
              <a
                href="#"
                className="flex gap-2 items-center hover:bg-gray-200/60 rounded-md duration-300 px-4 py-2"
              >
                <IoMdSettings /> Setting
              </a>
              <div
                onClick={logout}
                className="flex gap-2 cursor-pointer items-center hover:bg-gray-200/60 rounded-md duration-300 px-4 py-2"
              >
                <LuLogOut /> Log out
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="md:w-6/12 w-full overflow-hidden md:overflow-visible px-[2px]">
            {
              (randNumber == 5 || randNumber == 7) ? <ProgressCard /> : ''
            }

            <DisplayMemoryCard />
            <div className="Add_a_question hidden rounded-md border mt-1 my-2 shadow-sm hover:shadow-md cursor-pointer duration-150 bg-white md:flex items-center gap-4 py-1 px-6">
              <img
                className="md:w-12 w-10 rounded-full border"
                src={store?.userInfo?.profile}
                alt={store?.userInfo?.name}
              />
              <button onClick={() => dispatch({ type: "OPEN_FEEDMAKER" })} className="text-left font-semibold p-2 rounded-full text-gray-600 border w-full">
                What's on your mind, {store.userInfo.name}?
              </button>
              {/* <p
                onClick={() => setOpenSideMenu(true)}
                className="md:hidden cursor-pointer"
              >
                <span>...</span>
              </p> */}
            </div>
            {/* =====================================Story sharing from here==================================== */}

            {isFeedLoading && [1, 2, 3, 4].map(i => {
              return <div key={i} className="blur-xl">
                <div className="w-20 h-20 rounded-full bg-slate-500"></div>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque nemo consequatur minus, excepturi rem necessitatibus ab provident? Voluptas corporis qui quod voluptatibus eum, quisquam omnis commodi incidunt sequi illo eius.
              </div>
            })
            }
            {questions?.map((feed, i) => (
              <div key={i} className="mx-auto">
                {/* This will render the suggestion card in the middle of the list */}
                {(i === Math.floor(Math.random() * (10 - 3 + 1)) + 3 || i === Math.floor(Math.random() * (20 - 12 + 1)) + 12) && <FrindSuggestedCard />}

                {(i === 0) && <NearbyUserProfileCard />}
                {
                  feed?.type == "mcq" && <QuestionCard
                    questionsAfterDelete={feedAfterDelete}
                    myQuestion={feed}
                    Handler={setUserDetails}
                    onNavigate={(id, type) => {
                      setFeedId(id);
                      setType(type);
                    }}
                    builderFlug={true}
                  />
                }
                {
                  feed?.type == "exam" && <ExamCard
                    examAfterDelete={feedAfterDelete}
                    myExam={feed}
                    Handler={setUserDetails}
                    onNavigate={(id, type) => {
                      setFeedId(id);
                      setType(type);
                    }}
                    builderFlug={true}
                  />
                }

                {
                  feed?.type == "post" && feed?.previewImages.length == 0 && <PostCard
                    postAfterDelete={feedAfterDelete}
                    myPost={feed}
                    Handler={setUserDetails}
                    onNavigate={(id, type) => {
                      setFeedId(id);
                      setType(type);
                    }}
                    builderFlug={true}
                  />
                }

                {/* {
                  feed?.type == "image" && <ImageCard
                    postAfterDelete={questionsAfterDelete}
                    myImage={feed}
                    Handler={setUserDetails}
                    onNavigate={(id, type) => {
                      setFeedId(id);
                      setType(type);
                    }}
                    builderFlug={true}
                  />
                } */}

                {
                  feed?.previewImages?.length > 0 && <ImagesPostCard
                    postAfterDelete={feedAfterDelete}
                    myImage={feed}
                    Handler={setUserDetails}
                    onNavigate={(id, type) => {
                      setFeedId(id);
                      setType(type);
                    }}
                    builderFlug={true}
                  />
                }
              </div>
            ))}

            {isFetchingNextPage && (
              <div className="flex gap-1 justify-center items-center mb-4">
                <AiOutlineLoading3Quarters className="animate-spin" size={15} />
                <h2>Loading...</h2>
              </div>
            )}
          </div>

          {/* Right Sidebar (e.g., Ads or Extra Info) */}
          <div className="w-3/12 hidden md:block sticky top-24 max-h-[calc(100vh-6rem)]">
            {/* <VerticleBanner /> */}
            <h2>Contacts</h2>
            {appData?.user?.length > 0 ? (
              <TempMessage globalDispatch={globalDispatch} sortedMessages={appData?.user} setUserDetails={setUserDetails} token={store?.token} />
            ) : (
              <h3>No message found</h3>
            )}
          </div>
        </div>

        {/* Footer */}
        {switcher && userDetails && (
          <div className="fixed bottom-0 left-0 md:left-auto md:right-0 z-30 border w-screen md:h-auto md:w-[25vw] bg-white">
            <FloatingMessageContainer
              id={userDetails._id}
              userDetails={userDetails}
              sortedMessages={appData?.user}
              setSwitcher={setSwitcher}
            />hfgjfhjfj
          </div>
        )}
        {
          !hasMore && <Footer />
        }
      </ProtectRoute>
    </div>
  );
};

export default TurnAsHome;

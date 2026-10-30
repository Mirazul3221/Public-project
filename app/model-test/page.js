"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useStore } from "../global/DataProvider";
import { fetchAllInit } from "./lib/api";
import ProtectRoute from "../global/ProtectRoute";
import SuperHeader from "../user/components/SuperHeader";
import Footer from "../components/Footer";
import moment from "moment";
import { RiLoopRightLine, RiResetRightFill } from "react-icons/ri";
import { viewurl } from "../config";
import { LiaTimesSolid } from "react-icons/lia";
import { v4 as uuidv4 } from "uuid";
import { FiShare2 } from "react-icons/fi";
import { handleCopyLink } from "./lib/common";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuUserRound } from "react-icons/lu";
const Page = () => {
  const { store } = useStore();
  const uuId = uuidv4();
  const [exameeName, setExameeName] = useState(store?.userInfo?.name || null);
  const token = store.token;
  const [globalData, setGlobalData] = useState([]);
  const [openWindow, setOpenWindow] = useState(false);
  const [examSetterDetails, setExamSetterDetails] = useState(null);
  const [page, setPage] = useState(0); // Current page index
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true);
  const [tag, setTag] = useState(null);
  const [flug, setFlug] = useState("all");

  const fetchChunkData = useCallback(async () => {
    if (isLoading || !hasMore) return; // Avoid duplicate requests
    setIsLoading(true);
    try {
      const data = await fetchAllInit(page * 12);
      if (data.length === 0) {
        setHasMore(false); // No more comments to fetch
      } else {
        setGlobalData((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1); // Increment page
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    fetchChunkData();
  }, []);

  const handleRedirectToStartExam = (e) => {
    e.preventDefault(); // prevent page reload
    const exameeId = store?.userInfo?.id ? store?.userInfo?.id : uuId;
    const concatData = { exameeId, exameeName, ...examSetterDetails };
    const query = encodeURIComponent(JSON.stringify(concatData));
    window.location.href = `${viewurl}/model-test/start-exam?data=${query}`;
  };

  const redirectToDashboard = (id) => {
    if (!id) return;
    window.location.href = `${viewurl}/model-test/merit-list?initId=${id}`;
  };

  const ShareAPI = () => {
    if (navigator.share) {
      navigator
        .share({
          title: examSetterDetails?.title,
          text: "Check out this model!",
          url: `https://eduplusplus.vercel.app/model-test/share/${examSetterDetails?._id}`,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Share failed:", error));
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  // Infinite Scroll Event Listener//
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !isLoading
      ) {
        fetchChunkData();
      }
    };
    //
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, [fetchChunkData, isLoading]);
  return (
    <div>
      <ProtectRoute>
        <SuperHeader />
        {openWindow && (
          <div className="fixed flex justify-center items-center w-screen h-screen bg-black/20 backdrop-blur-md top-0 z-50 left-0 p-4">
            <div className="w-full md:w-1/2">
              <div className="text-gray-700 bg-white/50 rounded-2xl p-4 relative">
                <div
                  onClick={() => {
                    setOpenWindow(false);
                    setExamSetterDetails();
                    setExameeName(store?.userInfo?.name || null);
                    document.body.style.overflow = "auto";
                  }}
                  className="absolute top-3 right-3 text-gray-700 cursor-pointer"
                >
                  <LiaTimesSolid size={25} />
                </div>
                <h2 className="font-bold md:text-2xl text-center px-3">
                  {examSetterDetails.title}
                </h2>
                <div className="gap-1 items-center hidden md:flex justify-center mt-5">
                  <img
                    className="w-28 md:h-20 md:w-20 rounded-full ring-2 ring-white"
                    src={examSetterDetails.userId.profile}
                    alt={examSetterDetails.userId.name}
                  />
                </div>

                <h2 className="font-bold md:text-2xl mt-4 text-center">
                  Author: {examSetterDetails.userId.name}
                </h2>
                <p className="text-center">
                  {examSetterDetails?.userId?.description}
                </p>
                <button
                  onClick={ShareAPI}
                  className="flex justify-center items-center underline text-center w-fit mx-auto gap-1 mt-2 rounded-xl font-semibold
                                                     transform transition-all duration-300"
                >
                  <FiShare2 size={20} /> Share this model with your friends
                </button>

                <div className="w-full flex justify-center items-center gap-2 mt-2">
                  {/* Time Card */}
                  <div className="rounded-2xl md:flex items-center gap-1 bg-gradient-to-br from-blue-50 to-blue-100 p-3 text-center shadow-sm">
                    <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                      ⏱
                    </div>
                    <p className=" text-blue-700">Time</p>
                    <p className=" text-gray-800">
                      {examSetterDetails.duration}{" "}
                      <span className="">minutes</span>
                    </p>
                  </div>

                  {/* Question Count Card */}
                  <div className="rounded-2xl md:flex items-center gap-1 bg-gradient-to-br from-green-50 to-green-100 p-3 text-center shadow-sm">
                    <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                      ?
                    </div>
                    <p className=" text-green-700">Questions</p>
                    <p className=" text-gray-800">
                      {examSetterDetails.totalQuestions}
                    </p>
                  </div>

                  {/* Negative Marking Card */}
                  <div className="rounded-2xl md:flex items-center gap-1 bg-gradient-to-br from-red-50 to-red-100 p-3 text-center shadow-sm">
                    <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
                      ✕
                    </div>
                    <p className="text-red-700">Negative</p>
                    <p className=" text-red-600">
                      {examSetterDetails.negativeMark}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={(e) => handleRedirectToStartExam(e)}>
                <div className="mt-5 text-gray-700 bg-white/50 rounded-2xl p-4">
                  <div className="relative w-full">
                    <input
                      required
                      onChange={(e) => {
                        setExameeName(e.target.value);
                      }}
                      type="text"
                      id="name"
                      value={exameeName}
                      className="peer block w-full border-black/50 appearance-none rounded-xl border bg-transparent px-4 py-3 text-gray-900 focus:border-white focus:ring-1 focus:outline-none transition-all"
                      placeholder="Enter your name (English Recommended)"
                    />
                    {/* <label
        htmlFor="name"
        className="absolute left-4 top-2.5 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-black peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-amber-600 peer-focus:text-sm"
      >
        Enter your name (English Recommended)
      </label> */}
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 w-full flex justify-center items-center gap-1 mt-2 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
                 hover:from-red-500 hover:via-pink-500 hover:to-purple-500 
                 shadow-lg transform transition-all duration-300"
                  >
                    <RiLoopRightLine /> Start Eman
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <main className="md:m-6 m-4">
          <h2 className="text-2xl mb-4 font-semibold">Model Test Exam List</h2>
          <div className="grid md:grid-cols-4 gap-2 md:gap-4">
            {globalData &&
              globalData.map((item, i) => {
                return (
                  <div>
                    <div
                      key={i}
                      className="max-w-md mx-auto rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                      {/* Header */}
                      <div className="relative bg-gradient-to-br from-indigo-500/90 to-pink-500/90">
                        <div className="flex justify-between items-start text-white ">
                        <h2 className="text-md pl-5">
                            {item.title.length > 30
                              ? item.title.slice(0, 26) + "..."
                              : item.title}
                          </h2>
                          <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-l-full text-sm font-medium">
                            👥{" "}
                            {item?.totalParticipant == 0
                              ? 0
                              : item?.totalParticipant}
                          </div>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h2 className="rounded-t-2xl ">
                          <span className="font-bold">Published : </span>
                          {moment(item.createdAt).format("DD-MM-YYYY")}
                        </h2>
                        {/* Stats */}
                        <div className="flex justify-between gap-3">
                          <Stat label="Marks" value={item.totalQuestions} />
                          <Stat label="Time" value={item.duration} />
                          <Stat label="Neg." value={item.negativeMarking} danger />
                        </div>

                        {/* Type */}
                        {/* Type */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 hidden md:block rounded-full ring-2 ring-white">
                            <img
                              className="rounded-full"
                              src={item.userId.profile}
                              alt="profile"
                            />
                          </div>
                          <LuUserRound size={25} className="p-1 md:hidden rounded-full bg-gray-50 border" />
                          <span className="text-gray-600 font-medium">
                         {item.userId.name}
                          </span>
                          
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setOpenWindow(true);
                              setExamSetterDetails(item);
                              document.body.style.overflow = "hidden";
                            }}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-200"
                          >
                            ⚡ Start Exam
                          </button>
                          <button
                            onClick={() => {
                              redirectToDashboard(item._id);
                            }}
                            className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                          >
                            🏆
                          </button>
                          <button
                            onClick={() => handleCopyLink(item._id)}
                            className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                          >
                            🔗
                          </button>
                        </div>

                        {/* Read */}
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator
                                .share({
                                  title: examSetterDetails?.title,
                                  text: "Check out this model!",
                                  url: `https://eduplusplus.vercel.app/model-test/share/${item?._id}`,
                                })
                                .then(() => console.log("Successfully shared"))
                                .catch((error) =>
                                  console.error("Share failed:", error)
                                );
                            } else {
                              alert("Sharing not supported on this browser");
                            }
                          }}
                          className="w-full border border-gray-200 rounded-xl text-indigo-600 font-semibold hover:bg-gray-50 transition"
                        >
                          Share with friends
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {isLoading && (
            <div className="flex justify-center my-4">
              <div className="flex items-center gap-2">
                <AiOutlineLoading3Quarters size={20} className="animate-spin" />
                <h2 className="text-center text-gray-700">Loading...</h2>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </ProtectRoute>
    </div>
  );
};

const Stat = ({ label, value, danger }) => (
  <div className="flex-1 rounded-2xl bg-gray-50 py-2 text-center">
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p
      className={`text-lg font-bold ${
        danger ? "text-red-500" : "text-gray-900"
      }`}
    >
      {value}
    </p>
  </div>
);
export default Page;

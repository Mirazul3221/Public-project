"use client";
import { baseurl, viewurl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import axios from "axios";
import moment from "moment";
import React, { memo, useCallback, useContext, useRef, useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import { v4 as uuidv4 } from "uuid";
import { RxCross2, RxOpenInNewWindow } from "react-icons/rx";
import CommentBox from "./CommentBox";
import { RiFileEditLine, RiLoopRightLine } from "react-icons/ri";
import { RiDeleteBin7Line } from "react-icons/ri";
import EditQuestion from "../create-post/components/EditQuestion";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { CountQuestionsCollection } from "../../global/common";
import { commonLogout } from "../../components/common";
import ProfileCard from "../../components/ProfileCard";
import { useEffect } from "react";
import { mathDocument } from "../../utils/mathJaxConfig";
import DisplayQuestion from "@/app/assistantdashboard/components/MathExpression";
import HtmlBodyParsarWithMathExp from "./HtmlBodyParsarWithMathExp";
import { useSocket } from "../../global/SocketProvider";
import CollectionsContainer from "./CollectionsContainer";
import { toast, ToastContainer } from "react-toastify";
import { LuUserRound } from "react-icons/lu";
import { LiaTimesSolid } from "react-icons/lia";
import { FiShare2 } from "react-icons/fi";

const ExamCard = ({ examAfterDelete, myExam, Handler = null, onNavigate, builderFlug }) => {
  const { store, dispatch } = useContext(storeContext);
  const uuId = uuidv4();
  const [exameeName, setExameeName] = useState(store?.userInfo?.name || null);
  const { myActiveFriends } = useSocket();
  const [openWindow, setOpenWindow] = useState(false);
  const [examSetterDetails, setExamSetterDetails] = useState(null);
  const isOnline =
    myActiveFriends && myActiveFriends?.some((O) => O === myExam.userId);
  const [edit, setEdit] = useState(false);
  const [deleteQ, setDelete] = useState(false);
  ///////////////////////////////////////Collection seve function init/////////////////////////////
  const [openCollection, setOpenCollection] = useState(false);

  ///////////////////////////////////////////count clickedOption for each question////////////////////////////////////
  const [showClickedOptionInQuestion, setShowClickedOptionInQuestion] = useState(false);
  const isClickedQuestion = useRef(false)
  ////////////////////////////////////////////////Count visitor record for each questions/////////////////////////////////
  const cardRef = useRef(null);
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


  const counted = useRef(false);
  const timerRef = useRef(null);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 1 &&
          !counted.current
        ) {
          // Start 3-second timer only once
          if (!timerRef.current) {
            timerRef.current = setTimeout(async () => {
              try {
                await axios.get(
                  `${baseurl}/user-exam-initiation/visit/${myExam._id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${store.token}`,
                    },
                  }
                );

                counted.current = true;

                if (cardRef.current) {
                  observer.unobserve(cardRef.current);
                }
              } catch (err) {
                console.error(err);
              } finally {
                timerRef.current = null;
              }
            }, 3000);
          }
        } else {
          // User left before 3 seconds
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
      },
      {
        threshold: 1, // Card must be 100% visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [myExam._id, store.token]);

  //////////////////////////////////////////////////////////////////

  const dateFormate = (createdAt) => {
    const currentYear = moment().year();
    const postYear = moment(createdAt).year();
    const format =
      currentYear === postYear ? "D MMM h:mm A" : "D MMMM h:mm A YYYY";
    const formattedDate = moment(createdAt).format(format);
    return formattedDate;
  };

  useEffect(() => {
    const el = document.getElementById("math-container");

    if (el) {
      const wasHidden = el.offsetParent === null;

      if (wasHidden) {
        el.style.display = "block";
      }

      mathDocument.convert(el, { end: el });

      if (wasHidden) {
        el.style.display = "";
      }
    }
  }, [myExam.content]);

  const handleDelete = async () => {
    return
    try {
      const { data } = await axios.get(
        `${baseurl}/userquestionss/delete-question/${myExam._id}`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      examAfterDelete(myExam);
      setDelete(false);
    } catch (error) {
      toast.error(error.response.data.message);
      commonLogout(dispatch, error);
    }
  };

  const randomCount = Math.floor(Math.random() * 360 + 1);
  return (
    <div>
      {openWindow && (
        <div className={`fixed flex justify-center items-center ${builderFlug ? "w-screen h-screen" : "w-full h-full"} bg-black/20 backdrop-blur-md top-0 z-50 left-0 p-4`}>
          <div className={`w-full ${builderFlug ? "md:w-1/2" : ""}`}>
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
                  src={examSetterDetails.profile}
                  alt={examSetterDetails.name}
                />
              </div>

              <h2 className="font-bold md:text-2xl mt-4 text-center">
                Author: {examSetterDetails.name}
              </h2>
              {/* <p className="text-center">
                {examSetterDetails?.userId?.description}
              </p> */}
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
                    {examSetterDetails.negativeMarking}
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


      <div ref={cardRef} className="md:mb-4 border-[2px] shadow-md border-x-gray-300 relative text-gray-700 bg-white md:rounded-2xl max-w-screen">
        {myExam && (
          <div>
            <div className="mt-4">
              {
                myExam.profile && <div className="flex justify-between px-4 mb-2">
                  <div className="top flex items-center gap-2">
                    <div>
                      {myExam.profile ? (
                        <ProfileCard id={myExam.userId} Handler={Handler}>
                          <div className="w-10 relative">
                            {isOnline && (
                              <div className="absolute bottom-0 right-0 z-10 w-[12px] h-[12px] bg-green-400 rounded-full border-2 border-white"></div>
                            )}
                            <img
                              className="w-full rounded-full hover:ring-[2px] cursor-pointer"
                              src={myExam.profile}
                              alt={myExam.name}
                            />
                          </div>
                        </ProfileCard>
                      ) : (
                        <div
                          style={{ background: `hsl(${randomCount}, 65%, 40%)` }}
                          className="w-10 h-10 text-white flex justify-center items-center uppercase text-2xl rounded-full"
                        >
                          {myExam.name.split("")[0]}
                        </div>
                      )}
                    </div>
                    <div className="">
                      <ProfileCard id={myExam.userId} Handler={Handler}>
                        <h2 className="font-semibold text-md cursor-pointer hover:underline">
                          {myExam.name}
                        </h2>
                      </ProfileCard>
                      <p className="text-sm">{dateFormate(myExam.createdAt)}</p>
                    </div>
                  </div>
                  {
                    builderFlug && <div>
                      {myExam.userId === store.userInfo.id ? (
                        <div className="flex gap-2 bg-slate-50 py-1 px-2 rounded-lg border">
                          <RiFileEditLine
                            onClick={() => setEdit(true)}
                            className="cursor-pointer hover:text-black duration-300"
                          />
                          <RiDeleteBin7Line
                            onClick={() => setDelete(true)}
                            className="cursor-pointer hover:text-rose-600 duration-300"
                          />
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center items-center">
                          <div className="md:hidden">
                            {myExam.isSaved ? (
                              <div
                                onClick={() => setOpenCollection(true)}
                                className="flex items-center gap-1 p-2 cursor-pointer duration-150 rounded-full"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  class="size-6 hidden md:block"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  class="size-5 md:hidden"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div
                                onClick={() => setOpenCollection(true)}
                                className="flex items-center gap-1 p-2 cursor-pointer duration-150 rounded-full"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="size-6 hidden md:block"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                  />
                                </svg>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="size-5 md:hidden "
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* =============================Call container in here================================ */}
                          {openCollection && (
                            <>
                              <CollectionsContainer
                                questionId={myExam?._id}
                                setOpenCollection={setOpenCollection}
                              />
                            </>
                          )}
                          <div className="group relative duration-500">
                            <HiOutlineDotsHorizontal size={20} />
                            <div className="hidden absolute -right-6 group-hover:inline-block w-[200px] rounded-md text-center cursor-pointer bg-gray-100 py-1 px-4">
                              <a
                                className="flex items-center gap-2"
                                target="_blank"
                                href={`${viewurl}/user/timeline/${myExam.slug}`}
                              >
                                <RxOpenInNewWindow /> <span>Open in a new tab</span>
                              </a>{" "}
                            </div>
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => examAfterDelete(myExam)}
                          >
                            <RxCross2 size={20} />
                          </div>
                        </div>
                      )}
                      <div
                        className={`${deleteQ ? "scale-105" : "scale-0"
                          } z-50 md:max-w-1/2 w-10/12 md:w-auto duration-150 px-4 md:px-10 py-6 shadow-md border-2 rounded-2xl bg-white -translate-x-[50%] -translate-y-[50%] fixed top-[50%] left-[50%]`}
                      >
                        <div className="flex justify-end">
                          <RxCross2
                            onClick={() => setDelete(false)}
                            className="cursor-pointer -mt-4 -mr-2 md:-mr-6"
                            size={18}
                          />
                        </div>
                        <h2 className="md:text-2xl text-lg mb-2">
                          Do you want to delete the question?
                        </h2>
                        <h4 className="text-sm md:text-md">{`"${myExam.title.slice(0, 50)}"`}</h4>
                        <div className="flex gap-2 justify-center mt-3">
                          <button
                            onClick={() => setDelete(false)}
                            className="bg-gray-100 px-2 rounded-md"
                          >
                            No
                          </button>
                          <button
                            onClick={() => {
                              handleDelete();
                            }}
                            className="bg-rose-200 px-2 rounded-md"
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                  }

                  {/* ///////////////////////////////////////////////////////Edit Question Form//////////////////////////////////////////////// */}
                  {edit && (
                    <div className="fixed z-50 flex justify-center items-center bg-slate-300/70 top-0 left-0 w-screen h-screen">
                      <div className="bg-white">
                        <h2 className="md:text-2xl p-4 text-center font-bold text-gray-500 mb-2">
                          Edit the question
                        </h2>
                        <div className="flex justify-end pr-10">
                          <button onClick={() => setEdit(false)}>
                            <RxCross2 size={25} />
                          </button>
                        </div>
                        {/* <div className="h-[80vh] p-2 rounded-md overflow-auto">
                    <EditQuestion Q={myExam} />
                  </div> */}
                      </div>
                    </div>
                  )}
                </div>
              }

              {/* Header */}
              <div className="relative p-2 bg-gradient-to-br from-indigo-500/90 to-pink-500/90">
                <div className="flex justify-between items-start text-white ">
                  <h2>
                    {myExam?.title?.length > 30
                      ? myExam?.title.slice(0, 26) + "..."
                      : myExam?.title}
                  </h2>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                    👥{" "}
                    {myExam?.totalParticipant == 0
                      ? 0
                      : myExam?.totalParticipant}
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="rounded-t-2xl ">
                  <span className="font-bold">Published : </span>
                  {moment(myExam.createdAt).format("DD-MM-YYYY")}
                </h2>
                {/* Stats */}
                <div className="flex justify-between gap-3">
                  <Stat label="Marks" value={myExam.totalQuestions} />
                  <Stat label="Time" value={myExam.duration} />
                  <Stat label="Neg." value={myExam.negativeMarking} danger />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setOpenWindow(true);
                      setExamSetterDetails(myExam);
                      document.body.style.overflow = "hidden";
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    ⚡ Start Exam
                  </button>
                  <button
                    onClick={() => {
                      redirectToDashboard(myExam._id);
                    }}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    🏆
                  </button>
                </div>

                {/* Read */}
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 duration-300 px-6">
          <CommentBox feed={myExam} Handler={Handler} onNavigate={onNavigate} builderFlug={builderFlug} />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}; 

const Stat = ({ label, value, danger }) => (
  <div className="flex-1 rounded-2xl bg-gray-50 py-2 text-center">
    <p className="text-xs text-gray-500 uppercase">{label}</p>
    <p
      className={`text-lg font-bold ${danger ? "text-red-500" : "text-gray-900"
        }`}
    >
      {value}
    </p>
  </div>
);

export default memo(ExamCard); //

"use client";
import { baseurl, viewurl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import "@/app/user/components/cssfiles/scrolling_bar.css";
import axios from "axios";
import "../components/likeButtonAnimation.css";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import likeAnim from '@/public/lottie/like.json';
import wowAnim from '@/public/lottie/wow.json';
import { FaComments, FaRegCommentDots, FaThumbsUp } from "react-icons/fa";
import { LuShare2 } from "react-icons/lu";
import { RiSendPlaneLine } from "react-icons/ri";
import CommentsContainer from "./FeedContainer";
import { useSocket } from "../../global/SocketProvider";
import { HiOutlineFaceFrown } from "react-icons/hi2";
import { imojis } from "../../components/imoji";
import { BiCross, BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { formatRelativeTime } from "./common";
import { commonLogout } from "../../components/common";
import ProfileCard from "../../components/ProfileCard";
import ShareComponent from "./ShareComponent";
import CommentProfile01 from "./CommentsProfile01";
import "./style.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  MdOutlineThumbDownAlt,
  MdOutlineThumbUp,
  MdThumbDown,
  MdThumbUpAlt,
} from "react-icons/md";
import ShareAPI from "./ShareApi";
import CollectionsContainer from "./CollectionsContainer";
import { addReaction } from "./api";
import { Lottie } from "lottie-react";
const CommentBox = ({ feed, Handler = null, onNavigate = null, builderFlug = false }) => {
  const handleNavigate = () => {
    if (onNavigate == null) return;
    const url = `/?feedid=${feed._id}&type=${feed.type}`;
    window.history.pushState({}, "", url);
    onNavigate?.(feed._id, feed.type);
  }
  if (!feed) return;

  const [reaction, setReaction] = useState(
    feed.reaction || null
  );

  const { store, dispatch } = useContext(storeContext);
  const { socket } = useSocket();
  // const sortComments = question?.comments.sort(
  //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  // );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCommentsBox, setOpenCommentsBox] = useState(false);

  const messangerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [putLike, setPutLike] = useState(false);
  const [hideImoji, setHideImoji] = useState(false);
  const [share, setShare] = useState(false);

  const handleShare = () => {
    setShare(true);
  };
  //====================================
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("shairBlankPoint")) {
        setShare(false);
      }
      // if (e.target.classList.contains("updateDesc")) {
      //   setControlDesc(true)
      // } else {
      //   setControlDesc(false)
      // }
    }); //
  }, []);
  useEffect(() => {
    // messangerRef.current.addEventListener("keyUp",()=>alert("helo"))
    if (messangerRef.current) {
      messangerRef.current.style.height = "auto";
      messangerRef.current.style.height = `${messangerRef.current.scrollHeight}px`;
    }
  }, [message]);

  ///////////////////////////////////////Collection seve function init/////////////////////////////
  const [openCollection, setOpenCollection] = useState(false);
  const [closingReaction, setClosingReaction] = useState(false);
  const handleEmojiClick = (type) => {
  handleReaction(type);
  setClosingReaction(true);

  setTimeout(() => {
    setShowReactionCard(false);
    setClosingReaction(false);
  }, 200);
};

  const likeEmoji = [
    { type: "like", emoji: "/lottie/like.json", label: "Like" },
    { type: "love", emoji: "/lottie/love.json", label: "Love" },
    { type: "haha", emoji: "/lottie/laugh.json", label: "Haha" },
    { type: "wow", emoji: "/lottie/wow.json", label: "Wow" },
    { type: "sad", emoji: "/lottie/crying.json", label: "Sad" },
    { type: "angry", emoji: "/lottie/angry.json", label: "Angry" },
  ];

  const handleReaction = async (type) => {
    const previousReaction = reaction;
    // Same reaction → remove
    if (previousReaction === type) {
      setReaction(null);
    } else {
      // New/switch reaction
      setReaction(type);
    }

    try {
      addReaction(feed?._id, { id: feed.userId, content: feed.type == "post" ? feed.shortText : feed.question.slice(0, 30), slug: feed.slug }, feed?.type, type, store.token, socket)
    } catch (error) {
      console.error("Reaction failed:", error);

      // Rollback UI
      setReaction(previousReaction);
    }
  };

const [showReactionCard, setShowReactionCard] = useState(false);

const reactionTimerRef = useRef(null);
const longPressTriggeredRef = useRef(false);

const startReactionTimer = (pointerType) => {
  // Clear previous timer
  if (reactionTimerRef.current) {
    clearTimeout(reactionTimerRef.current);
  }

  // Reset long press state
  longPressTriggeredRef.current = false;

  reactionTimerRef.current = setTimeout(() => {
    longPressTriggeredRef.current = true;
    setShowReactionCard(true);

    reactionTimerRef.current = null;
  }, 1000);
};


const cancelReactionTimer = () => {
  if (reactionTimerRef.current) {
    clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = null;
  }
};


useEffect(() => {
  return () => {
    if (reactionTimerRef.current) {
      clearTimeout(reactionTimerRef.current);
    }
  };
}, []);


  return (
    <div className="relative text-sm md:text-inherit">
      <div
        className={`border-b flex ${feed.totalReaction === 0 ? "justify-end" : "justify-between"
          } items-center py-2`}
      >
        {putLike ? (
          <div className="w-full">
            {feed?.reactionCounts == 0 || feed?.reactionCounts == undefined ? (
              <h4 className="flex gap-1 items-center"> <BiSolidLike /> You react this post</h4>
            ) : (
              <h4 className="flex gap-1 items-center"><BiSolidLike /> {`You and ${feed?.reactionCounts} people react this post`}</h4>
            )}
          </div>
        ) : (
          <div onClick={() => dispatch({ type: "OPEN_LIKED_CONTAINER", payload: [feed._id, feed.type] })}>
            {feed?.reactionCounts > 0 && (
              <div className="countcomments gap-2 flex items-center">
                <h4>{feed?.reactionCounts}</h4>
                <div className="flex gap-1">
                  👍❤️😂
                </div>
              </div>
            )}
          </div>
        )}

        {feed?.commentsCount > 0 && (
          <div className="countcomments gap-2 flex items-center">
            <h4>{feed.commentsCount}</h4>
            <FaComments size={18} className="hidden md:block" />
            <FaComments size={15} className="md:hidden" />
          </div>
        )}


        {feed.viewCount > 1 && (
          <div className="countcomments gap-1 flex items-center">
            <h4>{feed.viewCount}</h4>
            views
          </div>
        )}
      </div>
      <div>
        {/* <div onClick={()=>setPutLike(!putLike)} className="">gdsg</div> */}
<div
  onMouseLeave={() => {
    setShowReactionCard(false);
  }}
  className={`
    absolute
    -top-2
    z-50
    transition-all
    duration-300
    ease-out

    ${
      showReactionCard
        ? "inline-flex w-fit scale-100 opacity-100 visible"
        : "scale-0 opacity-0 invisible pointer-events-none"
    }
  `}
>
  <div
    className={`
    ${closingReaction
      ? "scale-110 duration-100"
      : "scale-100"
    }
      flex
      w-full
      items-center
      gap-1
      rounded-full
      border
      border-gray-200
      bg-white
      px-2
      py-1.5
      shadow-lg
      shadow-black/10
  `}
  >
    {likeEmoji.map((item, i) => (
      <button
        key={item.type}
        type="button"
        title={item.label}
        onClick={() => {
          handleEmojiClick(item.type)
        }}
        className={`
          group
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          transition-all
          duration-200
          ease-out
          hover:-translate-y-3
          hover:scale-125
          hover:bg-gray-100
          active:scale-110

          ${
            reaction === item.type
              ? "bg-gray-100 scale-110"
              : ""
          }
        `}
      >
        <div
          className="
            rounded-full
            overflow-hidden
            flex
            items-center
            justify-center
          "
        >
          <Lottie
            className={`rounded-full w-10 ${
              i === 4
                ? "w-8"
                : i === 5
                ? "w-[38px]"
                :  i === 0 ? "w-[38px]"  : ""
            }`}
            src={item.emoji}
            autoplay
            loop
          />
        </div>

        <span
          className="
            pointer-events-none
            absolute
            -top-8
            left-1/2
            -translate-x-1/2
            whitespace-nowrap
            rounded-md
            bg-black
            px-2
            py-1
            text-[10px]
            text-white
            opacity-0
            group-hover:opacity-100
            transition-opacity
          "
        >
          {item.label}
        </span>
      </button>
    ))}
  </div>
</div>


        <div className="footer flex justify-between items-center text-gray-500 mt-2">
          <div className="flex items-center gap-2 justify-between hover:bg-gray-100 duration-150 rounded-full p-2 bg-gray-50">
            <div 
  onPointerEnter={(e) => {
    // Only desktop mouse
    if (e.pointerType === "mouse") {
      startReactionTimer("mouse");
    }
  }}

  onPointerLeave={(e) => {
    if (e.pointerType === "mouse") {
      cancelReactionTimer();

      // Hide reaction card
      // setShowReactionCard(false);
    }
  }}


  /*
   * =========================================
   * MOBILE / TOUCH
   * =========================================
   */

  onPointerDown={(e) => {
    // Only touch devices
    if (e.pointerType === "touch") {
      startReactionTimer("touch");
    }
  }}

  onPointerUp={(e) => {
    if (e.pointerType === "touch") {
      cancelReactionTimer();
    }
  }}

  onPointerCancel={(e) => {
    if (e.pointerType === "touch") {
      cancelReactionTimer();
    }
  }}


  /*
   * =========================================
   * NORMAL CLICK / TAP
   * =========================================
   */

  onClick={() => {
    // If long press triggered reaction card,
    // don't perform normal Like click
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    // Normal click/tap = Like
    setPutLike(true);

    if (!reaction) {
      new Audio(
        "/like-justify-sound/pick-92276.mp3"
      ).play();
    }

    handleReaction("like");
  }} className="flex gap-1 items-center">
<button
  type="button"
  className={`reaction-button ${
    putLike ? "likeButtonAnimation" : ""
  }`}

>
  {reaction !== null ? (
    <p
      className={`text-[18px] ${
        putLike ? "likeButtonAnimation" : ""
      }`}
    >
      {reaction === "dislike" ? (
        <BiLike size={20} />
      ) : reaction === "like" ? (
        <BiSolidLike size={20} />
      ) : reaction === "love" ? (
        <img
          src="/lottie/love.svg"
          alt="Love"
          width={24}
          height={24}
        />
      ) : reaction === "haha" ? (
        <img
          src="/lottie/haha.svg"
          alt="Haha"
          width={24}
          height={24}
        />
      ) : reaction === "wow" ? (
        <img
          src="/lottie/wow.svg"
          alt="Wow"
          width={24}
          height={24}
        />
      ) : reaction === "sad" ? (
        <img
          src="/lottie/sad.svg"
          alt="Sad"
          width={24}
          height={24}
        />
      ) : reaction === "angry" ? (
        <img
          src="/lottie/angry.svg"
          alt="Angry"
          width={24}
          height={24}
        />
      ) : null}
    </p>
  ) : (
    <BiLike size={20} />
  )}
</button>
              {reaction === 'like' && <h2 className="text-[12px]">Like</h2>}
              {reaction === 'love' && <h2 className="text-[12px] text-rose-600">Love</h2>}
              {reaction === 'haha' && <h2 className="text-[12px] text-yellow-500">Haha</h2>}
              {reaction === 'wow' && <h2 className="text-[12px] text-amber-500">Wow</h2>}
              {reaction === 'angry' && <h2 className="text-[12px] text-red-800">Angry</h2>}
              {reaction === 'sad' && <h2 className="text-[12px] text-yellow-400">Sad</h2>}
            </div>
            <div className="w-[1px] h-[14px] text-gray-700 bg-slate-700"></div>
            <div className="flex gap-1 items-center">
              {reaction === 'dislike' && <h2 className="text-[12px]">Dislike</h2>}
              <button
                onClick={() => {
                  handleReaction('dislike')
                }
                }
              >
                {reaction === 'dislike' ? <BiSolidLike size={20} /> : <BiDislike size={20} />}
              </button>
            </div>
          </div>
          {
            builderFlug && <div
              onClick={() => { handleNavigate() }}
              className="comment flex items-center gap-2 bg-gray-50 hover:bg-gray-100 duration-150 rounded-full cursor-pointer p-2"
            >
              <FaRegCommentDots size={22} className="hidden md:block" />
              <FaRegCommentDots size={15} className="md:hidden" />
              <span>Comment</span>
            </div>
          }

          {/* {question.comments.length > 0 ? (
            <div className="comment flex items-center gap-2 bg-gray-50 hover:bg-gray-100 duration-150 rounded-full cursor-pointer p-2">
              <FaRegCommentDots size={22} className="hidden md:block" />
              <FaRegCommentDots size={15} className="md:hidden" />
              <span>Comment</span>
            </div>
          ) : (
            <div
              onClick={() => setOpen(!open)}
              className="comment flex items-center gap-2 bg-gray-50 hover:bg-gray-100 duration-150 rounded-full cursor-pointer p-2"
            >
              <FaRegCommentDots size={22} className="hidden md:block" />
              <FaRegCommentDots size={15} className="md:hidden" />
              <span>Comment</span>
            </div>
          )} */}

          {
            builderFlug && <div className="hidden md:block">
              {feed.isSaved ? (
                <div
                  onClick={() => setOpenCollection(true)}
                  className="flex items-center gap-1 p-2 cursor-pointer bg-gray-50 hover:bg-gray-100 duration-150 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 rotate-90 hidden md:block">
                    <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 rotate-90 md:hidden">
                    <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                  </svg>

                  <span>Saved</span>
                </div>
              ) : (
                <div
                  onClick={() => setOpenCollection(true)}
                  className="flex items-center gap-1 p-2 cursor-pointer bg-gray-50 hover:bg-gray-100 duration-150 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6 rotate-90 hidden md:block"
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
                    class="size-4 rotate-90 md:hidden "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                  </svg>
                  <span>Save</span>
                </div>
              )}
            </div>
          }




          {/* =============================Call container in here================================ */}
          {openCollection && (
            <>
              <CollectionsContainer
                questionId={feed?._id}
                setOpenCollection={setOpenCollection}
              />
            </>
          )}

          <div className="Share flex items-center gap-2 bg-gray-50 hover:bg-gray-100 duration-150 rounded-full cursor-pointer p-2">
            <LuShare2 size={22} className="hidden md:block" />
            <LuShare2 size={15} className="md:hidden" />
            <ShareAPI
              title={feed.question}
              uri={`userdashboard/timeline/${feed.slug}`}
            />
          </div>
        </div>

        {/* 
        <div className="display_comments p-2">
          {comments?.length > 0 && comments[0] !== undefined && (
            <div>
              {question?.totalComments > 2 && (
                <button
                  onClick={() => setOpenCommentsBox(true)}
                  className="underline"
                >
                  View more comments
                </button>
              )}


              {openCommentsBox && (
                <div className="bg-gray-500/20 w-screen z-50 h-screen fixed top-0 left-0 flex justify-center items-center">
                  <CommentsContainer
                    Handler={Handler}
                    setOpenCommentsBox={setOpenCommentsBox}
                    question={question}
                    share={share}
                    handleShare={handleShare}
                  />
                </div>
              )}
              {comments.length > 0 &&
                comments?.map((c, i) => {
                  return (
                    <div key={i} className="flex py-2 gap-2 text-gray-900">
                      <div>
                        <CommentProfile01
                          id={c?.userId}
                          name={c?.name}
                          pfl={c?.profile}
                          Handler={Handler}
                        />
                      </div>
                      <div className="w-fit max-w-11/12">
                        <div className="px-3 py-1 rounded-[20px] bg-gray-100">
                          <ProfileCard id={c?.userId} Handler={Handler}>
                            <p className="text-lg hover:underline cursor-pointer">
                              {c?.name}
                            </p>
                          </ProfileCard>
                          <p className="text-sm">{c?.comment}</p>
                        </div>
                        <p className={"text-[10px] ml-2"}>
                          {formatRelativeTime(c?.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div> */}

        {/* {openCommentsBox && (
          <div className="bg-gray-500/20 w-screen z-50 h-screen fixed top-0 left-0 flex justify-center items-center backdrop-blur-sm">
            <CommentsContainer
              Handler={Handler}
              setOpenCommentsBox={setOpenCommentsBox}
              
              share={share}
              handleShare={handleShare}
            />
          </div>
        )} */}

        {/*         
        <div
          className={`flex items-end gap-2 ${open ? "max-h-[100vh] duration-[2s]" : "max-h-0 duration-1000"
            } hidden_scroll overflow-y-scroll`}
        >
          <img
            className="w-[35px] rounded-full cursor-pointer duration-100 border hover:border-none border-gray-300"
            src={store?.userInfo?.profile}
            alt={question?.userName}
          />
          <textarea
            ref={messangerRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            placeholder="Leave your comment..."
            style={{
              width: "100%",
              resize: "none",
              overflow: "hidden",
              padding: "6px 14px",
              paddingBottom: "10 px",
              boxSizing: "border-box",
              outline: "none",
              border: "none",
              borderRadius: "20px",
              background: "#f5f5f5",
            }}
          />
          <div className="flex h-full gap-2 items-start mb-2 text-gray-500">
            <span
              onClick={() => setHideImoji(!hideImoji)}
              className="text-gray-300 cursor-pointer"
            >
              <HiOutlineFaceFrown color="gray" size={22} />
            </span>
            {!loading ? (
              <RiSendPlaneLine
                className="cursor-pointer"
                color="gray"
                onClick={() => {
                  handleSendComment(), setHideImoji(false);
                }}
                size={20}
              />
            ) : (
              <AiOutlineLoading3Quarters
                className="animate-spin text-gray-700 text-center"
                size={20}
              />
            )}
          </div>
          {hideImoji && (
            <div className="bg-white px-4 rounded-lg pb-4 border absolute bottom-12 shadow-lg right-0">
              <span
                onClick={() => setHideImoji(false)}
                className="absolute top-2 bg-slate-50 cursor-pointer right-3 rotate-45 p-1 rounded-full border"
              >
                <BiCross />
              </span>
              <h2 className="text-center font-bold py-2">Imoji corner</h2>
              <div className="h-[25vh] overflow-y-auto">
                {imojis.map((imj, i) => {
                  return (
                    <div key={i} className="">
                      <h3 className="text-gray-400 font-bold pb-[2px] mb-3 border-b">
                        {imj.type}
                      </h3>
                      <div className="grid grid-cols-6 gap-1">
                        {imj.obj.map((mg, i) => {
                          return (
                            <h2
                              key={i}
                              onClick={(e) => setMessage(message + mg)}
                              className="p-1 duration-300 hover:bg-slate-200 hover:scale-110 hover:rotate-12 cursor-pointer rounded-full border"
                            >
                              {mg}
                            </h2>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default CommentBox;

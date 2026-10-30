"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import CommentProfile from "./CommentProfile";

import { formatRelativeTime } from "./common";

import { useStore } from "@/app/global/DataProvider";

import { useSocket } from "../../global/SocketProvider";

import { suburl, viewurl } from "@/app/config";
import { PiDotsThreeOutlineLight } from "react-icons/pi";
import { BiCommentDetail, BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { addReaction } from "./api";

////////////////////////////////////////////////////////////
///////////////// NESTED COMMENT COMPONENT /////////////////
////////////////////////////////////////////////////////////

const NeatedCommentsContainer = ({
  item,
  replyToComment,
  depth = 1,
  isLast = false,
  editToComment,
}) => {
  const { myActiveFriends } = useSocket();
  const isOnline =
    myActiveFriends && myActiveFriends?.some((O) => O === item.userId._id);
  ////////////////////////////////////////////////////////////
  // CONTEXT
  ////////////////////////////////////////////////////////////

  const { store } = useStore();

  const { socket } = useSocket();

  ////////////////////////////////////////////////////////////
  // REFS
  ////////////////////////////////////////////////////////////

  const menuRef = useRef(null);

  ////////////////////////////////////////////////////////////
  // STATE
  ////////////////////////////////////////////////////////////

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [openModel, setOpenModel] = useState(false);

  const [rootComment, setRootComment] = useState(item);
  const [replies, setReplies] = useState(item?.replies || []);
  const [reaction, setReaction] = useState({
    isLike: rootComment?.isLike,
    isDisLike: rootComment?.isDislike
  });
  ////////////////////////////////////////////////////////////
  // CLICK OUTSIDE CLOSE
  ////////////////////////////////////////////////////////////

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenModel(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  ////////////////////////////////////////////////////////////
  // LIMIT DEPTH
  ////////////////////////////////////////////////////////////

  const safeDepth = Math.min(depth, 3);

  ////////////////////////////////////////////////////////////
  // DYNAMIC SPACING
  ////////////////////////////////////////////////////////////

  const spacing = {
    1: "ml-10",
    2: "ml-7",
    3: "ml-4",
  };

  ////////////////////////////////////////////////////////////
  // OPEN REPLIES
  ////////////////////////////////////////////////////////////

  const openReplies = async (parentId) => {

    try {

      setLoading(true);

      const { data } = await axios.get(
        `${suburl}/usercomments/find-nested-comments?parentCommentId=${parentId}&pageC=${page}`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      //////////////////////////////////////////////////
      // APPEND REPLIES
      //////////////////////////////////////////////////

      setReplies((prev) => [...prev, ...data]);

      setPage((prev) => prev + 1);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);

    }
  };

  ////////////////////////////////////////////////////////////
  // UI
  return (

    <div className="relative">

      {/* THREAD LINE */}

      {!isLast && (
        <div className="absolute left-3 top-0 bottom-0 border-l border-gray-300"></div>
      )}

      {/* LAST ITEM SMALL LINE */}

      {isLast && (
        <div className="absolute left-3 top-0 h-5 border-l border-gray-300"></div>
      )}

      {/* CURVE CONNECTOR */}

      <div className="absolute left-3 w-5 h-5 border-b border-gray-300 rounded-bl-2xl"></div>

      {/* COMMENT CARD */}

      <div className="flex gap-2 z-10 w-full py-2">

        {/* PROFILE */}

        <div className="shrink-0">

          <CommentProfile
            id={rootComment.userId._id}
            name={rootComment.name}
            pfl={rootComment?.userId.profile}
            Handler={null}
          />

        </div>

        {/* CONTENT */}

        <div className="max-w-[85%]">

          {/* MESSAGE BOX */}
          {
            rootComment.isDeleted ? <div className="bg-rose-300 rounded-2xl px-4 py-2 break-words">
              <p className="font-semibold text-sm">
                {rootComment.userId.name}
              </p>
              <p className="text-sm whitespace-pre-wrap break-words">
                [Comment Not Found]
              </p>

            </div> : <div className="bg-gray-100 rounded-2xl px-4 py-2 break-words">
              <a className="font-semibold text-sm hover:underline" href={`${viewurl}/user/profile/${rootComment.userId._id}`}> {rootComment.userId.name}</a>
              <p className="text-sm whitespace-pre-wrap break-words">
                {rootComment.text}
              </p>

            </div>
          }

          {
            rootComment.isDeleted ? <>
              <div className="flex gap-4 text-gray-200">
                <button>
                  Like
                </button>

                <button >
                  Dislike
                </button>

                <button
                >
                  Reply
                </button>
              </div>
            </> : <div className="flex gap-4 items-center text-xs mt-1 ml-2 text-gray-600">

              <p>
                {formatRelativeTime(rootComment.createdAt)}
              </p>

              <button
                onClick={() => {
                  addReaction(rootComment?._id, 'comment', 'like', store.token)
                  setReaction(prev => ({
                    ...prev,
                    isLike: !prev.isLike,
                    isDisLike: false
                  }))
                }
                }
              >
                {reaction.isLike ? <BiSolidLike size={15} /> : <BiLike size={15} />}
              </button>
              <button
                onClick={() => {
                  addReaction(rootComment?._id, 'comment', 'dislike', store.token)
                  setReaction(prev => ({
                    ...prev,
                    isLike: false,
                    isDisLike: !prev.isDisLike
                  }))
                }
                }
              >
                {reaction.isDisLike ? <BiSolidDislike size={15} /> : <BiDislike size={15} />}
              </button>

              <button
                onClick={() =>
                  replyToComment(rootComment, setReplies)
                }
                className="hover:underline"
              >
                <BiCommentDetail size={15} />
              </button>

              {/* MORE MENU */}

              {
                store.userInfo.id === rootComment.userId._id && (

                  <div
                    ref={menuRef}
                  >

                    {/* BUTTON */}

                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setOpenModel((prev) => !prev)
                      }
                    >
                      <PiDotsThreeOutlineLight size={25} />
                    </div>

                    {/* MENU */}

                    {
                      openModel && (

                        <div className="absolute top-0 left-[50%] -translate-x-[50%] bg-white shadow-lg border rounded-md px-2 w-28 z-50">

                          <p
                            onClick={() => {

                              editToComment(
                                {
                                  ...rootComment,
                                  isEdit: true,
                                },
                                setRootComment
                              );

                              setOpenModel(false);

                            }}
                            className="px-3 hover:bg-gray-100 cursor-pointer"
                          >
                            Edit
                          </p>

                          <p onClick={async () => {
                            const conf = confirm("Do you want to delete your comment?")
                            if (conf) {
                              await axios.get(
                                `${suburl}/usercomments/delete-comment?commentId=${rootComment._id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${store.token}`,
                                  },
                                })
                              setRootComment(p => {
                                return { ...p, isDeleted: true }
                              })
                            }
                          }} className="px-3 hover:bg-gray-100 cursor-pointer text-red-500">
                            Delete
                          </p>

                          <p className="px-3 hover:bg-gray-100 cursor-pointer">
                            Share
                          </p>

                        </div>

                      )
                    }

                  </div>

                )
              }

            </div>
          }

          {/* ACTIONS */}

          {/* OPEN REPLIES */}

          {
            rootComment.replyCount > 0 && (

              <div className="mt-2">

                <button
                  onClick={() =>
                    openReplies(rootComment._id)
                  }
                  className={`${spacing[safeDepth]} text-sm text-black hover:underline`}
                >
                  {
                    loading
                      ? "Loading..."
                      : `${rootComment.replyCount} Replies`
                  }
                </button>

              </div>

            )
          }

          {/* REPLIES */}

          {
            replies?.length > 0 && (

              <div className="mt-2">

                {
                  replies.map((reply, index) => {

                    const lastReply =
                      index === replies.length - 1;

                    return (

                      <NeatedCommentsContainer
                        key={reply._id}
                        item={reply}
                        replyToComment={replyToComment}
                        depth={safeDepth + 1}
                        isLast={lastReply}
                        editToComment={editToComment}
                      />

                    );

                  })
                }

              </div>

            )
          }

        </div>

      </div>

    </div>

  );
};

export default NeatedCommentsContainer;
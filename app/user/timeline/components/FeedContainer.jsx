"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import OnlyCard from "./OnlyCard";
import { RxCross2 } from "react-icons/rx";
import { RiSendPlaneLine } from "react-icons/ri";
import axios from "axios";
import { baseurl, suburl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import { useSocket } from "../../global/SocketProvider";
import { commonLogout } from "../../components/common";
import PostCard from "./PostCard";
import NeatedCommentsContainer from "./NeatedCommentsContainer";
import QuestionCard from "./QuestionCard";
import ExamCard from "./ExamCard";

const FeedContainer = ({
  feed,
  Handler,
  paramsData
}) => {
  const messangerRef = useRef(null);
  const commentRef = useRef(null);

  const fullName = feed?.name?.split(" ");
  const firstname = fullName?.[0];

  const { store, dispatch } = useContext(storeContext);
  const { socket } = useSocket();
const { feedId,type,parentcommentid,commentid,reactiontype} = paramsData;
  //////////////////////////////
  // STATES
  //////////////////////////////

  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // SEND COMMENT LOADING
  const [sending, setSending] = useState(false);

  const [comments, setComments] = useState([]);

  const [nestedComment, setNestedComment] = useState(
    `Leave a comment to ${firstname}`
  );

  const [parentComment, setParentComment] = useState({
    _id: null,
  });

  const [totalComments, setTotalComments] = useState(0);

  //////////////////////////////
  // REPLY PAGINATION STATE
  //////////////////////////////

  const [replyState, setReplyState] = useState({});

  //////////////////////////////
  // AUTO HEIGHT TEXTAREA
  //////////////////////////////

  useEffect(() => {
    if (messangerRef.current) {
      messangerRef.current.style.height = "auto";
      messangerRef.current.style.height = `${messangerRef.current.scrollHeight}px`;
    }
  }, [message]);

  //////////////////////////////
  // SCROLL TO BOTTOM
  //////////////////////////////

  const scrollToBottom = () => {
    setTimeout(() => {
      if (commentRef.current) {
        commentRef.current.scrollTo({
          top: commentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 200);
  };

  //////////////////////////////
  // FETCH ROOT COMMENTS
  //////////////////////////////

  const fetchTergetCommentData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${suburl}/usercomments/find-terget-comments?targetId=${feed._id}&targetType=${feed.type}&commentid=${commentid}&nestedId=${parentcommentid}`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      setComments((prev) => [...prev, ...data.comments]);

      setPage((prev) => prev + 1);

      setTotalComments(data.total);

      setLoading(false);

      scrollToBottom();
    } catch (error) {
      console.log(error);
      setLoading(false);
      commonLogout(dispatch, error);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${suburl}/usercomments/find-root-comments?targetId=${feed._id}&targetType=${feed.type}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      setComments((prev) => [...prev, ...data.comments]);

      setPage((prev) => prev + 1);

      setTotalComments(data.total);

      setLoading(false);

      scrollToBottom();
    } catch (error) {
      console.log(error);
      setLoading(false);
      commonLogout(dispatch, error);
    }
  };

  //////////////////////////////
  // INITIAL LOAD
  //////////////////////////////

  useEffect(() => {
    if(!parentcommentid,!commentid){fetchData(); return}
    fetchTergetCommentData()
    if (store.userInfo.name === feed?.name) return
    if (reactiontype || parentcommentid ||commentid) return
    // MOBILE FIX
    setTimeout(() => {
      messangerRef.current?.focus();
    }, 300);
  }, [reactiontype,parentcommentid,commentid]);

  //////////////////////////////
  // SEND COMMENT
  //////////////////////////////

  const handleSendComment = async () => {
    try {
      if (!message.trim()) return;

      setSending(true);

      ////////////////////////////
      // EDIT COMMENT
      ////////////////////////////

      if (parentComment?.isEdit) {
        if (parentComment?._id !== null) {
          await editComment(parentComment?._id);

          parentComment.setRootComment((p) => {
            return {
              ...p,
              text: message,
            };
          });
        }

        setMessage("");

        setNestedComment(`Leave a comment to ${firstname}`);

        setParentComment({
          _id: null,
        });

        setSending(false);

        return;
      }

      ////////////////////////////
      // CREATE COMMENT
      ////////////////////////////

      const { data } = await axios.post(
        `${suburl}/usercomments/create`,
        { feedAuthorId:feed.userId,
          targetId: feed._id,
          parentCommentId: parentComment?._id,
          targetType: feed.type,
          text: message,
          title:feed.type =='post' ? feed.shortText : feed.title
        },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      ////////////////////////////
      // REPLY COMMENT
      ////////////////////////////

      if (parentComment?._id !== null) {
        parentComment?.setReplies((prev) => [...prev, data.comment]);

        setParentComment({
          _id: null,
        });
      } else {
        ////////////////////////////
        // ROOT COMMENT
        ////////////////////////////

        setComments((prev) => [...prev, data.comment]);

        setTotalComments((prev) => prev + 1);

        scrollToBottom();
      }

      setNestedComment(`Leave a comment to ${firstname}`);

      setMessage("");

      setSending(false);

      ////////////////////////////
      // OPTIONAL NOTIFICATION
      ////////////////////////////

      // handleNotification("comment-question");
            data?.notifs?.map(async item => {
        await socket.emit("new-notification", item);
      })
    } catch (error) {
      console.log(error);

      setSending(false);

      commonLogout(dispatch, error);
    }
  };

  //////////////////////////////
  // EDIT COMMENT
  //////////////////////////////

  const editComment = async (id) => {
    await axios.patch(
      `${suburl}/usercomments/edit-comment?commentId=${id}`,
      {
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      }
    );
  };

  //////////////////////////////
  // NOTIFICATION
  //////////////////////////////

  const handleNotification = async (type) => {
    try {
      await axios.post(
        `${baseurl}/notification/create`,
        type === "like-question"
          ? {
            readerId: feed.userId,
            question: feed.question,
            slug: feed.slug,
            type,
          }
          : {
            readerId: feed.userId,
            question: feed.question,
            slug: feed.slug,
            comment: message,
            type,
          },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      socket && (await socket.emit("new-notification", feed.userId));
    } catch (error) {
      commonLogout(dispatch, error);
    }
  };

  //////////////////////////////
  // REPLY BUTTON
  //////////////////////////////

  const replyToComment = (item, setReplies) => {
    setNestedComment(`Reply to ${item.userId.name}`);

    setParentComment({
      ...item,
      setReplies,
    });

    ////////////////////////////
    // MOBILE SAFE FOCUS
    ////////////////////////////

    setTimeout(() => {
      messangerRef.current?.focus();

      scrollToBottom();
    }, 200);
  };

  //////////////////////////////
  // EDIT BUTTON
  //////////////////////////////

  const editToComment = (item, setRootComment) => {
    setMessage(item?.text);

    setParentComment({
      ...item,
      setRootComment,
    });

    setTimeout(() => {
      messangerRef.current?.focus();

      scrollToBottom();
    }, 200);
  };

  //////////////////////////////
  // OPEN REPLIES
  //////////////////////////////

  const openReplies = async (parentId) => {
    try {
      const currentReplyState = replyState[parentId] || {
        page: 1,
        loading: false,
        hasMore: true,
      };

      if (currentReplyState.loading) return;

      if (!currentReplyState.hasMore) return;

      ////////////////////////////
      // START LOADING
      ////////////////////////////

      setReplyState((prev) => ({
        ...prev,
        [parentId]: {
          ...currentReplyState,
          loading: true,
        },
      }));

      ////////////////////////////
      // API
      ////////////////////////////

      const { data } = await axios.get(
        `${suburl}/usercomments/find-nested-comments?parentCommentId=${parentId}&pageC=${currentReplyState.page}`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      ////////////////////////////
      // UPDATE COMMENTS
      ////////////////////////////

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === parentId
            ? {
              ...comment,

              replies:
                currentReplyState.page === 1
                  ? data
                  : [...(comment.replies || []), ...data],

              showReplies: true,
            }
            : comment
        )
      );

      ////////////////////////////
      // UPDATE PAGINATION
      ////////////////////////////

      setReplyState((prev) => ({
        ...prev,
        [parentId]: {
          page: currentReplyState.page + 1,

          loading: false,

          hasMore: data.length > 0,
        },
      }));
    } catch (error) {
      setReplyState((prev) => ({
        ...prev,
        [parentId]: {
          ...prev[parentId],
          loading: false,
        },
      }));
    }
  };
const handleClose = () => {
  window.history.back();
};
  return (
    <div
      className="
      fixed
      bottom-2
      left-[50%]
      -translate-x-[50%]
      right-0
      z-50
      bg-white
      h-[100dvh]
      w-screen
      md:h-auto
      md:max-h-[98vh]
      md:w-1/2
      md:rounded-2xl
      rounded-t-2xl
      shadow-lg
      flex
      flex-col
      overflow-hidden
    "
    >
      {/* CLOSE */}
      <span
        onClick={handleClose}
        className="
          absolute
          flex
          justify-center
          rounded-full
          cursor-pointer
          items-center
          p-2
          bg-gray-100
          top-2
          right-2
          z-50
        "
      >
        <RxCross2 size={20} />
      </span>

      {/* HEADER */}
      <div className="py-4 border-b text-center font-bold bg-white">
        {`${firstname}'s question`}
      </div>

      {/* COMMENTS AREA */}
      <div
        ref={commentRef}
        className="
          flex-1
          overflow-y-auto
          pb-5
        "
      >


        {feed.type === "post" && <PostCard myPost={feed} />}
        {feed.type === "exam" && <ExamCard  myExam={feed} />}
        {
          feed?.type == "mcq" && <QuestionCard
            myQuestion={feed}
          />
        }

        <div className="px-4">
          {comments?.map((item) => {
            return (
              <div key={item._id}>
                <NeatedCommentsContainer
                  item={item}
                  replyToComment={replyToComment}
                  editToComment={editToComment}
                  openReplies={openReplies}
                  replyState={replyState}
                  Handler={Handler}
                />
              </div>
            );
          })}

          {/* PAGINATION */}
          {!loading && totalComments !== comments.length && (
            <div className="mb-12">
              <p
                onClick={fetchData}
                className="mt-2 hover:underline cursor-pointer"
              >
                View more comments...
              </p>
            </div>
          )}

          {loading && (
            <div className="py-4 text-center">
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>

      {/* INPUT */}
      <div
        className="
          py-2
          px-4
          border-t
          bg-white
          sticky
          bottom-0
        "
      >
        <div className="flex items-end gap-2">
          <img
            className="
              w-[35px]
              h-[35px]
              object-cover
              rounded-full
              cursor-pointer
              border
              border-gray-300
            "
            src={store?.userInfo?.profile}
            alt={feed?.userName}
          />

          <textarea
            id="comment"
            ref={messangerRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            placeholder={nestedComment}
            onFocus={() => {
              setTimeout(() => {
                scrollToBottom();
              }, 300);
            }}
            className="
              w-full
              max-h-[20vh]
              overflow-auto
              bg-gray-100
              rounded-2xl
              px-4
              py-2
              outline-none
              resize-none
              hidden_scroll
            "
            style={{
              boxSizing: "border-box",
            }}
          />

          <div className="flex h-full items-center mb-2">
            <button
              disabled={!message.trim() || sending}
              onClick={handleSendComment}
              className={`
                duration-200
                ${sending || !message.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
                }
              `}
            >
              {sending ? (
                <div
                  className="
                    w-5
                    h-5
                    border-2
                    border-gray-400
                    border-t-black
                    rounded-full
                    animate-spin
                  "
                />
              ) : (
                <RiSendPlaneLine size={20} color="black" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedContainer;
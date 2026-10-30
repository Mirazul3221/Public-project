"use client";
import { baseurl, suburl, viewurl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import axios from "axios";
import moment from "moment";
import React, { memo, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";

import { RxCross2, RxOpenInNewWindow } from "react-icons/rx";
import CommentBox from "./CommentBox";
import { RiFileEditLine } from "react-icons/ri";
import { RiDeleteBin7Line } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { commonLogout } from "../../components/common";
import ProfileCard from "../../components/ProfileCard";
import { useEffect } from "react";
import { mathDocument } from "../../utils/mathJaxConfig";
import { useSocket } from "../../global/SocketProvider";
import CollectionsContainer from "./CollectionsContainer";
import { toast, ToastContainer } from "react-toastify";
import { backgroundColor } from "../create-post/components/common";
import ReadOnlyPost from "./ReadOnlyPost";
import { FaThumbtack } from "react-icons/fa";
import { BsFillPinAngleFill, BsPin } from "react-icons/bs";
import { LuPinOff } from "react-icons/lu";
import { useQueryClient } from "@tanstack/react-query";
import { GiPin } from "react-icons/gi";

const PostCard = ({ myPost, postAfterDelete, Handler = null, onNavigate, builderFlug, isPinnedFlag = false, pinnedUp = false }) => {
  const queryClient = useQueryClient();
  const { store, dispatch } = useContext(storeContext);
  const { myActiveFriends } = useSocket();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const contentRef = useRef(null);
  const isOnline =
    myActiveFriends && myActiveFriends?.some((O) => O === myPost.userId);
  const [edit, setEdit] = useState(false);
  const [deleteQ, setDelete] = useState(false);
  ///////////////////////////////////////Collection seve function init/////////////////////////////
  const [openCollection, setOpenCollection] = useState(false);
  ////////////////////////////////////////////////Count visitor record for each questions/////////////////////////////////
  const cardRef = useRef(null);
  const counted = useRef(false);
  const wrapperRef = useRef(null);
  const contentLength = myPost.contentLength;
  const textRef = useRef(null);
  const [imageHeight, setImageHeight] = useState(0);

  useLayoutEffect(() => {
    if (textRef.current) {
      setImageHeight(textRef.current.offsetHeight);
    }
  }, [preview]);
  const fontSize = useMemo(() => {
    if (contentLength < 50) {
      return "md:text-6xl text-5xl font-bold";
    }
    if (contentLength < 100) {
      return "md:text-5xl text-4xl font-bold";
    }
    if (contentLength < 200) {
      return "md:text-4xl text-3xl font-bold";
    }
    if (contentLength < 250) {
      return "md:text-3xl text-2xl";
    }
    if (contentLength < 300) {
      // setIsSetBg(true)
      return "md:text-2xl text-xl"
    };
    // setIsSetBg(false)
    return "text-sm";
  }, [contentLength]);

  const timerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.5 &&
          !counted.current
        ) {
          // Start timer if not already running
          if (!timerRef.current) {
            timerRef.current = setTimeout(async () => {
              try {
                await axios.get(
                  `${suburl}/userposts/visit/${myPost._id}`,
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
            }, 3000); // Wait 3 seconds
          }
        } else {
          // User scrolled away before 3 seconds
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
      },
      {
        threshold: 0.5, // 100% visible
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
  }, [myPost._id, store.token]);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [myPost.content]);

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
  }, [myPost.content]);


  const fetchLinkPreview = async (url) => {
    try {
      setIsPreviewLoading(true)
      const res = await fetch(
        `${suburl}/link-preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await res.json();
      setPreview(data);
      setIsPreviewLoading(false)
    } catch (err) {
      console.error(err);
      setIsPreviewLoading(false)
    }
  };


  useEffect(() => {
    if (!myPost?.content) return;

    const editorState = JSON.parse(myPost.content);

    let lastLink = null;
    function findLastLink(node) {
      if (node?.type === "link" || node?.type === "autolink") {
        lastLink = node?.url;
      }

      node?.children?.forEach(findLastLink);
    }

    findLastLink(editorState.root);
    fetchLinkPreview(lastLink)
  }, [myPost.content]);


  const handleDelete = async () => {
    try {
      const { data } = await axios.get(
        `${suburl}/userposts/delete?id=${myPost._id}&flag='text'`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      postAfterDelete(myPost);
      setDelete(false);
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
      commonLogout(dispatch, error);
    }
  };

  const randomCount = Math.floor(Math.random() * 360 + 1);

  const handleToggle = () => {
    if (!wrapperRef.current) return;

    const el = wrapperRef.current;

    if (isExpanded) {
      const rect = el.getBoundingClientRect();
      const prevBottom = rect.bottom;
      const scrollY = window.scrollY;

      // 🔴 disable animation
      setIsCollapsing(true);
      setIsExpanded(false);

      requestAnimationFrame(() => {
        const newRect = el.getBoundingClientRect();
        const newBottom = newRect.bottom;

        const diff = newBottom - prevBottom;

        window.scrollTo({
          top: scrollY + diff,
          behavior: "auto",
        });

        // ✅ re-enable animation
        requestAnimationFrame(() => {
          setIsCollapsing(false);
        });
      });
    } else {
      setIsExpanded(true);
    }
  };

  const handleTogglePin = async (postId) => {
    try {
      const url = `${suburl}/userposts/toggle-pin`;
      const response = await axios.patch(
        url,
        { postId },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      // 2. Only update React Query after backend succeeds
      if (response.data?.success) {
        queryClient.setQueryData(
          ["personalFeeds", store.token],
          (oldData) => {
            if (!oldData?.pages) return oldData;

            const allPosts = oldData.pages.flatMap(
              (page) => page.data || []
            );

            const updatedPosts = allPosts.map((post) =>
              post._id === postId
                ? {
                  ...post,
                  isPinned: !Boolean(post.isPinned),
                }
                : post
            );

            // Pinned posts first
            updatedPosts.sort(
              (a, b) =>
                Number(Boolean(b.isPinned)) -
                Number(Boolean(a.isPinned))
            );

            // Put posts back into their pages
            let index = 0;

            const updatedPages = oldData.pages.map((page) => {
              const pageSize = page.data?.length || 0;

              const newData = updatedPosts.slice(
                index,
                index + pageSize
              );

              index += pageSize;

              return {
                ...page,
                data: newData,
              };
            });

            return {
              ...oldData,
              pages: updatedPages,
            };
          }
        );
      }
    } catch (error) {
      console.log(
        "Failed to toggle pin:",
        error.response?.data || error
      );
    }
  };
  return (
    <div>
      <div ref={cardRef} className="md:mb-4 border shadow-md border-slate-200 relative text-gray-700 bg-white md:rounded-2xl max-w-screen">
        {myPost && (
          <div>
            <div className="mt-4">
              <div className="flex justify-between px-4 mb-2">
                <div className="top flex items-center gap-2">
                  <div>
                    {myPost.profile ? (
                      <ProfileCard id={myPost?.userId} Handler={Handler}>
                        <div className="w-10 relative">
                          {
                            myPost?.isPinned && pinnedUp && <div className="absolute -top-2 -right-2"><GiPin size={23}
                              color="gray"
                              style={{
                                filter: "drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white)",
                              }}
                            /></div>
                          }
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 z-10 w-[12px] h-[12px] bg-green-400 rounded-full border-2 border-white"></div>
                          )}
                          <img
                            className="w-full rounded-full hover:ring-[2px] cursor-pointer"
                            src={myPost.profile}
                            alt={myPost.name}
                          />
                        </div>
                      </ProfileCard>
                    ) : (
                      <div
                        style={{ background: `hsl(${randomCount}, 65%, 40%)` }}
                        className="w-10 h-10 text-white flex justify-center items-center uppercase text-2xl rounded-full"
                      >
                        {myPost?.name?.split("")[0]}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <ProfileCard id={myPost.userId} Handler={Handler}>
                      <h2 className="font-semibold text-md cursor-pointer hover:underline">
                        {myPost.name} {
                          myPost?.visibility == 'public' ? "🌎" : myPost?.visibility == "friends" ? "👥" : myPost?.visibility == "self" ? "🔒" : ""
                        }
                      </h2>
                    </ProfileCard>
                    <div className="flex items-center gap-1">                          {
                      myPost?.isPinned && pinnedUp && <span className="text-sm">Pinned</span>
                    }
                      <p className="text-sm">{dateFormate(myPost.createdAt)}</p>
                    </div>

                  </div>
                </div>
                {
                  builderFlug && <div>
                    {myPost.userId === store.userInfo.id ? (
                      <div className="flex gap-2 bg-slate-50 py-1 px-2 rounded-lg border">
                        <RiFileEditLine
                          onClick={() => setEdit(true)}
                          className="cursor-pointer hover:text-black duration-300"
                        />
                        <RiDeleteBin7Line
                          onClick={() => setDelete(true)}
                          className="cursor-pointer hover:text-rose-600 duration-300"
                        />
                        {
                          isPinnedFlag && <button
                            onClick={() => handleTogglePin(myPost?._id)}
                          >
                            {myPost?.isPinned ? (
                              <>
                                <LuPinOff />
                              </>
                            ) : (
                              <>
                                <BsPin />
                              </>
                            )}
                          </button>
                        }

                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center items-center">
                        <div className="md:hidden">
                          {myPost.isSaved ? (
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
                              questionId={myPost?._id}
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
                              href={`${viewurl}/user/timeline/${myPost.slug}`}
                            >
                              <RxOpenInNewWindow /> <span>Open in a new tab</span>
                            </a>{" "}
                          </div>
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => postAfterDelete(myPost)}
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
                        Do you want to delete this post?
                      </h2>
                      <h4 className="text-sm md:text-md">{`"${myPost?.shortText?.slice(0, 50)}"`}</h4>
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
                        Edit the post
                      </h2>
                      <div className="flex justify-end pr-10">
                        <button onClick={() => setEdit(false)}>
                          <RxCross2 size={25} />
                        </button>
                      </div>
                      {/* <div className="h-[80vh] p-2 rounded-md overflow-auto">
                    <EditQuestion Q={myPost} />
                  </div> */}
                    </div>
                  </div>
                )}
              </div>


              {myPost.content && (

                <>
                  {myPost.bgId == 3221 ? <div>

                    <div ref={wrapperRef} className={`w-full desc border-t p-4`}>

                      <div
                        ref={contentRef}
                        className={`relative overflow-hidden ${isCollapsing
                          ? "" // ❌ no animation during collapse
                          : "transition-[max-height] duration-500 ease-in-out"
                          }`}
                        style={{
                          maxHeight: isExpanded
                            ? contentRef.current?.scrollHeight + "px"
                            : "200px",
                        }}
                      >
                        <ReadOnlyPost content={JSON.parse(myPost.content)} />
                        {/* <HtmlBodyParsarWithMathExp content={myPost.content} /> */}

                        {/* Gradient fade (only when collapsed) */}
                        {!isExpanded && isOverflowing && (
                          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent" />
                        )}
                      </div>

                      {/* Toggle button */}
                      {isOverflowing && (
                        <button
                          onClick={handleToggle}
                          className="text-blue-500 mt-2"
                        >
                          {isExpanded ? "Show less" : "Read more..."}
                        </button>
                      )}
                    </div>

                    {preview && (
                      <div className="p-1">
                        <div onClick={() => window.open(preview.url, "_blank", "noopener,noreferrer")} className="mt-4 border rounded-xl overflow-hidden bg-white relative cursor-pointer flex">
                          {preview.image && (
                            <img
                              src={preview.image}
                              alt={preview.title}
                              className={`object-cover max-w-[50%] md:max-w-[60%]`}
                            />
                          )}

                          <div ref={textRef} className="p-3 flex-1 min-w-1/2 md:min-w-1/3">
                            <h3 className="font-semibold">
                              {preview.title}
                            </h3>

                            <p className="text-sm text-gray-500">
                              {preview.description}
                            </p>

                            <p className="text-xs text-gray-400 mt-2 break-all">
                              {preview.url}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                    : <div className={`${backgroundColor[myPost.bgId - 1].value} ${fontSize} text-center p-5 h-[300px] max-h-[400px] flex justify-center items-center text-white w-full desc border-t`}>

                      <ReadOnlyPost content={JSON.parse(myPost.content)} />
                      {/* <HtmlBodyParsarWithMathExp content={myPost.content} /> */}
                    </div>

                  }
                </>
              )}
            </div>
          </div>
        )}

        <div className="mt-2 duration-300 px-6 py-2">
          <CommentBox feed={myPost} Handler={Handler} onNavigate={onNavigate} builderFlug={builderFlug} />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};
export default memo(PostCard); //

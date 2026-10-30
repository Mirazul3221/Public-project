"use client";
import { baseurl, suburl, viewurl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import axios from "axios";
import moment from "moment";
import React, { memo, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
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
import ImageLightbox from "./ImageLightbox";
import ImagesModelBox from "./ImagesModelBox";

const SingleImageCard = ({ myImage, postAfterDelete=null, Handler = null, onNavigate, builderFlug }) => {
  const { store, dispatch } = useContext(storeContext);
  const { myActiveFriends } = useSocket();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const contentRef = useRef(null);
  const isOnline =
    myActiveFriends && myActiveFriends?.some((O) => O === myImage?.userId);
  const [edit, setEdit] = useState(false);
  const [deleteQ, setDelete] = useState(false);
  ///////////////////////////////////////Collection seve function init/////////////////////////////
  const [openCollection, setOpenCollection] = useState(false);
  ////////////////////////////////////////////////Count visitor record for each questions/////////////////////////////////
  const cardRef = useRef(null);
  const counted = useRef(false);
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const [imageHeight, setImageHeight] = useState(0);

  useLayoutEffect(() => {
    if (textRef.current) {
      setImageHeight(textRef.current.offsetHeight);
    }
  }, [preview]);
  const timerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.4 &&
          !counted.current
        ) {
          // Start timer if not already running
          if (!timerRef.current) {
            timerRef.current = setTimeout(async () => {
              try {
                await axios.get(
                  `${suburl}/userposts/visit/${myImage?._id}`,
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
        threshold: 0.4, // 100% visible
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
  }, [myImage?._id, store.token]);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [myImage?.content]);

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
  }, [myImage?.content]);


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
    if (!myImage?.content) return;

    const editorState = JSON.parse(myImage?.content);

    let lastLink = null;
    function findLastLink(node) {
      if (node.type === "link" || node.type === "autolink") {
        lastLink = node.url;
      }

      node.children?.forEach(findLastLink);
    }

    findLastLink(editorState.root);
    fetchLinkPreview(lastLink)
  }, [myImage?.content]);


  const handleDelete = async () => {
    try {
      const { data } = await axios.get(
        `${suburl}/userposts/delete?id=${myImage._id}&flag=image`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      postAfterDelete(myImage);
      setDelete(false);
    } catch (error) {
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

  return (
    <div>
      <div ref={cardRef} className="mb-4 border shadow-md border-slate-200 relative text-gray-700 bg-white md:rounded-2xl max-w-screen">
        {myImage && (
          <div>
            <div className="mt-4">
              <div className="flex justify-between px-4 mb-2">
                {
                  builderFlug && <div>
                    {myImage?.userId === store.userInfo.id ? (
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
                          {myImage?.isSaved ? (
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
                              questionId={myImage?._id}
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
                              href={`${viewurl}/user/timeline/${myImage?.slug}`}
                            >
                              <RxOpenInNewWindow /> <span>Open in a new tab</span>
                            </a>{" "}
                          </div>
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => postAfterDelete(myImage)}
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
                      <h4 className="text-sm md:text-md">{`Posted image`}</h4>
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
                    <EditQuestion Q={myImage?} />
                  </div> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
          <div className="max-h-screen">
             <img
                  src={myImage?.image}
                  alt=""
                  className="max-h-screen mx-auto rounded-md"
                /> 
          </div>
        <div className="mt-2 duration-300 px-6 py-2">
          <CommentBox feed={myImage} Handler={Handler} onNavigate={onNavigate} builderFlug={builderFlug} />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};
export default memo(SingleImageCard); //

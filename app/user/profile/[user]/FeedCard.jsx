import { baseurl, suburl } from "@/app/config";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useStore } from "@/app/global/DataProvider";
import QuestionCard from "../../timeline/components/QuestionCard";
import ExamCard from "../../timeline/components/ExamCard";
import PostCard from "../../timeline/components/PostCard";
import ImagesPostCard from "../../timeline/components/ImagesPostCard";

const FeedCard = ({ id,isfriend }) => {
    const [deletedIds, setDeletedIds] = useState([]);
    const [feedId, setFeedId] = useState(null);
    const [type, setType] = useState(null);
    const { store } = useStore()
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        status,
    } = useInfiniteQuery({
        queryKey: ["feed", store.token],
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams();
            if (pageParam?.lastCreatedAt) {
                params.append("lastCreatedAt", pageParam.lastCreatedAt);
            }
            if (pageParam?.lastId) {
                params.append("lastId", pageParam.lastId);
            }

            params.append("code", isfriend ? 3000 : 2000);
              params.append("selfId", id);
            const { data } = await axios.get(
                `${suburl}/userquestions/all-friends-questions?${params.toString()}`,
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

    const feeds = (
        data?.pages?.flatMap((page) => page.data) || []
    ).filter((q) => !deletedIds.includes(q._id));

    const feedAfterDelete = (feed) => {
        setDeletedIds((prev) => [...prev, feed._id]);
    };

    return (
        <div>
            <div className="">
                {
                    feeds.length > 0 ?  <h4 className="text-2xl text-gray-700 md:text-2xl font-semibold md:sticky top-0 mb-4">All Posts.</h4> : <p className="text-center">Posts not found!</p>
                } 
                
                  
                {feeds?.map((feed, i) => (
                    <div key={i} className="mx-auto">
                        {
                            feed?.type == "mcq" && <QuestionCard
                                questionsAfterDelete={feedAfterDelete}
                                myQuestion={feed}
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
                                Handler={null}
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
                                Handler={null}
                                onNavigate={(id, type) => {
                                    setFeedId(id);
                                    setType(type);
                                }}
                                builderFlug={true}
                                 pinnedUp = {true}
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
                                Handler={null}
                                onNavigate={(id, type) => {
                                    setFeedId(id);
                                    setType(type);
                                }}
                                builderFlug={true}
                                pinnedUp = {true}
                            />
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedCard;

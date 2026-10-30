import React, { useEffect, useMemo } from "react";
import { useGlobalData } from "../../global/globalDataProvider.jsx";
import { useStore } from "@/app/global/DataProvider.jsx";
import { commonLogout } from "../../components/common.js";
import axios from "axios";
import { baseurl } from "@/app/config.js";
import StorySlider from "../../story_sharing_components/StorySlider.jsx";
import HorizontalCardScroll from "../../components/HorizontalCardScroll.jsx";
import { useInfiniteQuery } from "@tanstack/react-query";

const DisplayMemoryCard = () => {
  const { appData, dispatch: dataDispatch } = useGlobalData();
  const { store, dispatch } = useStore();

  // useEffect(() => {
  //   fetchStory();
  // }, []);

  // const fetchStory = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `${baseurl}/usermemory/all-users-memory`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${store.token}`,
  //         },
  //       }
  //     );
  //     dataDispatch({ type: "ADD_ALL_MEMORY",payload:data});
  //   } catch (error) {
  //     commonLogout(dispatch, error);
  //   }
  // };



  const getStories = async ({ pageParam = null }) => {
     const params = new URLSearchParams();
     const { data } = await axios.get(
      `${baseurl}/usermemory/all-users-memory`,
      {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
        params: pageParam ?? {},
      }
    );

    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["stories"],
    queryFn: ({ pageParam }) => getStories({ pageParam }),

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined;
    },
  });


  const userMemories = useMemo(() => {
    return data?.pages.flatMap(page => page.stories) ?? [];
  }, [data]);

  const refetch = () => {
    if (isFetchingNextPage) return;
    if (!hasNextPage) return;

    fetchNextPage();
  };
  return (
    <div className="md:ml-0 overflow-hidden md:overflow-visible">
      <HorizontalCardScroll callBack={refetch}>
        <StorySlider userMemories={userMemories} isLoading={isLoading} isFetchingNextPage={isFetchingNextPage} />
      </HorizontalCardScroll>
    </div>
  );
};

export default DisplayMemoryCard;

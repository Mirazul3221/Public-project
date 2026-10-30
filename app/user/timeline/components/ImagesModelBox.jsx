import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

import { renderImages } from "./common";
import { useStore } from "@/app/global/DataProvider";
import { suburl } from "@/app/config";
import SingleImageCard from "./SingleImageCard";

const ImagesModelBox = ({
  totalImageCount,
  initialImages = [],
  postId,
}) => {
  const { store } = useStore();

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Modal scroll container
  const scrollRef = useRef(null);

  /**
   * Infinite query
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-images", postId],

    enabled: open && !!store?.token && !!postId,

    initialPageParam: null,

    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();

      params.append("postId", postId);
      params.append("code", "442");

      if (pageParam?.lastIndex) {
        params.append("lastIndex", pageParam.lastIndex);
      }
      const response = await axios.get(
        `${suburl}/userposts/child?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );

      return response.data;
    },

    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor || undefined;
    },
  });

  /**
   * Merge all pages
   */
  const apiImages =
    data?.pages?.flatMap((page) => page?.images || []) || [];

  /**
   * Scroll detect
   */
  useEffect(() => {
    if (!open) return;

    const container = scrollRef.current;

    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      // 300px before bottom
      if (
        scrollTop + clientHeight >= scrollHeight - 300 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [
    open,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <div>
      {/* Preview Images */}
      {renderImages(
        initialImages.length,
        totalImageCount,
        initialImages,
        setIndex,
        setOpen
      )}

      {/* Modal */}
      {open && (
        <div className="relative">
          <button
            onClick={() => setOpen(false)}
            className="fixed top-3 z-[999999] right-3 bg-white p-2 rounded-full"
          >
            <FaTimes />
          </button>
          <div
            ref={scrollRef}
            className="fixed w-screen inset-0 z-[9999] overflow-y-auto bg-black/40 backdrop-blur-sm"
          >
            {/* Close Button */}

            {/* Content */}
            <div className="md:w-5/12 mx-auto bg-white rounded-lg overflow-hidden">

              {/* API Images */}
              {apiImages.map((img, i) => (
                <div key={img._id || i}>
                  {/* <img
                  src={img.img || img.image}
                  alt=""
                  className="w-full"
                /> */}
                  <SingleImageCard myImage={img} />
                </div>
              ))}

              {/* Loading */}
              {status === "pending" && (
                <div className="p-5 text-center">
                  Loading...
                </div>
              )}

              {isFetchingNextPage && (
                <div className="p-5 text-center">
                  Loading more images...
                </div>
              )}

              {!hasNextPage && apiImages.length > 0 && (
                <div className="p-5 text-center text-gray-500">
                  No more images
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesModelBox;
"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/styles.css";
import { renderImages } from "./common";
import { suburl } from "@/app/config";
import { useStore } from "@/app/global/DataProvider";
import axios from "axios";


export default function ImageLightbox({
    totalImageCount,
  initialImages = [],
  postId,
}) {
    const {store} = useStore()
    const count = initialImages?.length;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  // Currently loaded imag
  const [images, setImages] = useState(initialImages?.map((img) => ({
  img,
  imageIndex: null,
})));
  // Prevent duplicate API calls
  const [loadingMore, setLoadingMore] = useState(false);

  // If false, don't make any more API calls
  const [hasMore, setHasMore] = useState(true);
  /*
   * Load next 5 images
   */


  const loadMoreImages = async () => {
    // Don't call API if already loading
    if (loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);

      // Last loaded image
      const lastImage = images[images.length - 1];
      const { data } = await axios.get(
        `${suburl}/userposts/child?postId=${postId}&lastIndex=${
          lastImage?.lastIndex || ""
        }&code=3221`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      /*
       * Add new images to existing images
       */

      console.log(data);
      setImages((prev) => [
        ...prev,
        ...data,
      ]);

      /*
       * If server returned less than 5,
       * there are no more images.
       */
      if (data.length < 5) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more images:", error);
    } finally {
      setLoadingMore(false);
    }
  };


  return (
<div className="relative">
     {/* Example image that opens the lightbox */}
        {renderImages(count,totalImageCount,initialImages,setIndex,setOpen)}
      {/* Lightbox */}
 <Lightbox
  open={open}
  close={() => setOpen(false)}
  index={index}
  plugins={[Zoom,Counter]}
  slides={images?.map((im) => ({
    src: im.img,
  }))}

  on={{
    view: ({ index: currentIndex }) => {
      setIndex(currentIndex);

      // When user reaches the last 2 images,
      // load the next 5 images
      if (currentIndex >= images.length - 2) {
        loadMoreImages();
      }
    },
  }}

  render={{
    controls: () => (
      <>
        {loadingMore && (
          <div
            style={{
              position: "absolute",
              bottom: "200px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 99999999,

              display: "flex",
              alignItems: "center",
              gap: "10px",

              background: "rgba(0, 0, 0, 0.7)",
              color: "#fff",

              padding: "8px 15px",
              borderRadius: "8px",

              fontSize: "14px",
              whiteSpace: "nowrap",

              pointerEvents: "none",
            }}
          >
            {/* Spinner */}
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.4)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "lightbox-spin 0.7s linear infinite",
              }}
            />

            Loading more images...
          </div>
        )}

        {/* Spinner animation */}
        <style>
          {`
            @keyframes lightbox-spin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </>
    ),
  }}
/>
</div>
  );
}
"use client";
import React, { useCallback, useState } from "react";
import ProtectRoute from "../global/ProtectRoute";
import SuperHeader from "../user/components/SuperHeader";
import Footer from "../components/Footer";
import { useEffect } from "react";
import { baseurl } from "../config";
import axios from "axios";
import { fetchMyInit } from "./api";
import InitCard from "./components/init_card";
import { useStore } from "../global/DataProvider";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Page = () => {
  const { store } = useStore();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); // Current page index
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true);

  const fetchChunkData = useCallback(async () => {
    if (isLoading || !hasMore) return; // Avoid duplicate requests
    setIsLoading(true);
    try {
      const data = await fetchMyInit(page * 8, 'published', store.token);
      if (data.length === 0) {
        setHasMore(false); // No more comments to fetch
      } else {
        setData((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1); // Increment page
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    fetchChunkData();
  }, []);

  // Infinite Scroll Event Listener//
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !isLoading
      ) {
        fetchChunkData();
      }
    };
    //
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, [fetchChunkData, isLoading]);

  return (
    <div className="md:px-10 px-4">
      <ProtectRoute>
        <SuperHeader />
        <main className="md:mt-10 mt-4 space-y-4">
          {data &&
            data.map((item, i) => {
              return <InitCard model={item} key={i} />;
            })}
        </main>
        {isLoading && (
          <div className="flex justify-center my-2">
            <div className="flex items-center gap-2">
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
              <h2 className="text-center text-gray-700">Loading...</h2>
            </div>
          </div>
        )}
        <Footer />
      </ProtectRoute>
    </div>
  );
};

export default Page;

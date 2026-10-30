"use client";

import { Suspense, useState } from "react";
import { RiLoopRightLine } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import axios from "axios";
import { baseurl, viewurl } from "@/app/config";
import Header from "@/app/components/Header";
import { setRoundedFavicon } from "../../lib/api";
import { LuLoaderPinwheel } from "react-icons/lu";
import { useStore } from "@/app/global/DataProvider";
import { FiShare2 } from "react-icons/fi";
function Page({ params }) {
  const { store } = useStore();
  const uuId = uuidv4();
  const [exameeName, setExameeName] = useState(store?.userInfo?.name || null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${baseurl}/user-exam-initiation/find-single-init/${params.token}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();
      setData(data);
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (!data) return;
    const updateFavicon = async () => {
      const rounded = await setRoundedFavicon(data.userId.profile);
      let link = document.querySelector("link[rel='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }

      link.href = rounded;
    };

    updateFavicon();
  }, [data]);

  const handleRedirectToStartExam = (e) => {
    e.preventDefault(); // prevent page reload
    const exameeId = store?.userInfo?.id ? store?.userInfo?.id : uuId;
    const concatData = { exameeId, exameeName: exameeName, ...data };
    const query = encodeURIComponent(JSON.stringify(concatData));
    window.location.href = `${viewurl}/model-test/start-exam?data=${query}`;
  };

  const ShareAPI = () => {
    if (navigator.share) {
      navigator
        .share({
          title: data?.title,
          text: "Check out this question!",
          url: `https://eduplusplus.vercel.app/model-test/share/${params.token}`,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Share failed:", error));
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[100vh] w-[100vw] bg-white fixed top-0 left-0 z-10">
          <LuLoaderPinwheel
            className="animate-spin"
            color="#b1dffa"
            size={120}
          />
        </div>
      ) : (
        <>
          <Header />
          <div className="flex justify-center items-center bg-black/20 top-0 z-50 left-0 p-4">
            <div className="w-full md:w-1/2">
              <div className="text-gray-700 bg-white/50 rounded-2xl p-4 relative">
                <h2 className="font-bold text-lg text-center">
                  {data?.title}
                </h2>
                <div className="flex gap-1 items-center justify-center mt-5">
                  <img
                    className="w-20 h-20 md:h-32 md:w-32 rounded-full md:ring-2 md:ring-white"
                    src={
                      data?.userId?.profile ||
                      "https://eduplusplus.vercel.app/icons/icon-192x192.png"
                    }
                    alt={data?.userId?.name}
                  />
                </div>

                <h2 className="font-bold text-lg mt-2 text-center">
                  {data?.userId?.name}
                </h2>
                <p className="text-center">{data?.userId?.description}</p>
                <button
                  onClick={ShareAPI}
                  className="flex justify-center items-center underline text-center w-fit mx-auto gap-1 mt-2 rounded-xl font-semibold
                     transform transition-all duration-300"
                >
                  <FiShare2 size={20} /> Share this model with your friends
                </button>
                <div className="p-4 md:flex justify-around">
                  <h2 className="rounded-t-2xl text-center md:text-inherit">
                    <span className="font-bold">Total Questions : </span>
                    {data?.totalQuestions}
                  </h2>
                  <h2 className="rounded-t-2xl text-center md:text-inherit">
                    <span className="font-bold">Duration : </span>
                    {data?.duration} minutes
                  </h2>
                  <h2 className="rounded-t-2xl text-center md:text-inherit">
                    <span className="font-bold">Negative Mark : </span>
                    {data?.negativeMark}
                  </h2>
                </div>
              </div>
              <form onSubmit={(e) => handleRedirectToStartExam(e)}>
                <div className="mt-5 text-gray-700 bg-white/50 rounded-2xl p-4">
                  <div className="relative w-full">
                    <input
                      required
                      onChange={(e) => {
                        setExameeName(e.target.value);
                      }}
                      type="text"
                      id="name"
                      value={exameeName}
                      className="peer block w-full border-black/50 appearance-none rounded-xl border bg-transparent px-4 py-3 text-gray-900 focus:border-white focus:ring-1 focus:outline-none transition-all"
                      placeholder="Enter your name (English Recommended)"
                    />
                    {/* <label
            htmlFor="name"
            className="absolute left-4 top-2.5 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-black peer-placeholder-shown:text-base peer-focus:top-2.5 peer-focus:text-amber-600 peer-focus:text-sm"
          >
            Enter your name (English Recommended)
          </label> */}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <button
                      type="submit"
                      className="px-6 py-3 w-full flex justify-center items-center gap-1 mt-2 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
                     hover:from-red-500 hover:via-pink-500 hover:to-purple-500 
                     shadow-lg transform transition-all duration-300"
                    >
                      <RiLoopRightLine /> Start Eman
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;

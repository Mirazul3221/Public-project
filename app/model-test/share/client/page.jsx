"use client";

import { Suspense, useState } from "react";
import { RiLoopRightLine } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import axios from "axios";
import { baseurl, viewurl } from "@/app/config";
import Header from "@/app/components/Header";
import { setRoundedFavicon } from "../../lib/api";
function PageContent({examData}) {
console.log('xamData');
console.log(examData);
  const store = "";
  const uuId = uuidv4();
  const [exameeName, setExameeName] = useState(store?.userInfo?.name || null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
useEffect(() => {
    if (!examData) return;
const updateFavicon = async () => {
    const rounded = await setRoundedFavicon(examData.profile);

    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = rounded;
  };

  updateFavicon();
  }, [examData]);
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${baseurl}/user-exam-initiation/find-single-init-globally/${examData.id}`
      );
      setData(data);
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    load();
  }, []);
  const handleRedirectToStartExam = (e) => {
    e.preventDefault(); // prevent page reload
    const exameeId = store?.userInfo?.id ? store?.userInfo?.id : uuId;
  const concatData = {exameeId,exameeName:examData.name,...data};
    const query = encodeURIComponent(JSON.stringify(concatData));
    window.location.href = `${viewurl}/model-test/start-exam?data=${query}`;
  };
  
  return (
    <div>
        <Header/>
      <div className="flex justify-center items-center bg-black/20 top-0 z-50 left-0 p-4">
        <div className="w-full md:w-1/2">
          <div className="text-gray-700 bg-white/50 rounded-2xl p-4 relative">
            <h2 className="font-bold text-2xl text-center">{data?.examType}</h2>
            <div className="flex gap-1 items-center justify-center mt-5">
              <img
                className="w-28 h-28 md:h-32 md:w-32 rounded-full ring-2 ring-white"
                src={examData.profile || 'https://eduplusplus.vercel.app/icons/icon-192x192.png'}
                alt={examData.name}
              />
            </div>

            <h2 className="font-bold text-2xl mt-10 text-center">
              {examData.name}
            </h2>
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
              <button
                type="submit"
                className="px-6 py-3 w-full flex justify-center items-center gap-1 mt-2 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
                     hover:from-red-500 hover:via-pink-500 hover:to-purple-500 
                     shadow-lg transform transition-all duration-300"
              >
                <RiLoopRightLine /> Start Eman
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ClientPage({searchParams}) {
    let examData = {};

  try {
    if (searchParams?.data) {
      examData = JSON.parse(decodeURIComponent(searchParams.data));
    }
  } catch (e) {
    console.error("Invalid data:", e);
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent examData={examData} />
    </Suspense>
  );
}

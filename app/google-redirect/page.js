"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useStore } from "../global/DataProvider";
import { useEffect } from "react";
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { viewurl } from "../config";

const Page = () => {
    const {dispatch} = useStore()
  const searchParams = useSearchParams();
  const getTokenFromURI = searchParams.get("token");
  const [isVarify, setIsVarify] = useState(false);
  const handlesubmit = async () => {
    try {
     localStorage.setItem("token",getTokenFromURI);

      dispatch({ type: "login_success", paylod: { token: getTokenFromURI } });
      window.location.href = `${viewurl}`
    setIsVarify(true)
    } catch (error) {
    }
  };
useEffect(() => {
handlesubmit()
}, []);//
  return (
    <div className="flex relative justify-center items-center w-screen h-screen bg-slate-100">
           <h2 className="text-gray-50 absolute top-5 text-[50px] md:text-[90px] text-center">EDU++ || ONLINE PLATFORM</h2>
      <div className="md:w-1/2 flex justify-center items-center md:h-1/2 bg-white rounded-2xl p-4">
      <div className="">
               {!isVarify ? (
        <h2 className="mx-auto flex text-gray-700 items-center gap-2">
          <AiOutlineLoading3Quarters
            className="animate-spin text-gray-700 hidden md:block text-center"
            size={40}
          />
          <AiOutlineLoading3Quarters
            className="animate-spin text-gray-700 md:hidden text-center"
            size={20}
          />
           <span className="text-3xl ml-2">Processing...</span>
        </h2>
      ) : (
   <div>
                <h2 className="mx-auto flex text-[#68ed97] items-center gap-2">
          <IoCheckmarkDoneSharp
            className=" text-gray-700 hidden md:block text-center"
            size={40} color="#68ed97"
          />
          <IoCheckmarkDoneSharp
            className=" text-gray-700 md:hidden text-center"
            size={20} color="#68ed97"
          />
           <span className="text-3xl">Done!</span>
        </h2>
        <p className="text-center flex items-center justify-center gap-1 text-sm"><AiOutlineLoading3Quarters
            className="animate-spin text-gray-700 text-center"
            size={10}
          /> Just a moment</p>
   </div>
      )}
      </div>
                 
      </div>
      <ToastContainer />
    </div>
  );
};

const Suspen = () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
};

export default Suspen;

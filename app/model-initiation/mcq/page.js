"use client";
import React, { Suspense, useEffect, useState } from "react";
import MCQForm from "../components/AddQuestions";
import ProtectRoute from "@/app/global/ProtectRoute";
import SuperHeader from "@/app/user/components/SuperHeader";
import Footer from "@/app/components/Footer";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { baseurl } from "@/app/config";
import { useStore } from "@/app/global/DataProvider";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
const Page = () => {
  const { store } = useStore();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const question = searchParams.get("question");
  const [allMcq, setAllMcq] = useState([]);
  const fetchMcq = async () => {
    try {
      const { data } = await axios.get(
        `${baseurl}/user-model-question/get-mcq-by-init/${id}`,
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
      setAllMcq(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchMcq();
  }, []);

  return (
    <div className="md:px-10 px-2">
      <ProtectRoute>
        <SuperHeader />
        <main>
          <MCQForm initId={id} questionNumber={question} setAllMcq={setAllMcq} />
          <div className="mt-4 p-2 md:p-5 bg-white rounded-2xl">
            <h1 className="text-2xl font-semibold mb-2">Question List</h1>
            {allMcq.length == 0 && <h2>MCQ Question Not Found!</h2>}
            {allMcq.length !== 0 && (
              <div className="grid md:grid-cols-3 md:gap-4">
                {allMcq.map((Item, i) => {
                  return (
                    <div className="p-4 text-gray-700 rounded-2xl border shadow-md bg-white">
                      <h2>
                        <span className="font-bold">Subject : </span>
                        {Item.subject}
                      </h2>
                      <h2 className="font-bold text-lg">
                        {i + 1}) {Item.question}
                      </h2>
                      <p className="my-2 flex gap-1 items-center">
                        {" "}
                        <span className="w-5 h-5 rounded-full flex justify-center items-center border">
                          1
                        </span>{" "}
                        {Item.option01}
                      </p>
                      <p className="my-2 flex gap-1 items-center">
                        {" "}
                        <span className="w-5 h-5 rounded-full flex justify-center items-center border">
                          2
                        </span>{" "}
                        {Item.option02}
                      </p>
                      <p className="my-2 flex gap-1 items-center">
                        {" "}
                        <span className="w-5 h-5 rounded-full flex justify-center items-center border">
                          3
                        </span>{" "}
                        {Item.option03}
                      </p>
                      <p className="my-2 flex gap-1 items-center">
                        {" "}
                        <span className="w-5 h-5 rounded-full flex justify-center items-center border">
                          4
                        </span>{" "}
                        {Item.option04}
                      </p>

                      <h2>
                        <span className="font-bold">Correct Answer : </span>
                        {Item.correctAns}
                      </h2>

                      <div className="flex flex-wrap gap-3 p-2">
                        <button className="ring-1 py-1 px-4 rounded-lg duration-300 bg-slate-700 hover:bg-slate-900 text-white">
                          <span className="flex gap-1 items-center">
                            <CiEdit /> Edit
                          </span>
                        </button>
                        <button className="ring-1 py-1 px-4 rounded-lg duration-300 bg-rose-500 hover:bg-rose-700 text-white">
                          <span className="flex gap-1 items-center">
                            <MdOutlineDeleteOutline /> Delete
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </ProtectRoute>
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
//
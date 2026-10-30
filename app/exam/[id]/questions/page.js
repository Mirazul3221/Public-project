"use client";
import { useStore } from "@/app/global/DataProvider";
import ProtectRoute from "@/app/global/ProtectRoute";
import SuperHeader from "@/app/user/components/SuperHeader";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  deleteQuestion,
  fetchExamModle,
  fetchQuestions,
  publishExam,
} from "../../api/api";
import MCQForm from "@/app/model-initiation/components/AddQuestions";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import ExamCard from "../../components/ExanCard";
import EditQuestionForm from "../../components/EditExamCard";
import Footer from "@/app/components/Footer";

const page = ({ params }) => {
  const { id } = params;
  const { store } = useStore();
  const [model, setModle] = useState(null);
  const [allMcq, setAllMcq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [singleModle, setSingleModel] = useState("");
  const [checkStatus, setCheckStatus] = useState(model?.status);
  const load = async () => {
    const data = await fetchExamModle(id, store.token);
    setCheckStatus(data.status);
    setModle(data);
    if (data) {
      const data = await fetchQuestions(id, store.token);
      setAllMcq(data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePublish = async () => {
    setLoading(true);
    const data = await publishExam(
      model?._id,
      model?.totalQuestions,
      store.token,
    );
    setLoading(false);
    setCheckStatus(data);
  };

  const handleEdit = (item) => {
    setSingleModel(item);
    setOpenEditor(true);
  };
  const closeForm = () => {
    setSingleModel("");
    setOpenEditor(false);
  };
  return (
    <div className="p-4">
      {openEditor && (
        <div className="w-[100dvw] overflow-y-auto fixed top-0 left-0 h-[100dvh] bg-white z-50">
          <EditQuestionForm
            singleModle={singleModle}
            closeForm={closeForm}
            setAllMcq={setAllMcq}
          />
        </div>
      )}
      <ProtectRoute>
        <SuperHeader />
        {checkStatus == "published" ? (
          <ExamCard check={checkStatus} model={model} />
        ) : (
          <div className="md:w-10/12 mx-auto md:p-4">
            <div className="md:p-10 p-5 flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 border rounded-2xl md:my-5">
              <div className="text-white">
                <h2 className="text-xl text-white">{model?.title}</h2>
                <p>
                  Added Questions ({allMcq.length}/{model?.totalQuestions})
                </p>
              </div>
              <div>
                {model?.totalQuestions !== allMcq?.length ? (
                  <h2 className="md:p-4 p-2 hidden md:block text-amber-400 border border-amber-500 bg-amber-50 rounded-lg">
                    Need {model?.totalQuestions - allMcq.length} questions to
                    publish
                  </h2>
                ) : (
                  <h2 className="">
                    {checkStatus == "draft" ? (
                      <button
                        disabled={loading}
                        onClick={handlePublish}
                        className="py-1 px-2 rounded-md border-2 border-white text-white"
                      >
                        {loading ? "Loading..." : "Publish"}
                      </button>
                    ) : (
                      ""
                    )}
                  </h2>
                )}
              </div>
            </div>
            {model && model?.totalQuestions !== allMcq?.length && (
              <MCQForm
                initId={id}
                questionNumber={model?.totalQuestions}
                setAllMcq={setAllMcq}
              />
            )}

            <div className="mt-4 p-2 md:p-5 bg-white rounded-2xl">
              <h1 className="text-2xl font-semibold mb-2">Question List</h1>
              {allMcq.length == 0 && (
                <h2 className="p-4 bg-white text-center md:my-5">
                  MCQ Question Not Found!
                </h2>
              )}
              {allMcq.length !== 0 && (
                <div className="space-y-2">
                  {allMcq.map((Item, i) => {
                    return (
                      <div
                        key={i}
                        className="p-4 text-gray-700 rounded-2xl border shadow-md bg-white"
                      >
                        <div className="flex justify-between">
                          <h2>
                            <span className="font-bold">Subject : </span>
                            {Item.subject}
                          </h2>
                          <div className="flex flex-wrap gap-3 p-2">
                            <button
                              onClick={() => handleEdit(Item)}
                              className="py-1 px-2 text-[10px] rounded-lg duration-300 border border-slate-700 bg-slate-100 hover:bg-slate-300 text-slate-700"
                            >
                              <span className="flex gap-1 items-center">
                                <CiEdit /> Edit
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                const isOk = confirm(
                                  "Are you want to delete this question?",
                                );
                                if (isOk) deleteQuestion(Item._id, store.token);
                                setAllMcq((prev) =>
                                  prev.filter((item) => item._id !== Item._id),
                                );
                              }}
                              className="py-1 px-2 text-[10px] rounded-lg duration-300 border border-rose-700 bg-rose-100 hover:bg-rose-300 text-rose-700"
                            >
                              <span className="flex gap-1 items-center">
                                <MdOutlineDeleteOutline /> Delete
                              </span>
                            </button>
                          </div>
                        </div>
                        <h2 className="font-bold text-lg">
                          {i + 1}) {Item.question}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
                          <p
                            className={`p-2 rounded-md border flex gap-1 items-center ${Item.correctAns == 1 ? "bg-green-50 border-green-500" : ""}`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex justify-center items-center border`}
                            >
                              1
                            </span>
                            {Item.option01}
                          </p>
                          <p
                            className={`p-2 rounded-md border flex gap-1 items-center ${Item.correctAns == 2 ? "bg-green-50 border-green-500" : ""}`}
                          >
                            <span className="w-5 h-5 rounded-full flex justify-center items-center border">
                              2
                            </span>
                            {Item.option02}
                          </p>
                          <p
                            className={`p-2 rounded-md border flex gap-1 items-center ${Item.correctAns == 3 ? "bg-green-50 border-green-500" : ""}`}
                          >
                            <span className="w-5 h-5 rounded-full flex justify-center items-center border">
                              3
                            </span>
                            {Item.option03}
                          </p>
                          <p
                            className={`p-2 rounded-md border flex gap-1 items-center ${Item.correctAns == 4 ? "bg-green-50 border-green-500" : ""}`}
                          >
                            <span className="w-5 h-5 rounded-full flex justify-center items-center border">
                              4
                            </span>
                            {Item.option04}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        <Footer />
      </ProtectRoute>
    </div>
  );
};

export default page;

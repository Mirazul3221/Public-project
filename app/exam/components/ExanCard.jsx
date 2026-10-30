"use client";
import { FiEdit, FiShare2, FiTrash2, FiEye } from "react-icons/fi";
import { BsBarChart, BsQuestionCircle } from "react-icons/bs";
import moment from "moment";
import { deleteModel, publishExam } from "../api/api";
import { useStore } from "@/app/global/DataProvider";
import { useState } from "react";
import { viewurl } from "@/app/config";

export default function ExamCard({ model, check = "" }) {
  const { store } = useStore();
  const [checkStatus, setCheckStatus] = useState(check);
  const [loading, setLoading] = useState(false);

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

  const handleDel = async () => {
    const isOk = confirm("Are you sure?");
    if (!isOk) return;
    await deleteModel(model?._id, store.token);
    // window.location.href = ''
  };

  return (
    <div className="w-full max-w-6xl rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span
            className={`uppercase rounded-full ${checkStatus === "published" ? "bg-green-100 text-green-400" : "bg-rose-300 text-red-500"} px-3 py-1 text-xs font-semibold`}
          >
            {checkStatus}
          </span>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            FREE
          </span>
          <span className="text-sm text-gray-500">
            {moment(model?.createdAt).format("DD MMM, YYYY")}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {loading ? (
            <button className="w-full sm:w-auto rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Loading...
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="w-full sm:w-auto rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              {checkStatus === "published" ? "Make Draft" : "Publish"}
            </button>
          )}
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">
            <FiShare2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {model?.title}
        </h2>
        <p className="mt-1 text-sm font-medium text-purple-600">
          {model?.category}
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 border-y bg-gray-50 px-4 sm:px-6 py-5 text-center">
        <Stat label="Duration" value={`${model?.duration} min`} />
        <Stat label="Questions" value={`${model?.totalQuestions}`} />
        <Stat label="Total Marks" value={`${model?.totalQuestions}`} />
        <Stat label="Attempts" value="0" valueClass="text-purple-600" />
        <Stat label="Avg Score" value="0.0" valueClass="text-green-600" />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => {
              window.location.href = `${viewurl}/exam/edit/${model?._id}`;
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
        bg-green-100 text-green-700`}
          >
            <FiEdit size={16} />
            Edit
          </button>

          <button
            onClick={() => {
              window.location.href = `${viewurl}/exam/${model?._id}/questions`;
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
        bg-purple-100 text-purple-700`}
          >
            <BsQuestionCircle size={16} />
            Questions
          </button>

          <button
            onClick={() => {
              window.location.href = `${viewurl}/model-test/merit-list?initId=${model?._id}`;
            }}
            className={`flex bg-blue-100 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
         text-blue-700`}
          >
           <BsBarChart size={16} />
            Results
          </button>


          <button
            onClick={() => {
              window.location.href = `${viewurl}/model-test/share/${model?._id}`;
            }}
            className={`flex bg-slate-100 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
         text-slate-700`}
          >
          <FiEye size={16} />
        Preview
          </button>
        </div>

        <button
          onClick={handleDel}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
        >
          <FiTrash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------- Sub Components ---------- */

function Stat({ label, value, valueClass = "text-gray-900" }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-lg sm:text-xl font-semibold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function ActionButton({ icon, label, active, activeBlue }) {
  return (
    <button
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
        ${
          active
            ? "bg-purple-100 text-purple-700"
            : activeBlue
              ? "bg-blue-100 text-blue-700"
              : "border hover:bg-gray-50"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

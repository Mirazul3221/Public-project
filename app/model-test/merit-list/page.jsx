"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useEffect } from "react";
import { meritListChart, meritListChartWithPagination } from "../lib/api";
import Header from "@/app/components/Header";
import Script from "next/script";
import { FcPositiveDynamic } from "react-icons/fc";

const Page = () => {
  const searchParams = useSearchParams();
  const initId = searchParams.get("initId");
  const [meritListData, setMeritListData] = useState();
  const [page, setPage] = useState(3);
  const [load, setLoad] = useState(false);
  const [tableData, setTableData] = useState();
  useEffect(() => {
    const load = async () => {
      const finalResult = await meritListChart(initId);
      console.log(finalResult);
      setMeritListData(finalResult);
      setTableData(finalResult.meritList);
    };
    try {
      load();
    } catch (error) {
      console.log(error);
    }
  }, [initId]);
  const loadMore = async () => {
    const data = await meritListChartWithPagination(
      initId,
      page,
      setPage,
      setLoad,
    );
    console.log(data);
    if (data) {
      setTableData((prev) => [...prev, ...data]);
    }
  };

  return (
    <div>
      <Header />
      {meritListData && (
        <div className="md:mx-20 mx-2 mt-3 mb-20">
          <div className="flex justify-center text-2xl gap-2 items-center px-4 w-fit mx-auto rounded-xl">
            {" "}
            <FcPositiveDynamic size={30} /> Dashboard{" "}
          </div>
          <h2 className="rounded-t-2xl text-center text-lg tracking-widest">
            <span className="font-bold">Total Candidates : </span>
            {meritListData?.examInfo?.totalParticipant}
          </h2>

          <div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-1">
              <h2 className="rounded-t-2xl">
                <span className="font-bold">Exam Type : </span>
                {meritListData.examInfo.examType} |
              </h2>
              <h2 className="rounded-t-2xl">
                <span className="font-bold">Total Questions : </span>
                {meritListData.examInfo.totalQuestions} |
              </h2>
              <h2 className="rounded-t-2xl">
                <span className="font-bold">Duration : </span>
                {meritListData.examInfo.duration} |
              </h2>
              <h2 className="rounded-t-2xl">
                <span className="font-bold">Negative Mark : </span>
                {meritListData.examInfo.negativeMark}
              </h2>
            </div>
          </div>

          <div className="md:p-6">
            <MeritListTable meritList={tableData} />
          </div>

          {meritListData?.examInfo?.totalParticipant > 20 && (
            <div className="flex justify-center items-center mx-auto">
              <button
                className="bg-gradient-to-r from-red-500 via-[#8d3dfc] to-[#21fcc2] mt-4 text-white px-6 py-2 rounded-lg ring-1"
                disabled={load}
                onClick={loadMore}
              >
                {load ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}

      <Script
        type="text/javascript"
        src="//pl27981621.effectivegatecpm.com/08/48/30/084830966751eea67ac5267f1ef31be9.js"
      ></Script>
      <Script
        type="text/javascript"
        src="//pl28107125.effectivegatecpm.com/6e/c0/7f/6ec07fb285e7a2a0c9dc89d2e54b6c36.js"
      ></Script>
    </div>
  );
};

const Suspen = () => (
  <Suspense>
    <Page />
  </Suspense>
);

export default Suspen;

function MeritListTable({ meritList = [] }) {
  return (
    <div className="md:w-10/12 mx-auto overflow-x-auto border bg-white">
      <table className="min-w-full text-center border-collaps">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr className="bg-cyan-100/50 font-semibold text-[16px]">
            <th className="p-4 border-b">Rank</th>
            <th className="p-4 border-b">Username</th>
            <th className="p-4 border-b">Obtained</th>
          </tr>
        </thead>
        <tbody>
          {meritList.length > 0 ? (
            meritList.map((item, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-4 border-b border-r font-medium text-gray-800">
                  {index + 1}
                </td>
                <td className="p-4 border-b">{item.exameeName}</td>
                <td className="p-4 py-2 border-b border-l font-semibold">
                  {item.obtainedMark}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500 italic">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

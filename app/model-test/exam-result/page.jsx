"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useEffect } from "react";
import { callEachUserResult, evaluateExam } from "../lib/api";
import ExamReviewCard from "../components/ExamReviewCard";
import ResultPieChart from "../components/ResultPieChart";
import Header from "@/app/components/Header";
import Script from "next/script";
import { FcPositiveDynamic } from "react-icons/fc";
import { viewurl } from "@/app/config";
import CounterBoard from "../components/CounterBoard";

const Page = () => {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const [finalData, setFinalData] = useState();
  useEffect(() => {
    const load = async (data) => {
      const finalResult = await callEachUserResult(data);
      const evaluation = evaluateExam(finalResult);
      const final = { questions: finalResult.attatcedMcq, evaluation };
      setFinalData(final);
    };
    try {
      const examData = JSON.parse(decodeURIComponent(encodedData));
      load(examData);
    } catch (error) {
      console.log(error);
    }
  }, [encodedData]);

  const redirectToDashboard = () => {
    const paramData = JSON.parse(decodeURIComponent(encodedData));
    if (!paramData) return;
    window.location.href = `${viewurl}/model-test/merit-list?initId=${paramData.modelTestId}`;
  };

  return (
    <div>
      <Header />
      <div className="md:mx-20">
        <div className="mt-5">
          <ResultPieChart evaluation={finalData?.evaluation} />
        </div>
        {finalData && (
          <div
            onClick={redirectToDashboard}
            className="flex justify-center cursor-pointer gap-2 items-center px-4 py-2 my-5 border border-gray-300 w-fit mx-auto shadow-md rounded-xl"
          >
            <FcPositiveDynamic size={22} /> Dashboard{" "}
          </div>
        )}
        <CounterBoard data={finalData?.evaluation}/>
        <div className="mt-5">
          {finalData && <ExamReviewCard final={finalData} />}
        </div>
      </div>
            <Script
        type="text/javascript"
        src="//pl27981621.effectivegatecpm.com/08/48/30/084830966751eea67ac5267f1ef31be9.js"
      ></Script>
      <Script
        type="text/javascript"
        src='//pl28107125.effectivegatecpm.com/6e/c0/7f/6ec07fb285e7a2a0c9dc89d2e54b6c36.js'
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

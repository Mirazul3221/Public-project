"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { AttachedQuestionsWithInit, setRoundedFavicon } from "../lib/api";
import ExamController from "../components/examcontroller";

const Page = () => {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState(null);
  useEffect(() => {
    const randNumb = Math.floor(Math.random() * 3 + 1);
    try {
      if (encodedData) {
        const examData = JSON.parse(decodeURIComponent(encodedData));
        setExamData({randNumb,...examData});
        // ✅ Dynamically set document title
        document.title = `${examData.userId.name} - ${examData.title}`;

        // ✅ Helper to update or create meta tag
        const setMeta = (name, content, property = false) => {
          let selector = property
            ? `meta[property='${name}']`
            : `meta[name='${name}']`;
          let meta = document.querySelector(selector);
          if (!meta) {
            meta = document.createElement("meta");
            if (property) meta.setAttribute("property", name);
            else meta.setAttribute("name", name);
            document.head.appendChild(meta);
          }
          meta.setAttribute("content", content);
        };

        // ✅ Set meta tags dynamically
        setMeta(
          "description",
          `Take the ${examData.title} test with ${examData.totalMarks} marks and ${examData.duration} minutes.`
        );
        setMeta("og:title", examData.title, true);
        setMeta(
          "og:description",
          `Test your knowledge on ${examData.title}`,
          true
        );
        setMeta(
          "og:image",
          examData.userId?.profile || "/default-og.png",
          true
        );
        setMeta("og:type", "website", true);
        // ✅ Set favicon dynamically
        const updateFavicon = async () => {
          const rounded = await setRoundedFavicon(examData.userId?.profile);

          let link = document.querySelector("link[rel='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }

          link.href = rounded;
        };

        updateFavicon();
      }
    } catch (err) {
      console.error("Error setting metadata:", err);
    }
  }, [encodedData]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await AttachedQuestionsWithInit(examData?._id);
      setQuestions(data);
    };
    load();
    if (!mounted) return;
    return () => {
      mounted = false;
    };
  }, [examData, encodedData]);
console.log(examData)
  return (
    <div>
      {examData !== null && (
        <ExamController questionsData={questions} examData={examData} />
      )}
    </div>
  );
};

const Suspen = () => (
  <Suspense>
    <Page />
  </Suspense>
);

export default Suspen;

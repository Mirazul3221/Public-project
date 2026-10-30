"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { submitAnswer } from "../lib/api";
import { gradients } from "../lib/common";

const ExamController = ({ questionsData, examData }) => {
  const timeRef = useRef();
  const [startExam, setStartExam] = useState(true);
  const [selectAll, setSelectAll] = useState(0);
  const [mcqRecord, setMcqRecord] = useState([]);
  const [correctAns, setCorrectAns] = useState(0);
  const [wrongAns, setWrongAns] = useState(0);
  const [negitiveMarks, setNegitiveMarks] = useState(0);
  const selectAllRef = useRef(selectAll);
  const mcqRecordRef = useRef(mcqRecord);

  // NEW: store question box refs
  const questionRefs = useRef([]);

  // Update refs
  useEffect(() => {
    selectAllRef.current = selectAll;
    mcqRecordRef.current = mcqRecord;
  }, [selectAll, mcqRecord]);

  // 🔥 NEW FUNCTION — AUTO SCROLL
  const scrollToQuestion = (index) => {
    const element = questionRefs.current[index];
    if (!element) return;

    const rect = element.getBoundingClientRect();

    if (rect.top <= 10) return; // Already near top → NO SCROLL

    const scrollAmount = rect.top - 80; // 80px for header gap

    window.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });
  };
  const getSubmitterRecord = () => ({
    controllerId:examData.userId._id,
    modelTestId: examData._id,
    exameeId: examData.exameeId,
    examee: examData.exameeName,
    negativeMark:examData.negativeMarking,
    totalQuestions: questionsData.length,
    obtainedMark: Math.max(0, correctAns - wrongAns * negitiveMarks),
    submittedData: mcqRecordRef.current,
  });


  // Select option
  const checkAns = (e, ans, index) => {
    if (!startExam) return;

    // 🔥 trigger auto scroll
    scrollToQuestion(index);

    const selectedData = questionsData[index].correctAns;
    const parentBox = e.target.parentElement.parentElement;
    const getAttribute = parseInt(parentBox.getAttribute("data-select"));
    setTimeout(() => {
      parentBox.setAttribute("data-select", getAttribute + 1);
    }, 100);

    setMcqRecord((prev) => {
      const updated = prev.filter((item) => item.index !== index);
      return [...updated, { index, pressed: ans }];
    });

    if (getAttribute === selectedData) {
      const audio = new Audio("/notification-soun/1sec.mp3");
      audio.volume = 0.1;
      audio.play();
      if (questionsData[index].correctAns === ans) {
        const optionDiv = e.target.parentElement.children[0];
        optionDiv.classList.add("text-white", "bg-gray-700");
        setCorrectAns((prev) => prev + 1);
        setSelectAll((prev) => prev + 1);
      } else {
        const optionDiv = e.target.parentElement.children[0];
        optionDiv.classList.add("text-white", "bg-gray-700");
        setSelectAll(selectAll + 1);
        setWrongAns((prev) => prev + 1);
        setNegitiveMarks(examData.negativeMarking);
      }
    }
  };


  // TIMER EFFECT
  useEffect(() => {
    if (!startExam || !questionsData?.length) return;
    timeRef.current.classList.add("text-cyan-500");

    let allTime = examData?.duration * 60;
    let midTime = allTime / 3;
    let playedMidAlarm = false;
    let playedFinalAlarm = false;

    const intervalId = setInterval(async () => {
      allTime--;

      const hours = Math.floor(allTime / 3600);
      const minutes = Math.floor((allTime % 3600) / 60);
      const seconds = allTime % 60;

      if (timeRef.current) {
        timeRef.current.innerText = `${hours} : ${minutes
          .toString()
          .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
      }

      if (!playedMidAlarm && allTime <= midTime) {
        playedMidAlarm = true;
        timeRef.current.classList.remove("text-cyan-500");
        timeRef.current.classList.add("text-amber-500");

        const audio = new Audio("/notification-soun/time-alarm.mp3");
        audio.volume = 0.1;
        audio.play();

        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 5000);
      }

      if (allTime <= 60) {
        timeRef.current.classList.remove("text-amber-500");
        timeRef.current.classList.add("text-rose-500");
      }

      if (!playedFinalAlarm && allTime <= 30) {
        playedFinalAlarm = true;
        timeRef.current.classList.remove("text-amber-500");
        timeRef.current.classList.add("text-rose-700");

        const audio = new Audio("/notification-soun/alert_alert_clock_s3.mp3");
        audio.volume = 0.1;
        audio.play();

        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 30000);
      }

      if (allTime <= 0) {
        clearInterval(intervalId);
        setStartExam(false);
        timeRef.current.innerText = `0 : 00 : 00`;

        if (selectAllRef.current <= Math.floor(questionsData.length / 3)) {
          alert(
            `⚠️ Time is up but you must answer at least ${Math.floor(
              questionsData.length / 3
            )} questions before submitting. Please try again.`
          );
          return;
        }

        await submitAnswer(
          getSubmitterRecord(),
          "Time is up and",
          "Time is up but"
        );
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startExam, questionsData?.length]);

  // Auto submit when all answered
  useEffect(() => {
    if (!startExam || selectAll !== questionsData?.length) return;

    const timer = setTimeout(async () => {
      setStartExam(false);
      timeRef.current.innerText = `0 : 00 : 00`;
      await submitAnswer(
        getSubmitterRecord(),
        "All questions answered and",
        "All questions answered but"
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [selectAll, startExam, questionsData?.length]);

  // Manual submit
  const HandleMCQSubmit = async () => {
    if (selectAll <= Math.floor(questionsData.length / 3)) {
      alert(
        `⚠️ You must answer at least ${Math.floor(
          questionsData.length / 3
        )} questions before submitting.`
      );
      return;
    }

    setStartExam(false);
    timeRef.current.innerText = `0 : 00 : 00`;
    await submitAnswer(getSubmitterRecord(), "");
  };
  const stableGradients = useMemo(() => {
    const rand = Math.floor(Math.random() * 9);
    return questionsData?.map(() => {
      if (rand == 0)
        return `${gradients[Math.floor(Math.random() * gradients.length)]}`;
      if (rand == 1) return `bg-black/5`;
      if (rand == 2) return `bg-[#73b55c]/5`;
      if (rand == 3) return `bg-[#735cb5]/5`;
      if (rand == 4) return `bg-[#a85cb5]/5`;
      if (rand == 5) return `bg-[#5c9fb5]/5`;
      if (rand == 6) return `bg-[#b55c5f]/5`;
      if (rand == 7) return `bg-[#b31973]/5`;
      if (rand == 8) return `bg-[#19b0b3]/5`;
    });
  }, [questionsData]);
  return (
    <div className="relative">
      <div className="header bg-white top-0 left-0 px-4 py-2 sticky w-full z-50">
        <h2 className="text-center text-2xl">{examData?.title}</h2>
        <div className="flex justify-center items-center gap-1 text-[12px]">
          <p>
            <span>Time Left </span> :{" "}
            <span ref={timeRef} className={`duration-500`}>
              Timing...
            </span>
          </p>
          |
          <p>
            Attempted {selectAll} questions | Remaining(
            {questionsData?.length - selectAll})
          </p>
        </div>
      </div>

      <div className={`grid md:grid-cols-${examData.randNumb} gap-3 mt-4 mx-4 ${examData.randNumb == 1 ? "md:mx-32 md:gap-6":"md:mx-10 md:gap-4" }`}>
        {questionsData?.map((value, index) => {
          const randomGradient = stableGradients[index];
          return (
            <div
              key={index}
              ref={(el) => (questionRefs.current[index] = el)} // 🔥 attach ref
              className={`question_box p-3 md:p-6 rounded-lg shadow-md backdrop-blur-md ${randomGradient}`}
            >
              <div className="flex gap-4">
                <h2 className="font-semibold">
                  {index + 1}) {value.question}
                </h2>
              </div>

              <div
                data-select={value.correctAns}
                className="option_box space-y-2 mt-2"
              >
                {[
                  value.option01,
                  value.option02,
                  value.option03,
                  value.option04,
                ].map((option, i) => (
                  <div
                    key={i}
                    className="relative px-2 bg-gray-400/10 duration-500 rounded-lg"
                  >
                    <div className="__option_number__ absolute border-2 border-white top-[5px] rounded-full bg-gray-400 w-6 h-6 flex justify-center items-center">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <p
                      onClick={(e) => checkAns(e, i + 1, index)}
                      className="__option_value__ cursor-pointer w-[90%] rounded-full px-2 py-[5px] mx-5"
                    >
                      {option}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {
        !questionsData &&  <div className="text-center">Loading...</div>
      }
     

      {
        questionsData &&       <button
        disabled={!startExam}
        onClick={HandleMCQSubmit}
        className="mx-4 my-2 md:mx-10 bg-gradient-to-r from-red-500 via-[#8d3dfc] to-[#21fcc2] mt-4 text-white px-6 py-2 rounded-lg ring-1"
      >
        Submit Answer
      </button>
      }
    </div>
  );
};

export default ExamController;

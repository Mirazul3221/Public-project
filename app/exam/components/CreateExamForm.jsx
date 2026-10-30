"use client";

import { useState } from "react";
import ProtectRoute from "@/app/global/ProtectRoute";
import { viewurl } from "@/app/config";
import Footer from "@/app/components/Footer";
import { useStore } from "@/app/global/DataProvider";
import { createExam } from "../api/api";

export default function CreateExamForm() {
  const { store } = useStore();
  const [form, setForm] = useState({
    title: "",
    category: "",
    totalQuestions: "",
    duration: "",
    negativeMarking: "0.25",
    examType: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const isValid = Object.values(form).every(Boolean);
    if (!isValid) return;
    try {
      const data = await createExam(store.userInfo.id, store.token, form);
      window.location.href = `${viewurl}/exam/${data}/questions`;
    } catch (error) {
      console.log(error);
    }
  };

  const error = (field) => submitted && !form[field];

  return (
      <div className="rounded-3xl bg-white shadow-lg mx-auto">
        <div
          class="w-full hidden md:flex rounded-t-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
         p-4 sm:p-6 
        flex-col sm:flex-row 
         sm:items-center sm:justify-between 
         gap-4"
        >
          <div class="flex items-start gap-3 sm:gap-4 text-white">
            <div class="bg-white/20 p-2 sm:p-3 rounded-lg text-lg sm:text-xl">
              ✏️
            </div>

            <div>
              <h2 class="text-xl sm:text-2xl font-semibold">Create New Exam</h2>
              <p class="text-xs sm:text-sm text-white/80 max-w-md">
                Define the structure and rules for your examination
              </p>
            </div>
          </div>
          <div
            class="flex items-center gap-2 bg-white/20 
           px-3 py-1.5 sm:px-4 sm:py-2 
           rounded-full text-white 
           text-xs sm:text-sm font-medium 
           self-start sm:self-auto"
          >
            ⏰<span class="bg-blue-600 px-2 py-0.5 rounded-md">Setup</span>
            Required
          </div>
        </div>

        <div className="md:p-10 p-4 space-y-5 mt-5">
          {/* Exam Title */}
          <div>
            <label className="font-semibold text-sm">Exam Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Primary Head teacher Written Examination"
              className={`input ${error("title") && "input-error"}`}
            />
            {error("title") && (
              <p className="error-text">The title field is required.</p>
            )}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Category */}
            <div>
              <label className="font-semibold text-sm">Select Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`input ${error("category") && "input-error"}`}
              >
                <option value="">Select</option>
                <option value="admission-test">Admission Test</option>
                <option value="bank-exam">Bank Exam</option>
                <option value="bcs-exam">BCS Exam</option>
                <option value="bengali-lesson">Bengali Lesson</option>
                <option value="current-affairs">Current Affairs</option>
                <option value="english-lesson">English Lesson</option>
                <option value="general-knowledge">General Knowledge</option>
                <option value="general-science">General Science</option>
                <option value="hsc-exam">HSC Exam</option>
                <option value="ict-computer">ICT & Computer</option>
                <option value="jsc-exam">JSC Exam</option>
                <option value="math-logic">Math & Logic Skills</option>
                <option value="multiple-subjects">Multiple Subjects</option>
                <option value="ntrca-exam">NTRCA Exam</option>
                <option value="primary-exam">Primary Exam</option>
                <option value="ssc-exam">SSC Exam</option>
                <option value="technical-studies">Technical Studies</option>
                <option value="other-topics">Other Topics</option>
              </select>
              {error("category") && (
                <p className="error-text">Category is required.</p>
              )}
            </div>

            {/* Total Questions */}
            <div>
              <label className="font-semibold text-sm">Total Questions</label>
              <input
                name="totalQuestions"
                value={form.totalQuestions}
                onChange={handleChange}
                type="number"
                placeholder="Minimum 10 questions"
                className={`input ${error("totalQuestions") && "input-error"}`}
              />
              {error("totalQuestions") && (
                <p className="error-text">Minimum 10 questions required.</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="font-semibold text-sm">
                Duration (Minutes)
              </label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                type="number"
                placeholder="Recommended: 20–30"
                className={`input ${error("duration") && "input-error"}`}
              />
              {error("duration") && (
                <p className="error-text">Duration is required.</p>
              )}
            </div>

            {/* Negative Marking */}
            <div>
              <label className="font-semibold text-sm">Negative Marking</label>
              <select
                name="negativeMarking"
                value={form.negativeMarking}
                onChange={handleChange}
                className={`input ${error("negativeMarking") && "input-error"}`}
              >
                <option selected value="0.25">
                  0.25 (Standard)
                </option>
                <option value="0.5">0.5</option>
                <option value="0">No Negative</option>
              </select>
              {error("negativeMarking") && (
                <p className="error-text">Negative marking is required.</p>
              )}
            </div>

            {/* Exam Type */}
            <div>
              <label className="font-semibold text-sm">Exam Type</label>
              <select
                name="examType"
                value={form.examType}
                onChange={handleChange}
                className={`input ${error("examType") && "input-error"}`}
              >
                <option value="">Select type</option>
                <option value="free">Free (Public)</option>
                <option value="paid">Paid (Private)</option>
              </select>
              {error("examType") && (
                <p className="error-text">Exam type is required.</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 border-t">
            <p className="text-sm hidden md:flex text-gray-500">
              ℹ️ All fields are required to proceed
            </p>

            <button
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-95"
            >
              Next: Add Questions →
            </button>
          </div>
        </div>
      </div>
  );
}

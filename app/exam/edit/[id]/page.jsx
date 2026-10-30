"use client";
import { useStore } from "@/app/global/DataProvider";
import SuperHeader from "@/app/user/components/SuperHeader";
import { useEffect } from "react";
import { useState } from "react";
import { fetchExamModle, updateModel } from "../../api/api";
import { viewurl } from "@/app/config";

export default function Page({ params }) {
  const { id } = params;
  const { store } = useStore();
  const [form, setForm] = useState({});
  const load = async () => {
    const data = await fetchExamModle(id, store?.token);
    const {category,duration,examType,negativeMarking,title,totalQuestions} = data;
    setForm({category,duration,examType,negativeMarking,title,totalQuestions});
  };
  useEffect(() => {
    load();
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
     
    const isValid = Object.values(form).every(Boolean);
    if (!isValid) return;
    try {
      setLoading(true);
      const data = await updateModel(id, form, store.token);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSubmitted(false);
      window.location.href = `${viewurl}/exam/${id}/questions`
    }
  };

  const error = (field) => submitted && !form[field];

  return (
    <div className="md:px-10">
      <SuperHeader />
      <div className="rounded-3xl md:mx-20 bg-white shadow-lg">
        <div className="md:p-10 p-4 space-y-5 mt-5">
          {/* Exam Title */}
          <div>
            <label className="font-semibold text-sm">Exam Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`input ${error("title") && "input-error"}`}
            />
            {error("title") && <p className="error-text">Title is required.</p>}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="font-semibold text-sm">Category</label>
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
                type="number"
                name="totalQuestions"
                value={form.totalQuestions}
                onChange={handleChange}
                className={`input ${error("totalQuestions") && "input-error"}`}
              />
              {error("totalQuestions") && (
                <p className="error-text">Total questions required.</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="font-semibold text-sm">
                Duration (Minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className={`input ${error("duration") && "input-error"}`}
              />
              {error("duration") && (
                <p className="error-text">Duration required.</p>
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
                <option value="0.25">0.25</option>
                <option value="0.5">0.5</option>
                <option value="0">No Negative</option>
              </select>
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
                <option value="">Select</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
              {error("examType") && (
                <p className="error-text">Exam type required.</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
            >
              {loading ? "Updating..." : "Go ➤"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

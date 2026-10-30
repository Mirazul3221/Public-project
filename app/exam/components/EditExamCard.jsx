"use client";
import { useStore } from "@/app/global/DataProvider";
import { useState } from "react";
import { updateQuestion } from "../api/api";

export default function EditQuestionForm({ singleModle, closeForm , setAllMcq}) {
  const { store } = useStore();
  const {
    _id,
    question,
    option01,
    option02,
    option03,
    option04,
    correctAns,
    subject,
    explanation,
  } = singleModle;
  const [form, setForm] = useState({
    question,
    option01,
    option02,
    option03,
    option04,
    correctAns,
    subject,
    explanation,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const isValid = Object.entries(form)
      .filter(([key]) => key !== "explanation")
      .every(([, value]) => value);
    if (!isValid) return;
    try {
      setLoading(true);
      const data = await updateQuestion(_id, form, store.token);
      setAllMcq((prev) =>
        prev.map((item) =>
          item._id === _id
            ? { ...item, ...data } // merge updated fields
            : item,
        ),
      );

      closeForm();
    } catch (error) {
      console.error("Error:", error);
      console.log(error);
    } finally {
      setLoading(false);
      setSubmitted(false);
    }
  };

  const error = (field) => submitted && !form[field];

  return (
    <div className="mt-20">
      <div onClick={closeForm} className="absolute top-20 right-3">
        Close
      </div>
      <div className="rounded-3xl bg-white shadow-lg mx-auto">
        <div className="md:p-10 p-4 space-y-5 mt-5">
          {/* Exam Title */}
          <div>
            <label className="font-semibold text-sm">Exam Title</label>
            <textarea
              name="question"
              value={form.question}
              onChange={handleChange}
              placeholder="e.g. Primary Head teacher Written Examination"
              className={`input ${error("question") && "input-error"}`}
            ></textarea>
            {error("question") && (
              <p className="error-text">The title field is required.</p>
            )}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* option01 */}
            <div>
              <label className="font-semibold text-sm">Option 1</label>
              <input
                name="option01"
                value={form.option01}
                onChange={handleChange}
                type="text"
                placeholder="Answer option..."
                className={`input ${error("option01") && "input-error"}`}
              />
              {error("option01") && (
                <p className="error-text">The option 1 field is required.</p>
              )}
            </div>

            {/* option02 */}
            <div>
              <label className="font-semibold text-sm">Option 2</label>
              <input
                name="option02"
                value={form.option02}
                onChange={handleChange}
                type="text"
                placeholder="Answer option..."
                className={`input ${error("option02") && "input-error"}`}
              />
              {error("option02") && (
                <p className="error-text">The option 2 field is required.</p>
              )}
            </div>

            {/* option03 */}
            <div>
              <label className="font-semibold text-sm">Option 3</label>
              <input
                name="option03"
                value={form.option03}
                onChange={handleChange}
                type="text"
                placeholder="Answer option..."
                className={`input ${error("option03") && "input-error"}`}
              />
              {error("option03") && (
                <p className="error-text">The option 3 field is required.</p>
              )}
            </div>

            {/* option04 */}
            <div>
              <label className="font-semibold text-sm">Option 4</label>
              <input
                name="option04"
                value={form.option04}
                onChange={handleChange}
                type="text"
                placeholder="Answer option..."
                className={`input ${error("option04") && "input-error"}`}
              />
              {error("option04") && (
                <p className="error-text">The option 4 field is required.</p>
              )}
            </div>

            {/* Right Answer */}
            <div>
              <label className="font-semibold text-sm">
                Select Right Answer
              </label>
              <select
                name="correctAns"
                value={form.correctAns}
                onChange={handleChange}
                className={`input ${error("correctAns") && "input-error"}`}
              >
                <option selected value="">
                  Select
                </option>
                <option value="1">Option 01</option>
                <option value="2">Option 02</option>
                <option value="3">Option 03</option>
                <option value="4">Option 04</option>
              </select>
              {error("correctAns") && (
                <p className="error-text">Right answer is required.</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="font-semibold text-sm">
                Select Right Answer
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={`input ${error("subject") && "input-error"}`}
              >
                <option selected value="">
                  Select a Subject
                </option>
                <option value="current">Current Affairs</option>
                <option value="bangla">Bangla</option>
                <option value="english">English</option>
                <option value="math">Math</option>
                <option value="gk">Gk</option>
              </select>
              {error("subject") && (
                <p className="error-text">Category is required.</p>
              )}
            </div>
          </div>

          {/* Exam description */}
          <div>
            <label className="font-semibold text-sm">Write a description</label>
            <textarea
              name="explanation"
              value={form.explanation}
              onChange={handleChange}
              placeholder="e.g. Primary Head teacher Written Examination"
              className={`input ${error("explanation") && "input-error"}`}
            ></textarea>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-95"
            >
              {loading ? "Loading..." : "Edit Question"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

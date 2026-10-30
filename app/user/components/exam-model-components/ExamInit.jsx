"use client";
import { baseurl, viewurl } from "@/app/config";
import { useStore } from "@/app/global/DataProvider";
import axios from "axios";
import { useState } from "react";

export default function ExamInitForm() {
  const {store} = useStore();
  const [formData, setFormData] = useState({
    examType: "",
    duration: "",
    negativeMark: "",
    totalQuestions: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
           await axios.post(
             `${baseurl}/user-exam-initiation/create-exam`,
             {userId:store.userInfo.id,...formData},
             {
               headers: {
                 Authorization: `Bearer ${store.token}`,
               },
             }
           );
        setMessage("✅ Exam created successfully!");

      // Clear form after successful submission
      setFormData({
        examType: "",
        duration: "",
        negativeMark: "",
        totalQuestions: "",
        status: "active",
      });
      window.location.href = `${viewurl}/model-initiation`;
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-white shadow-md rounded-xl mx-4 md:p-8 p-2">
      <h2 className="text-2xl font-bold text-gray-600 mb-6 text-center">
        Create Exam
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Exam Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Exam Type</label>
          <input
            type="text"
            name="examType"
            value={formData.examType}
            onChange={handleChange}
            placeholder="e.g. BCS, Bank, NTRCA"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 60"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Negative Mark */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Negative Mark
          </label>
          <input
            type="number"
            step="0.01"
            name="negativeMark"
            value={formData.negativeMark}
            onChange={handleChange}
            placeholder="e.g. 0.25"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Total Marks */}
        <div>
          <label className="block text-sm font-medium mb-1">Total questions</label>
          <input
            type="number"
            name="totalQuestions"
            value={formData.totalQuestions}
            onChange={handleChange}
            placeholder="e.g. 100"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Paid Status */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Paid Status</label>
          <select
            name="paidStatus"
            value={formData.paidStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div> */}

        {/* Status */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div> */}

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200 ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Saving..." : "Save Exam"}
          </button>
        </div>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

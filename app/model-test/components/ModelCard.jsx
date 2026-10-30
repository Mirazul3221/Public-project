import React from "react";

const ExamCard = () => {
  return (
    <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg bg-white border">
      {/* Header Gradient */}
      <div className="relative h-16 bg-gradient-to-r from-indigo-500 via-green-400 to-pink-500 px-4 py-3">
        <span className="text-white text-sm font-semibold">
          1 WEEK AGO
        </span>

        {/* Participants */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full text-indigo-600 text-sm font-semibold">
          👥 13
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            বাংলা ব্যাকরণ Model - 2
          </h2>
          <span className="inline-block mt-1 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium">
            বাংলা ব্যাকরণ
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x border rounded-xl text-center py-3">
          <div>
            <p className="text-xs text-gray-500">MARKS</p>
            <p className="font-bold text-lg">20</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">TIME</p>
            <p className="font-bold text-lg">15m</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">NEG.</p>
            <p className="font-bold text-lg text-red-500">0.25</p>
          </div>
        </div>

        {/* Exam Type */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
            U
          </div>
          <span className="text-gray-600 font-medium">BDMCQ</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-semibold transition">
             Start Exam
          </button>

          <button className="w-11 h-11 flex items-center justify-center rounded-xl border hover:bg-gray-100">
            🏆
          </button>

          <button  className="w-11 h-11 flex items-center justify-center rounded-xl border hover:bg-gray-100">
            🔗
          </button>

          <button className="flex items-center gap-2 border px-4 py-2 rounded-xl hover:bg-gray-100 text-indigo-600 font-semibold">
            📖 Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;

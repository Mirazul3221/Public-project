import CongratsCard from "@/app/components/CongratsCard";
import React from "react";

const CounterBoard = ({ data }) => {
  if (!data) return;

  const result = data.evaluated.reduce((acc, item) => {
    const sub = item.sub.toLowerCase();

    if (!acc[sub]) {
      acc[sub] = { sub, correct: 0, wrong: 0, skipped: 0 };
    }

    if (item.status === "correct") acc[sub].correct++;
    if (item.status === "wrong") acc[sub].wrong++;
    if (item.status === "skipped") acc[sub].skipped++;
    return acc;
  }, {});
  return (
    <div>
      {data?.evaluated?.length / 2 <= data?.correct && <CongratsCard />}
      <div className="px-4 md:px-10 py-4 text-lg text-center md:flex justify-center items-center gap-6">
        <h3 className="font-semibold text-green-500">
          সঠিক উত্তর : {data.correct}
        </h3>
        <h3 className="font-semibold text-red-500">
          ভুল উত্তর : {data.wrong}
        </h3>
        <h3 className="font-semibold text-amber-500">
          এড়িয়ে গেছেন : {data.skipped}
        </h3>
      </div>
      <table className="min-w-full text-center border-collaps border-2 rounded-md">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr className="bg-amber-100/50 font-semibold text-[16px]">
            <th className="p-4 border-b">বিষয়</th>
            <th className="p-4 border-b">সঠিক</th>
            <th className="p-4 border-b">ভুল</th>
            <th className="p-4 border-b">এড়িয়েছেন</th>
          </tr>
        </thead>
        <tbody>
          {result.bangla && (
            <tr className={`hover:bg-gray-50`}>
              <td className="p-4 border-b border-r font-medium text-gray-800">
                বাংলা
              </td>
              <td className="p-4 border-b">{result.bangla.correct}</td>
              <td className="p-4 py-2 border-b border-l font-semibold">
                {result.bangla.wrong}
              </td>
              <td className="p-4 py-2 border-b border-l font-semibold">
                {result.bangla.skipped}
              </td>
            </tr>
          )}

          {result.english && (
            <tr className={`hover:bg-gray-50`}>
              <td className="p-4 border-b border-r font-medium text-gray-800">
                ইংরেজি
              </td>
              <td className="p-4 border-b">{result.english.correct}</td>
              <td className="p-4 py-2 border-b border-l font-semibold">
                {result.english.wrong}
              </td>
              <td className="p-4 py-2 border-b border-l font-semibold">
                {result.english.skipped}
              </td>
            </tr>
          )}
          {result.math && (
            <tr className={`hover:bg-gray-50`}>
              <td className="p-4 border-b border-r font-medium text-gray-800">
                গণিত
              </td>
              <td className="p-4 border-b">{result.math.correct}</td>
              <td className="p-4 py-2 border-b border-l font-semibold">
                {result.math.wrong}
              </td>
              <td className="p-4 py-2 border-b border-l font-semibold">
                {result.math.skipped}
              </td>
            </tr>
          )}
          {result.gk && (
            <tr className={`hover:bg-gray-50`}>
              <td className="p-4 border-b border-r font-medium text-gray-800">
                সাধারণ জ্ঞান
              </td>
              <td className="p-4 border-b">{result.gk.correct}</td>
              <td className="p-4 py-2 border-b border-l font-semibold">
                {result.gk.wrong}
              </td>
              <td className="p-4 py-2 border-b border-l font-semibold">
                {result.gk.skipped}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CounterBoard;

"use client";
import React from "react";

const ExamReviewCard = ({ final }) => {
  const { questions, evaluation } = final;
  return (
<div className="">
  <h2 className="text-center my-2 font-semibold text-lg text-gray-700">আপনার করা উত্তরগুলো</h2>
      <div className="grid md:grid-cols-2 md:gap-6">
      {questions.map((q, index) => {
        const { status } =
          evaluation?.evaluated?.find((e) => e.index === index) || {};
        const { pressed } =
          evaluation?.evaluated?.find((s) => s.index === index) || {};
        let colorClass = "border-gray-300 bg-white";

        if (status === "correct")
          colorClass = "bg-green-100/5";
        else if (status === "wrong")
          colorClass = "bg-red-100/5";
        else if (status === "skipped")
          colorClass = "bg-yellow-100/5";

        return (
          <div
            key={q._id}
            className={`${colorClass} p-5 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 relative`}
          >
            <div className={`absolute text-white ${status == 'wrong'? "bg-red-300" :  status == "correct" ? "bg-green-300" : "bg-yellow-300"} top-0 right-0 p-1 rounded-bl-lg rounded-tr-lg border`}>
            {status}
            </div>
            {/* Question */}
            <p className="font-semibold text-gray-800 mb-3">
              {index + 1}. {q.question}
            </p>
            {/* Question */}

            {/* Options  */}
            <div className="space-y-2">
              {[q.option01, q.option02, q.option03, q.option04].map(
                (optionText, optIndex) => {
                  const optionNumber = optIndex + 1;
                  const isCorrect = optionNumber === q.correctAns;
                  const isPressed = optionNumber === pressed;

                  let colorClass = "border-gray-300 bg-white";
                  if (status === "correct" && isPressed)
                    colorClass = "text-green-500 border-green-200 border-2";
                  else if (status === "wrong" && isPressed)
                    colorClass = "text-red-500 border-red-200 border-2";
                  else if (status === "wrong" && isCorrect)
                    colorClass = "text-green-500 border-green-200 border-2";
                  else if (status === "skipped" && isCorrect)
                    colorClass = "text-yellow-500 border-yellow-200 border-2";
                  return (
                    <div
                      key={optIndex}
                      className={`p-3 border rounded-lg ${colorClass} transition-all duration-200`}
                    >
                      <span className="font-semibold mr-2">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      {optionText}
                    </div>
                  );
                }
              )}
            </div>

            {/* Explanation (Optional) */}
            {q.explanation && (
              <div className="mt-3 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Explanation: </span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
</div>
  );
};

export default ExamReviewCard;

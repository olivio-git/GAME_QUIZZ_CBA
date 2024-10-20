import React from "react";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const ModalError = ({ questionCheck, questionGameIn }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700">
      <FaTimesCircle className="text-7xl text-red-600 mb-4" />
      <h2 className="text-4xl font-bold text-white mb-4">Error!</h2>
      <div className="text-lg text-gray-300 flex flex-col gap-4">
        <p className="text-xl text-red-400 mb-4">The answer is incorrect</p>

        {questionCheck ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {questionGameIn.answer.map((q, index) => (
              <div
                key={index}
                className={`flex items-center justify-center p-4 rounded-xl shadow-md transition-all duration-300 ${
                  q.correct ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <span className="flex items-center gap-3 text-xl font-semibold text-gray-100">
                  {q.correct ? (
                    <FaCheckCircle className="text-green-200" />
                  ) : (
                    <FaTimesCircle className="text-red-200" />
                  )}
                  {q.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No responses were selected</p>
        )}
      </div>
    </div>
  );
};

export default ModalError;

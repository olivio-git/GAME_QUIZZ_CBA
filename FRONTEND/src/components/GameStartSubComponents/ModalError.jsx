import React from "react";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const ModalError = ({ questionCheck, questionGameIn }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg shadow-lg border border-red-300">
      <FaTimesCircle className="text-6xl text-red-500 mb-2" />
      <h2 className="text-3xl font-bold text-red-700 mb-2">Error!</h2>
      <div className="text-lg text-gray-800 flex flex-col gap-2">
        <p className="mb-2">The answer is incorrect</p>

        {questionCheck ? (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {questionGameIn.answer.map((q, index) => (
              <div
                key={index}
                className={`flex items-center justify-center mb-2 p-4 rounded-lg shadow-md ${
                  q.correct ? "bg-green-400" : "bg-red-400"
                }`}
              >
                <span className="flex items-center gap-2">
                  {q.correct ? (
                    <FaCheckCircle className="text-green-700" />
                  ) : (
                    <FaTimesCircle className="text-red-700" />
                  )}
                  {q.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No responses were selected</p>
        )}
      </div>
    </div>
  );
};

export default ModalError;

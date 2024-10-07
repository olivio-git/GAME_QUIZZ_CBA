// ModalError.jsx
import React from "react";

const ModalError = ({ questionCheck, questionGameIn }) => {
  return (
    <div className="flex flex-col items-center justify-center text-red-500 p-4 rounded-lg">
      <i className="fas fa-times-circle text-4xl mb-2"></i>
      <h2 className="text-2xl mb-2">Error!</h2>
      <p>
        {questionCheck ? (
          <div>
            <p>The answer is not correct.</p>
            {questionGameIn.answer.map((q) => {
              return (
                <p
                  key={q.value}
                  className={`m-w-3/5 p-1 rounded shadow ${q.correct ? "bg-green-400" : "bg-red-400"}`}
                >
                  {q.value}
                </p>
              );
            })}
          </div>
        ) : (
          "You must select an answer."
        )}
      </p>
    </div>
  );
};

export default ModalError;

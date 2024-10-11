// ModalError.jsx
import React from "react";
import { FaTimesCircle } from "react-icons/fa"; // Importa el ícono que deseas utilizar

const ModalError = ({ questionCheck, questionGameIn }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg shadow-lg border border-red-300">
      <FaTimesCircle className="text-6xl text-red-500 mb-2" />
      <h2 className="text-3xl font-bold text-red-700 mb-2">Error!</h2>
      <p className="text-lg text-gray-800">
        {questionCheck ? (
          <div>
            <p className="mb-2">The answer is incorrect.</p>
            {questionGameIn.answer.map((q) => (
              <p
                key={q.value}
                className={`m-w-3/5 p-1 rounded shadow ${q.correct ? "bg-green-400" : "bg-red-400"} mb-1`}
              >
                {q.value}
              </p>
            ))}
          </div>
        ) : (
          "Debes seleccionar una respuesta."
        )}
      </p>
    </div>
  );
};

export default ModalError;

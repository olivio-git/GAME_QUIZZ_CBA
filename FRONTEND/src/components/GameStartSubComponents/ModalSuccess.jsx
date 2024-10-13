// ModalSuccess.js
import React from "react";
import Confetti from "react-confetti"; // Asegúrate de que Confetti esté instalado y correctamente importado
import { FaCheckCircle } from "react-icons/fa"; // Importa el ícono que deseas utilizar

const ModalSuccess = ({ success }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg shadow-lg border border-green-300">
      <FaCheckCircle className="text-6xl text-green-500 mb-2" />
      <h2 className="text-3xl font-bold text-green-700 mb-2">¡You're a genious!</h2>
      <p className="text-lg text-gray-800">The answer is correct</p>
      {success ? <Confetti /> : null}
    </div>
  );
};

export default ModalSuccess;

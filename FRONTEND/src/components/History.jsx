import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DataContext from '../context/dataContext';

export default function History() {
  const { gameQuestions } = useContext(DataContext);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-x-auto">
      <div className="flex flex-col w-full p-6">
        {/* Botón para volver al inicio */}
        <Link to="/" className="mb-4 inline-block px-4 py-2 text-white bg-blue-500 rounded-full shadow-lg text-center hover:bg-blue-600 transition duration-200">
          Volver al Inicio
        </Link>

        {/* Contenedor para vista de tabla en dispositivos móviles */}
        <div className="block md:hidden">
          <table className="min-w-full bg-white rounded-3xl shadow-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 text-left text-gray-600">Departure</th>
                <th className="py-2 text-left text-gray-600">Winners</th>
              </tr>
            </thead>
            <tbody>
              {gameQuestions && gameQuestions.map((g, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{g.name}</td>
                  <td className="py-2 px-4">
                    {g.winners.map((a, i) => (
                      <div key={i} className="flex justify-between bg-gray-100 p-1 rounded-xl mb-1">
                        <span className="text-gray-700">{a.name}</span>
                        <span className="text-gray-500">{a.point} pts</span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Contenedor para vista de tarjetas en dispositivos más grandes */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {gameQuestions && gameQuestions.map((g, index) => {
            return (
              <div key={index} className="bg-white rounded-3xl shadow-lg p-6 flex flex-col justify-between">
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-gray-400 mb-1">Departure</p>
                  <p className="text-lg text-gray-900 font-semibold">{g.name}</p>
                </div>
                <div className="mt-4 flex flex-col items-center justify-center">
                  <p className="text-gray-600 font-medium mb-2">Winners:</p>
                  {g.winners.map((a, i) => (
                    <div key={i} className="w-full flex justify-between bg-gray-100 p-2 rounded-xl mb-2">
                      <span className="text-gray-700 font-semibold">{a.name}</span>
                      <span className="text-gray-500">{a.point} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { FaClock } from "react-icons/fa";
import CounterSound from "../../assets/25segundos.mp3"; // El sonido de 25 segundos

const PrevCheckQuestion = ({
  pointsMessage,
  gameContext,
  currentTurn,
  questionGameIn,
  setQuestionCheck,
  usedRadioButton,
  questionCheck,
  checkResponse,
}) => {
  const [isStarted, setIsStarted] = useState(false); // Controla el inicio
  const [counter, setCounter] = useState(25); // Inicia el contador aquí con el valor deseado
  const audioRef = useRef(new Audio(CounterSound));

  const handleStart = () => {
    setIsStarted(true);  // Solo comienza cuando el usuario presiona "Start"
    audioRef.current.play(); // Reproduce el sonido cuando comienza el conteo
  };

  useEffect(() => {
    let timer;

    if (isStarted && counter > 0) {
      timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    } else if (counter === 0) {
      clearInterval(timer);
      audioRef.current.pause(); // Pausa el sonido si el contador llega a 0
    }

    return () => clearInterval(timer);
  }, [isStarted, counter]);

  const handleTry = () => {
    checkResponse(); // Verifica la respuesta
    audioRef.current.pause(); // Pausa el sonido cuando se hace clic en "Try"
    audioRef.current.currentTime = 0; // Reinicia el tiempo del sonido
  };

  return (
    <div>
      <div className="clock-icon text-2xl">
        <FaClock />
        <p className="text-red-800">
          Time Remaining {counter} <strong> +{pointsMessage}</strong>
        </p>
      </div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none text-blue-600 md:text-1xl lg:text-2xl">
        Current Shift: {gameContext.players[currentTurn.player].name_player},
        Round: {currentTurn.round + 1}
      </h1>
      <h1 className="text-2xl font-bold">{questionGameIn.question}</h1>

      {!isStarted ? (
        <button
          onClick={handleStart} // Solo aquí comienza el conteo
          type="button"
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Start
        </button>
      ) : (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Answers</h2>
          <div className="pl-4">
            {questionGameIn.answer.map((a, index) => (
              <div key={index} className="mb-2">
                <label className="inline-flex items-center">
                  <input
                    id={`response-${index}`} // Añadir ID único para accesibilidad
                    type="radio"
                    name="response"
                    value={a.value}
                    checked={a.selected}
                    onChange={() => setQuestionCheck(a)}
                    disabled={usedRadioButton}
                    className="mr-2"
                  />
                  {index + 1}: {a.value}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {!usedRadioButton && questionCheck ? (
        <button
          onClick={handleTry}
          disabled={!questionCheck} // Verifica si hay una respuesta seleccionada
          type="button"
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Try
        </button>
      ) : null}
    </div>
  );
};

export default PrevCheckQuestion;

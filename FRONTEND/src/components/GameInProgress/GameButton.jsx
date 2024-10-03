import React from "react";
import GameStart from "../GameStart";

const GameButton = ({ gameInProgress, setGameModal, gameQuestions }) => {
  return !gameInProgress ? (
    <button
      onClick={() => setGameModal(true)}
      type="button"
      className="hover:cursor-pointer h-12 w-32 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br
        focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
    >
      START
    </button>
  ) : (
    <GameStart questions={gameQuestions} /> // Pasa las preguntas como prop si es necesario
  );
};

export default GameButton;

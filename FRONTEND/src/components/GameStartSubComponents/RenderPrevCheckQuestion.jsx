// RenderPrevCheckQuestion.js
import React from "react";
import { FaClock } from "react-icons/fa";
import SuccessSound from "../assets/success.mp4";
import ErrorSound from "../assets/error.mp4";

const RenderPrevCheckQuestion = ({
  counter,
  pointsMessage,
  gameContext,
  currentTurn,
  rounds,
  questionGameIn,
  setQuestionCheck,
  usedRadioButton,
  questionCheck,
  checkResponse,
}) => {
  return (
    <div>
      <div className="clock-icon text-2xl">
        <FaClock />
        <p className="text-red-800">
          Time Remaining {counter} <strong> +{pointsMessage}</strong>
        </p>
      </div>
      <h1 className="mb-4 text-4xl font-extrabold leading-none text-blue-600 md:text-1xl lg:text-2xl">
        Current Shift: {gameContext.players[currentTurn.player].name_player}, Round: {rounds[currentTurn.round]}
      </h1>
      <h1 className="text-2xl font-bold">{questionGameIn.question}</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-blue-700">Answers</h2>
        <div className="pl-4">
          {questionGameIn.answer.map((a, index) => (
            <div key={index} className="mb-2">
              <label className="inline-flex items-center">
                <input
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
          <audio className="hidden" controls>
            <source src={SuccessSound} type="audio/mpeg" />
          </audio>
          <audio className="hidden" controls>
            <source src={ErrorSound} type="audio/mpeg" />
          </audio>
        </div>
      </div>
      {!usedRadioButton && questionCheck ? (
        <button
          onClick={checkResponse}
          disabled={!setQuestionCheck}
          type="button"
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Try
        </button>
      ) : null}
    </div>
  );
};

export default RenderPrevCheckQuestion;

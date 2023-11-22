import React, { useContext, useEffect, useState } from "react";
import DataContext from "../context/dataContext";
import { FetchAllQuestionsBd, fetchGetCategory } from "../utils/fetchBackend";
import Confetti from "react-confetti";
import SuccessSound from "../assets/success.mp4";
import { motion } from "framer-motion";

// import dataQuestions from "../utils/exampleQuestions.json";
import {
  KEY_LOCAL_STORAGE_POINTS,
  KEY_LOCAL_STORAGE_ROUNDS,
  KEY_LOCAL_STORAGE_TURNS,
  KEY_LOCAL_STORAGE_USEDQUESTIONS,
} from "../utils/emvironments";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const GameStart = () => {
  const [modalQuestion, setModalQuestion] = useState(false); //Estado del modal
  const [questionGameIn, setQuestinGameIn] = useState(null); //La pregunta con la que estamos jugando
  const [questionCheck, setQuestionCheck] = useState(null); //Verificar si la pregunta es correcta
  //temp
  const [error, setError] = useState(false); //Para poder mostrar el error de pregunta no respondida
  const [success, setSuccess] = useState(false); //Para poder mostrar alertas success
  const [usedRadioButton, setUsedRadioButton] = useState(false);
  const [counter, setCounter] = useState(0); //Para poner contador de vuelta atrás
  const successSound = new Audio(SuccessSound); //Sonido de audio para Sucess

  //
  const {
    gameContext,
    categorys,
    addCategorys,
    dataQuestions,
    addDataQuestions,
  } = useContext(DataContext);
  //logic
  const [rounds, setRounds] = useLocalStorageState(
    KEY_LOCAL_STORAGE_ROUNDS,
    Array.from({ length: 5 }, (_, i) => i + 1)
  );
  const [currentTurn, setCurrentTurn] = useLocalStorageState(
    KEY_LOCAL_STORAGE_TURNS,
    { round: 0, player: 0 }
  );
  const [playerPoints, setPlayerPoints] = useLocalStorageState(
    KEY_LOCAL_STORAGE_POINTS,
    Array(gameContext.players.length).fill(0)
  );

  const [questionUsedValids, setQuestionUsedValids] = useLocalStorageState(
    KEY_LOCAL_STORAGE_USEDQUESTIONS,[]
  );

  const updateQuestionsLocalStorage = (value) => {
    setQuestionUsedValids((prevQuestions) => [...prevQuestions, value]);
  }
  const nextTurn = () => { //Actualizar estado de turnos
    setCurrentTurn((prevTurn) => {
      const nextPlayer = (prevTurn.player + 1) % gameContext.players.length;
      if (nextPlayer === 0) {
        return { round: (prevTurn.round + 1) % rounds.length, player: 0 };
      }
      return { ...prevTurn, player: nextPlayer };
    });
  };
  //
  const updatePlayerPoints = (playerIndex, pointsToAdd) => { //Actualizar puntaje
    setPlayerPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      newPoints[playerIndex] += pointsToAdd;
      return newPoints;
    });
  };

  const checkResponse = (c) => {
    setUsedRadioButton();
    if (questionCheck.correct) {
      updatePlayerPoints(currentTurn.player, 10);
      setSuccess(true);
      setUsedRadioButton(true);
      successSound.play();
      setTimeout(() => {
        setQuestionCheck(null);
        setUsedRadioButton(false);
        setSuccess(false);
        nextTurn();
        setModalQuestion(false);
        successSound.pause();
      }, 3000);
    } else {
      setError(true);
      setUsedRadioButton(true);
      setQuestionCheck(null);
      setTimeout(() => {
        setUsedRadioButton(false);
        setError(false);
        nextTurn();
        setModalQuestion(false);
      }, 3000);
    }
  };

  //Aqui corte

  const stateRender = (question) => {
    setQuestinGameIn(question);
    updateQuestionsLocalStorage(question);
    setModalQuestion(true);
  };
  useEffect(() => {
    // updateDataQuestions();
  }, []);
  const renderPrevCheckQuestion = () => {
    return (
      <div>
        <h1 className="mb-4 text-4xl font-extrabold leading-none text-blue-700 md:text-2xl lg:text-2xl ">
          Turno actual: {gameContext.players[currentTurn.player].name_player},
          Ronda: {rounds[currentTurn.round]}
        </h1>
        <h1 className="text-2xl font-bold ">{questionGameIn.question}</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Answers</h2>
          {/* <h1 className="">
              Turno actual:{" "}
              {gameContext.players[currentTurn.player].name_player}, Ronda:{" "}
              {rounds[currentTurn.round]}
            </h1> */}
          <div className="pl-4">
            {questionGameIn.answer.map((a, index) => {
              return (
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
              );
            })}
            <audio className="hidden" controls>
              <source src={SuccessSound} type="audio/mpeg" />
            </audio>
          </div>
          {/* {error ? (
            <h1 className="text-red-700 text-2xl">Wrong Answer</h1>
          ) : null}
          {success ? (
              <h1 className="text-green-700 text-2xl">Correct Answer +10</h1>
          ) : null} */}
        </div>
        {/* <button onClick={nextTurn}>Siguiente turno</button>; */}
        {!usedRadioButton && questionCheck ? (
          <button
            disabled={!setQuestionCheck}
            type="button"
            onClick={checkResponse}
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Try
          </button>
        ) : null}
        {/* <button
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setModalQuestion(false)}>
              Close
          </button> */}
      </div>
    );
  };
  const renderModalSuccess = () => {
    return (
      <div className="bg-green-800 text-white p-4 rounded-lg">
        <i className="fas fa-check-circle text-4xl mb-2"></i>
        <h2 className="text-2xl mb-2">¡Correcto!</h2>
        <p>Has respondido correctamente a la pregunta.</p>
        {success ? <Confetti></Confetti> : null}
      </div>
    );
  };
  const renderModalError = () => {
    return (
      <div className="bg-red-800 text-white p-4 rounded-lg">
        <i className="fas fa-times-circle text-4xl mb-2"></i>
        <h2 className="text-2xl mb-2">¡Error!</h2>
        <p>La respuesta no es correcta.</p>
      </div>
    );
  };

  useEffect(() => {});
  const renderModalQuestion = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white w-1/2 p-8 rounded-2xl shadow-lg">
          <div>
            {!success && !error ? renderPrevCheckQuestion() : null}
            {success ? renderModalSuccess() : null}
            {error ? renderModalError() : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 grid-rows-5 w-full h-full">
      <div className="grid grid-cols-3 col-span-3 border bg-white border-none rounded-2xl shadow shadow-2xl">
        <div className="flex justify-center items-center col-span-1   border-r-4 ">
          <h1 className="mb-4 text-4xl font-extrabold leading-none text-blue-700 md:text-2xl lg:text-2xl ">
            STARTING GAME:{" "}
            <span className="text-blue-900">{gameContext.game.name}</span>
          </h1>
        </div>
        <div className="flex justify-center items-center col-span-1  pl-2">
          <div className="w-2/12 justify-center items-center  ">
            <h1 className="text-sm font-extrabold leading-none text-blue-700 md:text-2xl lg:text-2xl ">
              Players
            </h1>
          </div>
          <div className="w-10/12 justify-center items-center">
            {gameContext.players &&
              gameContext.players.map((g, index) => {
                return (
                  <div key={index} className="flex px-12   rounded-2xl">
                    <p className="font-bold text-sm  text-teal-600">
                      <span className="text-blue-800">{index + 1 + " "}</span>
                      {gameContext.players[index].name_player}
                    </p>
                  </div>
                );
              })}
          </div>
          <div className="w-10/12">
            {gameContext.players &&
              gameContext.players.map((g, index) => {
                return (
                  <p className="text-sm " key={index}>
                    {playerPoints[index]}
                  </p>
                );
              })}
          </div>
        </div>
        <div className="flex justify-center items-center col-span-1  border-l-4 pl-2">
          <div className="w-2/12 justify-center items-center">
            <h1 className="text-4xl font-extrabold leading-none text-blue-700 md:text-2xl lg:text-2xl ">
              Round:
              <span className="text-yellow-400">
                {rounds[currentTurn.round]}
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className="col-span-3 row-span-4 grid grid-cols-5 grid-rows-6 justify-center py-2 gap-2 rounded-2xl  ">
        {categorys &&
          categorys.map((c) => {
            return (
              <div key={c.id_category} className="col-span-1 row-span-1">
                <button
                  type="button"
                  className="w-full  h-full bg-white rounded-2xl shadow"
                >
                  <h1 className="text-4xl font-extrabold leading-none text-red-400 md:text-2xl lg:text-2xl ">
                    {c.name_category}
                  </h1>
                </button>
              </div>
            );
          })}
        {categorys.map((c, index) => {
          // Filtrar las preguntas disponibles que no han sido usadas desde el localstorage
          const availableQuestions = dataQuestions.filter(
            (q) =>
              q.CategoryIdCategory === categorys[index].id_category &&
              !questionUsedValids.some(
                (usedQ) => usedQ.id_question === q.id_question
              )
          );

          // Tomar solo las primeras 5 preguntas disponibles siempre
          const renderedQuestions = availableQuestions.slice(0, 5);

          return (
            <div
              key={index}
              className="col-span-1  row-span-5 grid grid-rows-5 gap-2 "
            >
              {renderedQuestions.map((q, ind) => (
                <motion.div
                  key={ind + 1}
                  onClick={() => stateRender(q)}
                  className="flex items-center justify-center
          font-bold text-gray-600 bg-white row-span-1 rounded-2xl shadow-2xl 
          cursor-pointer hover:bg-green-400 hover:text-white hover:shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    width="35"
                    fill="purple"
                    height="35"
                  >
                    <path d="M12,19c-.829,0-1.5-.672-1.5-1.5,0-1.938,1.352-3.709,3.909-5.118,1.905-1.05,2.891-3.131,2.51-5.301-.352-2.003-1.997-3.648-4-4-1.445-.254-2.865,.092-4.001,.974-1.115,.867-1.816,2.164-1.922,3.559-.063,.825-.785,1.445-1.609,1.382-.826-.063-1.445-.783-1.382-1.609,.17-2.237,1.29-4.315,3.073-5.7C8.89,.278,11.149-.275,13.437,.126c3.224,.566,5.871,3.213,6.437,6.437,.597,3.399-1.018,6.794-4.017,8.447-1.476,.813-2.357,1.744-2.357,2.49,0,.828-.671,1.5-1.5,1.5Zm-1.5,3.5c0,.828,.672,1.5,1.5,1.5s1.5-.672,1.5-1.5-.672-1.5-1.5-1.5-1.5,.672-1.5,1.5Z" />
                  </svg>
                </motion.div>
              ))}
            </div>
          );
        })}
        {/* {JSON.stringify(usedRadioButton)}; */}
        {/* {JSON.stringify(questionGameIn)};{JSON.stringify(questionCheck)}; */}
        {/* {JSON.stringify(questionGameIn)};{JSON.stringify(questionUsedValids)}; */}
        {modalQuestion ? renderModalQuestion() : null}
        {console.log(questionUsedValids)}
      </div>
    </div>
  );
};

export default GameStart;

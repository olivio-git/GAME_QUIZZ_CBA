import React, { useContext, useEffect, useRef, useState } from "react";
import DataContext from "../context/dataContext";
import {
  fetchPostGameSaveEnd,
  fetchDeleteQuestion,
} from "../utils/fetchBackend";
import SuccessSound from "../assets/success.mp4";
import ErrorSound from "../assets/error.mp4";
import CounterSound from "../assets/25segundos.mp3";
import { motion } from "framer-motion";
import {
  KEY_LOCAL_STORAGE,
  KEY_LOCAL_STORAGE_ROUNDS,
  KEY_LOCAL_STORAGE_TURNS,
  KEY_LOCAL_STORAGE_POINTS,
  KEY_LOCAL_STORAGE_USEDQUESTIONS,
  KEY_LOCAL_STORAGE_TURN,
  VALUE_ROUNDS_LOCAL,
  VALUE_INTERVAL_COUNTER,
} from "../utils/emvironments";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { removeItemsLocalStorage } from "../utils/functions";
import WinnerModal from "./GameStartSubComponents/WinnerModal";
import ModalSuccess from "./GameStartSubComponents/ModalSuccess";
import ModalError from "./GameStartSubComponents/ModalError";
import ModalQuestion from "./GameStartSubComponents/ModalQuestion";
import { FaClock, FaCube, FaUser } from "react-icons/fa";

const GameStart = () => {
  const {
    gameContext,
    categorys,
    addCategorys,
    dataQuestions,
    addDataQuestions,
    addGameContext,
    addGameProgress,
  } = useContext(DataContext);
  const navigate = useNavigate();
  const [modalQuestion, setModalQuestion] = useState(false);
  const [questionGameIn, setQuestinGameIn] = useState(null);
  const [questionCheck, setQuestionCheck] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [soundInt, setSoundInt] = useState(false);
  const audioRef = useRef(new Audio(CounterSound));
  const [usedRadioButton, setUsedRadioButton] = useState(false);
  const successSound = new Audio(SuccessSound);
  const errorSound = new Audio(ErrorSound);
  const [counter, setCounter] = useState(VALUE_INTERVAL_COUNTER);
  const [intervalId, setIntervalId] = useState(null);
  const [miArreglo, setMiArreglo] = useState([]);
  const [isStarted, setIsStarted] = useState(false);

  // Dentro de tu componente
  const playerListRef = useRef(null);
  const agregarElemento = (nuevoElemento) => {
    setMiArreglo((prevState) => [...prevState, nuevoElemento]);
  };

  const handleStart = () => {
    if (!isStarted) {
      setIsStarted(true);
      setCounter(VALUE_INTERVAL_COUNTER);

      // Reproducir el audio
      audioRef.current
        .play()
        .then(() => console.log("Audio is playing"))
        .catch((error) => console.error("Error al reproducir audio:", error));

      const id = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter <= 1) {
            clearInterval(id);
            audioRef.current.pause(); // Pausar el audio
            audioRef.current.currentTime = 0; // Reiniciar el audio
            checkResponse(); // Verifica la respuesta al finalizar el contador
            return 0; // Asegúrate de no bajar de 0
          }
          return prevCounter - 1; // Decrementar el contador
        });
      }, 1000);

      setIntervalId(id);
    }
  };

  const handleTry = () => {
    checkResponse();
    resetCounter();
  };
  const resetCounter = () => {
    clearInterval(intervalId); // Limpiar el intervalo
    setCounter(VALUE_INTERVAL_COUNTER); // Reiniciar el contador
    audioRef.current.pause(); // Detener el audio
    audioRef.current.currentTime = 0; // Reiniciar el audio
    setIsStarted(false); // Reiniciar el estado de inicio
  };
  // Efectos de ciclo de vida
  useEffect(() => {
    return () => {
      resetCounter(); // Limpiar al desmontar
    };
  }, []);
  useEffect(() => {
    let timer;

    if (isStarted && counter > 0) {
      timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    } else if (counter === 0) {
      clearInterval(timer);
      audioRef.current.pause();
    }

    return () => clearInterval(timer);
  }, [isStarted, counter]);

  //logic
  const [rounds, setRounds] = useLocalStorageState(
    KEY_LOCAL_STORAGE_ROUNDS,
    Array.from({ length: 5 }, (_, i) => i + 1)
  );
  const [turnIndexSave, SetTurnIndexSave] = useLocalStorageState(
    KEY_LOCAL_STORAGE_TURN,
    {
      round: 1,
      player: 1,
    }
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
    KEY_LOCAL_STORAGE_USEDQUESTIONS,
    []
  );
  const updateQuestionsLocalStorage = (value) => {
    setQuestionUsedValids((prevQuestions) => [...prevQuestions, value]);
  };
  useEffect(() => {
    // Verificar el final del juego después de cada actualización de turno
    if (
      currentTurn.round === VALUE_ROUNDS_LOCAL &&
      currentTurn.player === gameContext.players.length - 1
    ) {
    }
  }, [currentTurn]);

  // Lógica para manejar el cambio de jugador
  useEffect(() => {
    if (playerListRef.current) {
      const currentPlayerElement =
        playerListRef.current.querySelector(".current-player");
      if (currentPlayerElement) {
        currentPlayerElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest", // Esto asegura que el jugador actual sea visible en la parte superior del contenedor
        });
      }
    }
  }, [currentTurn.player]); // Dependencia para el efecto: se ejecuta cuando el jugador actual cambia

  const nextTurn = () => {
    setCurrentTurn((prevTurn) => {
      //  2===2
      const nextPlayer = (prevTurn.player + 1) % gameContext.players.length; //0+1  2 % 3
      if (nextPlayer === 0) {
        return { round: (prevTurn.round + 1) % rounds.length, player: 0 }; //saltando de turno
      }
      return { ...prevTurn, player: nextPlayer };
    });
  };
  const updatePlayerPoints = (playerIndex, pointsToAdd) => {
    //Actualizar puntaje
    setPlayerPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      newPoints[playerIndex] += pointsToAdd;
      return newPoints;
    });
  };
  const checkResponse = () => {
    clearInterval(intervalId); // Detener el intervalo
    //LIMBERFUNCTIONS
    function calculatePoints(round, counter) {
      let points;
      if (round === 0 || round === 1) {
        points = calculatePointsForRound(counter, 100, 85, 70, 60);
      } else if (round === 2 || round === 3) {
        points = calculatePointsForRound(counter, 200, 185, 170, 160);
      } else if (round === 4) {
        points = calculatePointsForRound(counter, 300, 285, 270, 260);
      }
      return points;
    }
    function calculatePointsForRound(
      counter,
      points15,
      points12,
      points10,
      pointsDefault
    ) {
      if (counter >= 15) {
        return points15;
      } else if (counter >= 12) {
        return points12;
      } else if (counter >= 8) {
        return points10;
      } else {
        return pointsDefault;
      }
    }

    setUsedRadioButton();
    if (questionCheck && questionCheck.correct) {
      const points = calculatePoints(currentTurn.round, counter);
      updatePlayerPoints(currentTurn.player, points);
      setSuccess(true);
      setUsedRadioButton(true);
      successSound.play();
      setTimeout(() => {
        SetTurnIndexSave((prev) => {
          return {
            ...prev,
            round: currentTurn.round + 1,
            player: currentTurn.player + 1,
          };
        });
        setQuestionCheck(null);
        setUsedRadioButton(false);
        setSuccess(false);
        nextTurn();
        setModalQuestion(false);
        setCounter(VALUE_INTERVAL_COUNTER);
        successSound.pause();
      }, 3000);
    } else {
      setError(true);
      setUsedRadioButton(true);
      errorSound.play();
      setTimeout(() => {
        setQuestionCheck(null);
        SetTurnIndexSave((prev) => {
          return {
            ...prev,
            round: currentTurn.round + 1,
            player: currentTurn.player + 1,
          };
        });
        setUsedRadioButton(false);
        setError(false);
        nextTurn();
        setCounter(VALUE_INTERVAL_COUNTER);
        setModalQuestion(false);
        errorSound.pause();
      }, 3000);
    }
    var cod = questionGameIn.id_question;
    agregarElemento(`${cod}`);
    cod = "";
  };
  // const voiceTranslate = () => {  ;
  //   responsiveVoice.speak(questionGameIn.question);
  // }
  //Aqui corte

  const stateRender = (question) => {
    setQuestinGameIn(question);
    updateQuestionsLocalStorage(question);
    setModalQuestion(true);
    setSoundInt(true);
  };
  useEffect(() => {
    return () => {
      clearInterval(intervalId); // Limpiar el intervalo al desmontar
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reiniciar el audio
    };
  }, [intervalId]);

  function calculatePoints(round, counter) {
    let points;
    if (round === 0 || round === 1) {
      points = calculatePointsForRound(counter, 100, 85, 70, 60);
    } else if (round === 2 || round === 3) {
      points = calculatePointsForRound(counter, 200, 185, 170, 160);
    } else if (round === 4) {
      points = calculatePointsForRound(counter, 300, 285, 270, 260);
    }
    return points;
  }
  function calculatePointsForRound(
    counter,
    points15,
    points12,
    points10,
    pointsDefault
  ) {
    if (counter >= 15) {
      return points15;
    } else if (counter >= 12) {
      return points12;
    } else if (counter >= 8) {
      return points10;
    } else {
      return pointsDefault;
    }
  }

  const renderPrevCheckQuestion = () => {
    let pointsMessage = calculatePoints(currentTurn.round, counter);
    return (
      <div className="p-4 bg-gray-200 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaClock className="text-2xl text-yellow-500" />
          <h1 className="ml-2 text-2xl text-green-600 font-semibold">
            Time Remaining: <strong className="ml-2 text-2xl  text-red-900 font-extrabold">{counter}s</strong> <strong className="ml-2 text-2xl text-green-800 font-extrabold"> + {pointsMessage}</strong>
          </h1>
        </div>
        <h1 className="mb-4 text-2xl font-extrabold text-green-600 md:text-2xl lg:text-2xl">
          Current Shift:
          <span className="text-blue-900">
            {" "}
            {gameContext.players[currentTurn.player].name_player}
          </span>
          , Round: {currentTurn.round + 1}
        </h1>
        <h1 className="text-3xl font-extrabold text-blue-900">
          {questionGameIn.question}
        </h1>

        {!isStarted ? (
          <button
            onClick={handleStart} // Solo aquí comienza el conteo
            type="button"
            className="mt-4 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg shadow-green-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Start
          </button>
        ) : (
          <div className="mt-4 mb-4">
            <h2 className="text-xl font-semibold text-blue-800">Select correct answer:</h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {questionGameIn.answer.map((a, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center mb-2"
                >
                  <button
                    onClick={() => setQuestionCheck(a)} // Acción al hacer clic en la opción
                    disabled={usedRadioButton}
                    className={`flex items-center justify-center w-full text-lg font-semibold text-gray-800 bg-gray-100 rounded-lg p-4 shadow-md hover:bg-green-400 transition-colors duration-200 ${
                      questionCheck && questionCheck.value === a.value
                        ? "bg-green-600"
                        : ""
                    }`}
                  >
                    {index + 1}: {a.value}
                  </button>
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
            className="mt-4 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg shadow-green-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Try
          </button>
        ) : null}
      </div>
    );
  };
  const renderModalSuccess = () => {
    return <ModalSuccess onSuccess={success} />;
  };
  const renderModalError = () => {
    return (
      <ModalError
        questionCheck={questionCheck}
        questionGameIn={questionGameIn}
      />
    );
  };
  useEffect(() => {});
  const winnerPointsIndex = () => {
    return Math.max(...playerPoints);
  };
  const winnerPlayer = () => {
    return gameContext.players[playerPoints.indexOf(Math.max(...playerPoints))]
      .name_player;
  };
  const renderOrd = () => {
    let tempValues = [];
    gameContext.players.map((g, index) => {
      tempValues.push({
        name: gameContext.players[index].name_player,
        point: playerPoints[index],
      });
    });
    const playersCopy = [...tempValues];
    playersCopy.sort((a, b) => b.point - a.point);
    return (
      <h2 className="text-xl font-semibold text-gray-600 ml-4">
        {gameContext.players &&
          gameContext.players.map((g, index) => {
            return (
              <div key={index} className="flex px-12 rounded-2xl">
                <p className="font-bold text-sm">
                  <span className=" uppercase">
                    {index + 1 + ": "}
                    {playersCopy[index].name}
                    {"  ="}
                    {playersCopy[index].point}
                  </span>
                </p>
              </div>
            );
          })}
      </h2>
    );
  };
  const handleCloseGame = () => {
    removeItemsLocalStorage(KEY_LOCAL_STORAGE_TURN);
    removeItemsLocalStorage(KEY_LOCAL_STORAGE_ROUNDS);
    removeItemsLocalStorage(KEY_LOCAL_STORAGE_TURNS);
    removeItemsLocalStorage(KEY_LOCAL_STORAGE_POINTS);
    removeItemsLocalStorage(KEY_LOCAL_STORAGE_USEDQUESTIONS);
    removeItemsLocalStorage(KEY_LOCAL_STORAGE);
    addGameContext(null);
    addGameProgress(false);
    addCategorys([]);
    navigate("/");
  };
  //handleSubmitGameSave
  const handleSubmitGameSave = async () => {
    try {
      let tempValues = [];
      gameContext.players.map((g, index) => {
        tempValues.push({
          name: gameContext.players[index].name_player,
          point: playerPoints[index],
        });
      });
      const playersCopy = [...tempValues];
      playersCopy.sort((a, b) => b.point - a.point);

      // Espera a que se resuelva la promesa de fetchPostGameSaveEnd
      const saveResponse = await toast.promise(
        fetchPostGameSaveEnd({
          idGame: gameContext.game.id_game,
          idQuestions: questionUsedValids,
          top: playersCopy,
        }),
        {
          loading: "Loading Operation",
          success: "Operation Success!.",
          error: "Operation Error!.",
        }
      );

      // Verifica si la operación de guardar fue exitosa
      if (saveResponse) {
        // Elimina las preguntas después de guardar
        for (const questionId of miArreglo) {
          await fetchDeleteQuestion(questionId);
        }

        // Limpia el estado y realiza otras acciones después de guardar y eliminar
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_TURN);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_ROUNDS);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_TURNS);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_POINTS);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_USEDQUESTIONS);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE);
        addGameContext(null);
        addGameProgress(false);
        addCategorys([]);
        navigate("/");
      }
    } catch (error) {
      console.error("Error en handleSubmitGameSave:", error);
      // Manejar el error, mostrar un mensaje o realizar otras acciones necesarias
    }
  };

  const renderWinner = () => {
    return (
      <WinnerModal
        renderOrd={renderOrd}
        handleSubmitGameSave={handleSubmitGameSave}
        handleCloseGame={handleCloseGame}
      />
    );
  };
  const renderModalQuestion = () => {
    return (
      <ModalQuestion
        success={success}
        error={error}
        renderPrevCheckQuestion={renderPrevCheckQuestion}
        renderModalSuccess={renderModalSuccess}
        renderModalError={renderModalError}
      />
    );
  };

  return (
    <div className="grid grid-cols-3 grid-rows-5 w-full h-full">
      {turnIndexSave.round == VALUE_ROUNDS_LOCAL && // 2
      turnIndexSave.player == gameContext.players.length ? ( // [0,1] //1 0,1
        renderWinner()
      ) : (
        <>
          <div className="grid grid-cols-3 col-span-3 border-4 bg-white border-none rounded-2xl shadow-2xl p-0 bg-opacity-20 gap-1">
            {/* Sección del Juego */}
            <div className="flex justify-center items-center col-span-1 border-r-4 border-brown-800 bg-white rounded-xl shadow-md p-4">
              <h1 className="mb-0 font-extrabold text-blue-700 text-lg lg:text-xl pixelify-sans">
                GAME:
                <span className="text-blue-900 px-2 border-b-4 border-blue-600">
                  {gameContext.game.name}
                </span>
              </h1>
            </div>

            {/* Sección de Jugadores */}
            <div className="flex col-span-1 py-1 pl-2 overflow-y-auto border-brown-800 bg-white rounded-xl shadow-md">
              <div className="flex flex-col w-full">
                {/* Título de Jugadores */}
                <div className="flex items-center justify-center max-h-24 mb-0">
                  <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 pixelify-sans tracking-widest uppercase">
                    Players
                  </h1>
                </div>

                {/* Lista de Jugadores */}
                <div
                  ref={playerListRef}
                  className="flex flex-col w-full max-h-60 overflow-y-auto"
                >
                  {gameContext.players &&
                    gameContext.players.map((g, index) => {
                      return (
                        <div
                          key={index}
                          className={`flex items-center px-3 py-2 rounded-xl bg-gray-50 shadow-inner mb-2 ${
                            gameContext.players[index].name_player ===
                            gameContext.players[currentTurn.player].name_player
                              ? "current-player" // Clase para el jugador actual
                              : ""
                          }`}
                        >
                          {/* Icono de usuario */}
                          <FaUser size={20} className="text-teal-600 mr-2" />
                          <p className="font-bold text-sm text-teal-600">
                            <span
                              className={`${
                                gameContext.players[index].name_player ===
                                gameContext.players[currentTurn.player]
                                  .name_player
                                  ? "bg-black text-white rounded-lg px-2"
                                  : "text-blue-800"
                              } `}
                            >
                              {index + 1 + ": "}
                              {gameContext.players[index].name_player} {" = "}
                              {playerPoints[index]}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Sección de Rondas */}
            <div className="flex justify-center items-center col-span-1 border-l-4 border-brown-800 bg-white rounded-xl shadow-md p-4">
              <div className="w-full flex flex-col items-center">
                <h1 className="font-bold text-blue-700 text-lg lg:text-xl pixelify-sans mb-2">
                  Round:
                  <span className="text-red-400 px-2 border-b-4 border-red-500">
                    {rounds[currentTurn.round]}
                    <span className="text-green-500">
                      {currentTurn.round == 0 || currentTurn.round == 1
                        ? " + 100 points before 15s"
                        : currentTurn.round == 2 || currentTurn.round == 3
                        ? " + 200 points before 15s"
                        : " + 300 points before 15s"}
                    </span>
                  </span>
                </h1>
                <p className="font-bold text-blue-700 text-lg lg:text-xl pixelify-sans mt-2">
                  <span className="text-red-500 ">Be as fast as possible!</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sección de categorias */}
          <div className="col-span-3 row-span-4 grid grid-cols-5 grid-rows-6 gap-2 py-1 m-4 rounded-2xl bg-gray-100 shadow-lg border-brown-800 bg-opacity-5">
            {categorys &&
              categorys.map((c) => {
                return (
                  <div key={c.id_category} className="col-span-1 row-span-1">
                    <button className="w-full h-full bg-white rounded-xl shadow-md ">
                      <h1 className="font-extrabold text-red-600 text-xs sm:text-sm md:text-sm lg:text-xl pixelify-sans text-center overflow-hidden text-ellipsis whitespace-nowrap">
                        {c.name_category}
                      </h1>
                    </button>
                  </div>
                );
              })}

            {categorys.map((c, index) => {
              // Filtrar las preguntas disponibles que no han sido usadas
              const availableQuestions = dataQuestions.filter(
                (q) =>
                  q.CategoryIdCategory === categorys[index].id_category &&
                  !questionUsedValids.some(
                    (usedQ) => usedQ.id_question === q.id_question
                  )
              );

              // Aleatorizar las preguntas disponibles
              const randomizedQuestions = [...availableQuestions].sort(
                () => Math.random() - 0.5
              );
              const renderedQuestions = randomizedQuestions.slice(0, 5);

              return (
                <div
                  key={index}
                  className="col-span-1 row-span-5 grid grid-rows-5 gap-2"
                >
                  {renderedQuestions.map((q, ind) => (
                    <motion.div
                      key={ind + 1}
                      onClick={() => stateRender(q)}
                      className="flex items-center justify-center font-bold text-gray-600 bg-white row-span-1 rounded-xl shadow-md cursor-pointer hover:bg-green-400 hover:text-white transition-colors duration-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.1 }}
                    >
                      <FaCube size={25} color="purple" />
                    </motion.div>
                  ))}
                </div>
              );
            })}

            {modalQuestion ? renderModalQuestion() : null}
          </div>
        </>
      )}
    </div>
  );
};

export default GameStart;

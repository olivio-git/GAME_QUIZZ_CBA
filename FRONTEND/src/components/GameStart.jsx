import React, { useContext, useEffect, useRef, useState } from "react";
import DataContext from "../context/dataContext";
import {
  fetchPostGameSaveEnd,
  fetchDeleteQuestion,
} from "../utils/fetchBackend";
import "./styles.css"; // Asegúrate de que la ruta sea correcta

// Importación de sonidos
import SuccessSound from "../assets/success.mp4";
import ErrorSound from "../assets/error.mp4";
import CounterSound from "../assets/25segundos.mp3";
import { motion } from "framer-motion";

// Importación de constantes y funciones
import {
  KEY_LOCAL_STORAGE,
  KEY_LOCAL_STORAGE_ROUNDS,
  KEY_LOCAL_STORAGE_TURNS,
  KEY_LOCAL_STORAGE_POINTS,
  KEY_LOCAL_STORAGE_USEDQUESTIONS,
  KEY_LOCAL_STORAGE_TURN,
  VALUE_ROUNDS_LOCAL,
  VALUE_INTERVAL_COUNTER,
  VALUE_ROUNDS_LOCAL_DEV,
} from "../utils/emvironments";
import { useLocalStorageState } from "../utils/useLocalStorageState";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { removeItemsLocalStorage } from "../utils/functions";

// Importación de componentes de modal
import WinnerModal from "./GameStartSubComponents/WinnerModal";
import ModalSuccess from "./GameStartSubComponents/ModalSuccess";
import ModalError from "./GameStartSubComponents/ModalError";
import ModalQuestion from "./GameStartSubComponents/ModalQuestion";

// Importación de iconos
import {
  FaClock,
  FaCube,
  FaUser,
  FaBasketballBall,
  FaBook,
  FaLaptop,
  FaFilm,
  FaHistory,
  FaBomb,
  FaTrophy,
} from "react-icons/fa";

const GameStart = () => {
  // Contexto de datos
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

  // Estados del componente
  const [modalQuestion, setModalQuestion] = useState(false);
  const [questionGameIn, setQuestinGameIn] = useState(null);
  const [questionCheck, setQuestionCheck] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [soundInt, setSoundInt] = useState(false);
  const audioRef = useRef(new Audio(CounterSound));
  const successSound = new Audio(SuccessSound);
  const errorSound = new Audio(ErrorSound);
  const [usedRadioButton, setUsedRadioButton] = useState(false);
  const [counter, setCounter] = useState(VALUE_INTERVAL_COUNTER);
  const [intervalId, setIntervalId] = useState(null);
  const [miArreglo, setMiArreglo] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const intervalRef = useRef(null);
  const playerListRef = useRef(null);

  // Estado para rondas y turnos
  const [rounds, setRounds] = useLocalStorageState(
    KEY_LOCAL_STORAGE_ROUNDS,
    Array.from({ length: VALUE_ROUNDS_LOCAL }, (_, i) => i + 1)
  );
  const [turnIndexSave, SetTurnIndexSave] = useLocalStorageState(
    KEY_LOCAL_STORAGE_TURN,
    { round: 1, player: 1 }
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

  // Agregar elemento al arreglo
  const agregarElemento = (nuevoElemento) => {
    setMiArreglo((prevState) => [...prevState, nuevoElemento]);
  };

  // Función para iniciar el sonido
  const startSound = async () => {
    return new Promise((resolve, reject) => {
      try {
        resolve(audioRef.current.play());
      } catch (error) {
        reject(error);
      }
    });
  };

  // Manejar el inicio del juego
  const handleStart = async () => {
    const Sound = await startSound();
    setIsStarted(true);

    const id = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);
    audioRef.current.play();
    return setIntervalId(id);
  };

  // Manejar el intento de respuesta
  const handleTry = () => {
    checkResponse();
    resetCounter();
  };

  // Reiniciar el contador
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
      checkResponse();
    }

    return () => clearInterval(timer);
  }, [isStarted, counter]);

  // Lógica del juego
  const updateQuestionsLocalStorage = (value) => {
    setQuestionUsedValids((prevQuestions) => [...prevQuestions, value]);
  };

  useEffect(() => {
    // Verificar el final del juego después de cada actualización de turno
    if (
      currentTurn.round === VALUE_ROUNDS_LOCAL &&
      currentTurn.player === gameContext.players.length - 1
    ) {
      // Lógica para manejar el final del juego (puedes agregar aquí lo que necesites)
    }
  }, [currentTurn]);

  // Manejo del cambio de jugador
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
  }, [currentTurn.player]);
  // Pasar al siguiente turno
  const nextTurn = () => {
    setCurrentTurn((prevTurn) => {
      const nextPlayer = (prevTurn.player + 1) % gameContext.players.length; // Incrementar el jugador
      if (nextPlayer === 0) {
        return { round: (prevTurn.round + 1) % rounds.length, player: 0 }; // Saltar de turno
      }
      return { ...prevTurn, player: nextPlayer };
    });
  };

  // Actualizar puntos del jugador
  const updatePlayerPoints = (playerIndex, pointsToAdd) => {
    setPlayerPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      newPoints[playerIndex] += pointsToAdd;
      return newPoints;
    });
  };
  const checkResponse = () => {
    clearInterval(intervalId); // Detener el intervalo
    audioRef.current.currentTime = 0;
    audioRef.current.pause();
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
    // Verificar si se seleccionó una pregunta
    if (!questionCheck) {
      // Si no se seleccionó una pregunta, detén el contador y muestra un mensaje de error
      setError(true);
      setTimeout(() => {
        setError(false);
        resetCounter(); // Detener el contador y reiniciar
        nextTurn(); // Pasar al siguiente turno
        setModalQuestion(false); // Cerrar modal de pregunta
      }, 3000);
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
        resetCounter(); // Detener el contador y reiniciar
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
        resetCounter(); // Detener el contador y reiniciar
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

  const stateRender = (question) => {
    setQuestinGameIn(question);
    updateQuestionsLocalStorage(question);
    setModalQuestion(true);
    setSoundInt(true);
    //audioRef.current.play();
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
        for (const questionId of miArreglo) {
          await fetchDeleteQuestion(questionId);
        }
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
    }
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
  // const freezeAndSetCheckedQuestion = (answer) => {
  //   clearInterval(intervalId);
  //   setQuestionCheck(answer);
  // };
  const renderPrevCheckQuestion = () => {
    let pointsMessage = calculatePoints(currentTurn.round, counter);
    return (
      <div className="p-4 bg-gray-200 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FaClock className="text-2xl text-yellow-500" />
          <h1 className="ml-2 text-2xl text-green-600 font-semibold">
            Time Remaining:{" "}
            <strong className="ml-2 text-2xl  text-red-900 font-extrabold">
              {counter}s
            </strong>{" "}
            <strong className="ml-2 text-2xl text-green-800 font-extrabold">
              {" "}
              + {pointsMessage}
            </strong>
          </h1>
        </div>
        <h1 className="mb-4 text-2xl font-extrabold text-green-600 md:text-2xl lg:text-2xl">
          Current Shift:
          <span className="text-blue-900">
            {" "}
            {gameContext.players[currentTurn.player].name_player}
          </span>
          , Round:{rounds[currentTurn.round]}
        </h1>
        <h1 className="text-3xl font-extrabold text-blue-900">
          {questionGameIn.question}
        </h1>

        {!isStarted ? (
          <button
            onClick={handleStart} // Solo aquí comienza el conteo
            type="button"
            className="mt-4 w-full text-white bg-gradient-to-r from-purple-800 via-orange-400 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg shadow-green-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Start
          </button>
        ) : (
          <div className="mt-4 mb-4">
            <h2 className="text-xl font-semibold text-blue-800">
              Select correct answer:
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {questionGameIn.answer.map((a, index) => {
                const letters = ["A", "B", "C", "D"]; // Array con las letras
                return (
                  <div
                    key={index}
                    onClick={() => {
                      handleTrySelect(stopSound);
                      setQuestionCheck(a);
                    }}
                    className="flex items-center justify-center"
                  >
                    <button
                      onClick={() => {
                        setQuestionCheck(a);
                        clearInterval(intervalId);
                      }}
                      disabled={isSelected}
                      className={`w-full py-4 px-6 text-lg font-semibold text-gray-900 bg-gray-200 rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-200 ${
                        questionCheck && questionCheck.value === a.value
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                    >
                      {letters[index]}: {a.value}{" "}
                      {/* Mostramos la letra en lugar del número */}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!usedRadioButton && questionCheck ? (
         <button
         onClick={async () => {
           await stopSound();
           handleTry();
           clearAllIntervals();
         }}
         disabled={!questionCheck} // Verifica si hay una respuesta seleccionada
         type="button"
         className="mt-4 w-full text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:bg-gradient-to-br 
         focus:ring-4 focus:outline-none focus:ring-indigo-400 shadow-lg shadow-indigo-600/50  roboto-condensed font-bold 
         font-semibold rounded-xl text-2xl px-6 py-3 text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
       >
         Try 
       </button>
       
        ) : null}
      </div>
    );
  };


  return (
    <div className="grid grid-cols-4 grid-rows-5 w-full h-full gap-2">
      {turnIndexSave.round == VALUE_ROUNDS_LOCAL && // 2
      turnIndexSave.player == gameContext.players.length ? ( // [0,1] //1 0,1
        renderWinner()
      ) : (
        <>
          <div className="grid grid-cols-2 col-span-3 border-4  border-none rounded-2xl p-2 gap-1">
            {/* Sección del Juego */}
            <div className="flex justify-center items-center col-span-1   rounded-lg shadow-xl p-8">
              <h1 className="font-extrabold text-3xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 tracking-wider uppercase">
                GAME:
                <span className="text-white px-4 lg:text-3xl font-black tracking-tighter">
                  {gameContext.game.name}
                </span>
              </h1>
            </div>
            {/* Sección de Rondas */}
            <div className="flex justify-center items-center col-span-1 shadow-lg p-6">
              <div className="w-full flex flex-col items-center">
                {/* Título de la Ronda */}
                <h1 className="font-extrabold text-white text-2xl lg:text-4xl mb-3 tracking-wide uppercase">
                  Round:
                  <span className="ml-2 text-yellow-400">
                    {rounds[currentTurn.round]} {""}
                    of {VALUE_ROUNDS_LOCAL}
                  </span>
                </h1>

                {/* Información de puntos según la ronda */}
                <p className="text-white text-lg lg:text-xl font-medium bg-black bg-opacity-30 rounded-lg px-4 py-2 mt-2">
                  {currentTurn.round === 0 || currentTurn.round === 1
                    ? "+ 100 points before 15s"
                    : currentTurn.round === 2 || currentTurn.round === 3
                    ? "+ 200 points before 15s"
                    : "+ 300 points before 15s"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center col-span-1  rounded-lg shadow-lg p-6">
            {/* Sección de Jugadores */}
            {/* Título de Jugadores */}
            <div className="flex items-center justify-center w-full">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-wide uppercase">
                Players
              </h1>
            </div>
          </div>

          {/* Category Section */}
          <div className="col-span-3 row-span-4 grid grid-cols-5 grid-rows-6 gap-2 m-4 rounded-2xl bg-gray-100 shadow-lg border-brown-800 bg-opacity-5">
            {categorys &&
              categorys.map((c) => {
                let icon;

                switch (c.name_category) {
                  case "Sports":
                    icon = (
                      <FaBasketballBall size={25} className="text-blue-500" />
                    );
                    break;
                  case "History and geography":
                    icon = <FaHistory size={25} className="text-red-500" />;
                    break;
                  case "Literature":
                    icon = <FaBook size={25} className="text-green-500" />;
                    break;
                  case "Science and technology ":
                    icon = <FaLaptop size={25} className="text-purple-500" />;
                    break;
                  case "Music and entertainment":
                    icon = <FaFilm size={25} className="text-yellow-500" />;
                    break;
                  default:
                    icon = null;
                }

                return (
                  <div key={c.id_category} className="col-span-1 row-span-1">
                    <button className="w-full h-full text-white rounded-lg shadow-2xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                      {icon}
                      <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-sm text-center mt-2 px-2 overflow-hidden text-ellipsis whitespace-nowrap uppercase">
                        {c.name_category}
                      </h1>
                    </button>
                  </div>
                );
              })}

            {categorys.map((c, index) => {
              const availableQuestions = dataQuestions.filter(
                (q) =>
                  q.CategoryIdCategory === categorys[index].id_category &&
                  !questionUsedValids.some(
                    (usedQ) => usedQ.id_question === q.id_question
                  )
              );
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
                      className="flex items-center justify-center font-bold text-gray-600 bg-white row-span-1 rounded-lg shadow-md cursor-pointer hover:bg-green-400 hover:text-white transition-colors duration-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.1 }}
                    >
                      <FaBomb size={25} className="text-[#001E41]" />
                    </motion.div>
                  ))}
                </div>
              );
            })}

            {modalQuestion ? renderModalQuestion() : null}
          </div>
        </>
      )}
      {/* Lista de jugadores */}
      <div
        ref={playerListRef}
        className="flex flex-col w-full h-[61vh] overflow-y-auto p-2 scrollbar-custom" // Ajusta a la mitad de la altura de la ventana
      >
        {gameContext.players &&
          gameContext.players.map((g, index) => {
            return (
              <div
                key={index}
                className={`flex justify-between items-center px-3 py-2 rounded-lg shadow-inner mb-2 ${
                  gameContext.players[index].name_player ===
                  gameContext.players[currentTurn.player].name_player
                    ? "border-2 border-green-200"
                    : ""
                }`}
              >
                {/* Nombre del Jugador con ícono */}
                <div className="flex items-center">
                  <FaUser size={20} className="text-purple-300 mr-2" />
                  <span
                    className={`font-bold text-sm ${
                      gameContext.players[index].name_player ===
                      gameContext.players[currentTurn.player].name_player
                        ? "text-white rounded-lg px-2"
                        : "text-white"
                    }`}
                  >
                    {index + 1}. {gameContext.players[index].name_player}
                  </span>
                </div>

                {/* Puntuación del Jugador con ícono */}
                <div className="flex items-center">
                  <FaTrophy size={20} className="text-yellow-500 mr-2" />
                  <span className="font-bold text-white">
                    {playerPoints[index]}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GameStart;

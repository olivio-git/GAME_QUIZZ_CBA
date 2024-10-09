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
import { FaClock } from "react-icons/fa";

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

  console.log(counter);
  const agregarElemento = (nuevoElemento) => {
    setMiArreglo((prevState) => [...prevState, nuevoElemento]);
  };

  const handleStart = () => {
    if (!isStarted) {
      setIsStarted(true);
      setCounter(VALUE_INTERVAL_COUNTER);
  
      // Reproducir el audio
      audioRef.current.play()
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
          <div className="grid grid-cols-3 col-span-3 border bg-white border-none rounded-2xl shadow shadow-2xl">
            <div className="flex justify-center items-center col-span-1   border-r-4 ">
              <h1 className="mb-4  font-extrabold leading-none text-blue-700 md:text-1xl lg:text-2xl ">
                GAME:
                <span className="text-blue-900">{gameContext.game.name}</span>
              </h1>
            </div>
            <div className="flex col-span-1 py-1 pl-2 overflow-y-auto">
              <div className="w-2/12 justify-center items-center  ">
                <h1 className="text-sm font-extrabold leading-none text-blue-700 md:text-1xl lg:text-2xl ">
                  Players
                </h1>
              </div>
              <div className="w-12/12 justify-center items-center">
                {gameContext.players &&
                  gameContext.players.map((g, index) => {
                    return (
                      <div
                        key={index}
                        className="flex px-1 pl-10 pt-1 pb-1 rounded-2xl"
                      >
                        <p className="font-bold text-sm  text-teal-600">
                          <span
                            className={`${
                              gameContext.players[index].name_player ===
                              gameContext.players[currentTurn.player]
                                .name_player
                                ? "bg-black rounded text-white"
                                : "text - blue - 800"
                            } `}
                          >
                            {index + 1 + ": "}
                            {gameContext.players[index].name_player}
                            {" = "}
                            {playerPoints[index]}
                            {/* {" Fails: "}
                            {" 0"} */}
                          </span>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="flex justify-center items-center col-span-1  border-l-4 pl-2">
              <div className="w-12/12 justify-center items-center">
                <h1 className="font-bold leading-none text-blue-700 md:text-1xl lg:text-2xl ">
                  Round:
                  <span className="text-red-400">
                    {rounds[currentTurn.round]}
                    <span className="text-green-500">
                      {currentTurn.round == 0 || currentTurn.round == 1
                        ? " + 100 points before 15s"
                        : currentTurn.round == 2 || currentTurn.round == 3
                        ? " + 200 points before 15s"
                        : " + 300 points before 15s"}
                    </span>
                  </span>{" "}
                  <br />
                </h1>
                <p className="font-bold leading-none text-blue-700 md:text-1xl lg:text-2xl ">
                  Rules:
                  <span className="text-red-500">Be as fast as possible!</span>
                </p>
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
                      <h1 className="font-extrabold leading-none text-red-400 md:text-1xl lg:text-2xl ">
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
              // Aleatorizar las preguntas disponibles
              const randomizedQuestions = [...availableQuestions].sort(
                () => Math.random() - 0.5
              );

              // Tomar solo las primeras 5 preguntas disponibles siempre
              const renderedQuestions = randomizedQuestions.slice(0, 5);

              return (
                <div
                  key={index}
                  className="col-span-1 row-span-5 grid grid-rows-5 gap-2 "
                >
                  {renderedQuestions.map((q, ind) => (
                    <motion.div
                      key={ind + 1}
                      onClick={() => stateRender(q)}
                      className={`flex items-center justify-center 
                  font-bold text-gray-600 bg-white row-span-1 rounded-2xl shadow-2xl 
                  cursor-pointer hover:bg-green-400 hover:text-white hover:shadow-lg`}
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
            {modalQuestion ? renderModalQuestion() : null}
            {/* {console.log(questionUsedValids)} */}
          </div>
        </>
      )}
    </div>
  );
};

export default GameStart;

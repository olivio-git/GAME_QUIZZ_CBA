import React, { useContext, useEffect, useState } from "react";
import Bar from "./Bar";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/dataContext";
import GameStart from "./GameStart";
import toast from "react-hot-toast";
import { PiPushPinBold } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

import {
  FetchAllQuestionsBd,
  fetchGetCategory,
  fetchGetGameSaveEnd,
  fetchPostGame,
} from "../utils/fetchBackend";
import { KEY_LOCAL_STORAGE } from "../utils/emvironments";

const GameInProgress = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const {
    data,
    selected,
    gameInProgress,
    addGameProgress,
    gameCreator,
    addGamePlayers,
    addGameName,
    restartGameCreator,
    addGameContext,
    addCategorys,
    addDataQuestions,
    addGameQuestions,
    gameQuestions,
    stateModalHistory,
    setStateModalHistory,
    deletePLayer,
  } = useContext(DataContext);
  const [game, setGame] = useState(null);
  const [gameSrc, setGameSrc] = useState(null);
  const navigate = useNavigate();
  const [gameModal, setGameModal] = useState(false);
  const [temPlayer, setTemPlayer] = useState("");
  const renderHeadSelected = () => {
    return (
      <div className="w-full rounded-2xl flex items-center justify-center cursor-pointer">
        <div className="flex  flex-col justify-center items-center text-black gap-5 text-white">
          <h3 className="text-6xl font-bold pixelify-sans">{game.name}</h3>
          <p className="text-3xl pixelify-sans">{game.description}</p>
        </div>
      </div>
    );
  };

  const addPlayer = () => {
    if (temPlayer != "") {
      addGamePlayers(temPlayer);
      setTemPlayer("");
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateGlobalContext();
    setLoading(true);
    if (gameCreator.players.length <= 1) {
      setLoading(false);
      toast.error("You must add at least 2 players");
      return;
    }
    await toast
      .promise(fetchPostGame(gameCreator), {
        loading: "Loading Operation",
        success: "Operation Success!.",
        error: "Operation Error!.",
      })
      .then(async (r) => {
        //r = response
        setTemPlayer("");
        restartGameCreator();
        setGameModal(false);
        addGameProgress(true);
        setLoading(false);

        await localStorage.setItem(
          KEY_LOCAL_STORAGE,
          JSON.stringify(r.data.data)
        ); //cargar al localstorage como string
        const res = await localStorage.getItem(KEY_LOCAL_STORAGE); //recuperando
        const jsonparse = await JSON.parse(res); //convirtiendo a json
        addGameContext(jsonparse);
      });
      await updateGlobalContext();
      setLoading(false);

  };
  const handlePlayerChargeData = (e) => {
    setTemPlayer(e.target.value);
  };
  const renderModalGame = () => (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "calc(100vw - 100%)" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 min-h-screen items-center justify-center w-full inset-0 z-50 fixed"
    >
      <motion.form
        initial={{ x: "100%" }}
        animate={{ x: "0" }}
        exit={{ x: "100%" }}
        onSubmit={handleSubmit}
        className="rounded-lg bg-white dark:dark:bg-slate-200 p-6 shadow-lg flex flex-col w-72 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]"
      >
        <motion.div className="block mb-8 flex flex-row items-center justify-start w-full text-sm font-medium text-slate-800 dark:text-white">
          <span className="flex items-center justify-center h-8 w-8 border rounded-full border-gray-300 mr-2">
            <PiPushPinBold className="text-gray-900" />
          </span>
          <h1 className="text-gray-900">Create Game</h1>
        </motion.div>
        <motion.div className="gap-2 flex flex-col">
          <input
            value={gameCreator.name}
            onChange={(e) => addGameName(e.target.value)}
            type="text"
            className="bg-gray-50 focus:outline-none focus:ring-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Name of the game"
            required
          />
          <div className="flex mb-4">
            <input
              value={temPlayer}
              onChange={(e) => setTemPlayer(e.target.value)}
              type="text"
              className="bg-gray-50 focus:outline-none focus:ring-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="List of players"
            />
            <button
              type="button"
              onClick={addPlayer}
              className="ml-2 bg-white text-white rounded-lg px-4 py-2 border border-gray-300 hover:bg-gray-300"
            >
              <FaUserPlus className="text-gray-700 text-2xl" />
            </button>
          </div>
          {gameCreator.players.length > 0 && (
            <div
              className="flex flex-wrap gap-2 border p-2 rounded-lg border-gray-300
                max-h-72 overflow-y-auto w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
              "
            >
              {gameCreator.players.map((p) => (
                <div
                  key={p}
                  className="inline-flex min-w-32 gap-2 justify-between items-center rounded-lg px-2 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:min-w-32"
                >
                  <span className="text-gray-900">{p}</span>
                  <button
                    type="button"
                    onClick={() => {
                      //delete player
                      deletePLayer(p);
                    }}
                    className="bg-white text-white rounded-lg px-2 py-2 border border-gray-300 hover:bg-white bg-opacity-900"
                  >
                    <FaRegTrashCan className="text-[#F0003C]" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="bg-gray-50 sm:flex sm:flex-row-reverse  ">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-[#1ED760] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-full"
            >
              {loading ? (
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                "Start Game"
              )}
            </button>
            <button
              type="button"
              onClick={() => setGameModal(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-full"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
  const renderButtonGame = () => {
    return !gameInProgress ? (
      <button
        disabled={game ? false : true}
        onClick={() => setGameModal(true)}
        type="button"
        className="btn"
      >
        <strong>Play Game</strong>
        <div id="container-stars">
          <div id="stars"></div>
        </div>
        <div id="glow">
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </button>
    ) : (
      <GameStart></GameStart>
    );
  };
  const handleStartGame = () => {
    addGameProgress(true);
  };
  const categoryFetch = async () => {
    await fetchGetCategory(addCategorys);
  };
  const updateGlobalContext = async () => {
    const data = await localStorage.getItem(KEY_LOCAL_STORAGE);
    if (data) {
      const jsonparse = await JSON.parse(data);
      addGameContext(jsonparse);
      await updateDataQuestions();
      addGameProgress(true);
      await categoryFetch();
      await fetchGetGameSaveEnd(addGameQuestions);
    }
  };
  const updateDataQuestions = async () => {
    await FetchAllQuestionsBd(addDataQuestions);
  };
  useEffect(() => {
    updateGlobalContext();
  }, []);
  useEffect(() => {
    const handleUpdate = async () => {
      const response = await selected(id);
      setGame(response);
    };
    handleUpdate();
  }, [id, selected]);

  return (
    <div className="grid grid-cols-3 grid-rows-5 p-1 h-screen gradient-abc">
      <Bar context={"progress"}></Bar>
      <div className="col-span-1 flex p-4 rounded-2xl h-full">
        {game ? renderHeadSelected() : "Cargando datos..."}
      </div>
      {/* {JSON.stringify(gameQuestions)} */}
      <div className="flex w-full col-span-3 row-span-4 justify-center h-full items-center">
        {renderButtonGame()} {/*renderizar boton de juego*/}
        {gameModal ? renderModalGame() : null} {/*renderizar modal de juego*/}
      </div>
    </div>
  );
};

export default GameInProgress;

// import React, { useContext, useEffect, useState } from "react";
// import Bar from "./Bar";
// import { useParams } from "react-router-dom";
// import DataContext from "../context/dataContext";
// import GameModal from "./GameInProgress/GameModal";
// import GameHeader from "./GameInProgress/GameHeader";
// import GameButton from "./GameInProgress/GameButton";
// import { KEY_LOCAL_STORAGE } from "../utils/emvironments";
// import {
//   FetchAllQuestionsBd,
//   fetchGetCategory,
//   fetchGetGameSaveEnd,
// } from "../utils/fetchBackend";

// const GameInProgress = () => {
//   const { id } = useParams();
//   const {
//     data,
//     selected,
//     gameInProgress,
//     addGameProgress,
//     gameCreator,
//     addGamePlayers,
//     addGameName,
//     restartGameCreator,
//     addGameContext,
//     addCategorys,
//     addDataQuestions,
//     addGameQuestions,
//     gameQuestions,
//   } = useContext(DataContext);

//   const [game, setGame] = useState(null);
//   const [gameModal, setGameModal] = useState(false);
//   const [temPlayer, setTemPlayer] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await updateGlobalContext();
//     await toast.promise(fetchPostGame(gameCreator), {
//       loading: "Loading Operation",
//       success: "Operation Success!",
//       error: "Operation Error!",
//     }).then(async (r) => {
//       setTemPlayer("");
//       restartGameCreator();
//       setGameModal(false);
//       addGameProgress(true);

//       await localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(r.data.data));
//       const res = await localStorage.getItem(KEY_LOCAL_STORAGE);
//       const jsonparse = await JSON.parse(res);
//       addGameContext(jsonparse);
//       await updateDataQuestions(); // Cargar preguntas después de iniciar el juego
//     });
//   };

//   const updateGlobalContext = async () => {
//     const data = await localStorage.getItem(KEY_LOCAL_STORAGE);
//     if (data) {
//       const jsonparse = await JSON.parse(data);
//       addGameContext(jsonparse);
//       await categoryFetch();
//       await fetchGetGameSaveEnd(addGameQuestions);
//     }
//   };

//   const updateDataQuestions = async () => {
//     await FetchAllQuestionsBd(addDataQuestions);
//   };

//   useEffect(() => {
//     const handleUpdate = async () => {
//       const response = await selected(id);
//       setGame(response);
//     };
//     handleUpdate();
//   }, [id, selected]);

//   const renderHeadSelected = () => (
//     <div className="w-full bg-white rounded-2xl">
//       <div className="flex flex-col justify-center items-center text-black gap-5">
//         <h3 className="text-3xl font-bold">{game.name}</h3>
//         <p className="text-lg">{game.description}</p>
//       </div>
//     </div>
//   );

//   const renderButtonGame = () => (
//     !gameInProgress ? (
//       <button
//         disabled={game ? false : true}
//         onClick={() => setGameModal(true)}
//         type="button"
//         className="hover:cursor-pointer h-12 w-32 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
//       >
//         START
//       </button>
//     ) : (
//       <GameStart />
//     )
//   );

//   return (
//     <div className="grid grid-cols-3 grid-rows-5 p-1 h-screen gradient-blue">
//       <Bar context={"progress"} />
//       <div className="col-span-1 flex p-4 rounded-2xl h-full">
//         {game ? renderHeadSelected() : "Cargando datos..."}
//       </div>
//       <div className="flex w-full col-span-3 row-span-4 rounded-2xl justify-center h-full">
//         {renderButtonGame()}
//         {gameModal && renderModalGame()}
//       </div>
//     </div>
//   );
// };

// export default GameInProgress;

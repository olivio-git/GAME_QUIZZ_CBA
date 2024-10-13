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

import {
  FetchAllQuestionsBd,
  fetchGetCategory,
  fetchGetGameSaveEnd,
  fetchPostGame,
} from "../utils/fetchBackend";
import { KEY_LOCAL_STORAGE } from "../utils/emvironments";

const GameInProgress = () => {
  const { id } = useParams();
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
    deletePLayer
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

        await localStorage.setItem(
          KEY_LOCAL_STORAGE,
          JSON.stringify(r.data.data)
        ); //cargar al localstorage como string
        const res = await localStorage.getItem(KEY_LOCAL_STORAGE); //recuperando
        const jsonparse = await JSON.parse(res); //convirtiendo a json
        addGameContext(jsonparse);
      });
    await updateGlobalContext();
  };
  const handlePlayerChargeData = (e) => {
    setTemPlayer(e.target.value);
  };
  const renderModalGame = () => (
    <div className="flex flex-col gap-4 min-h-screen items-center justify-center w-full inset-0 z-50 fixed">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white dark:dark:bg-slate-200 p-6 shadow-lg flex flex-col w-72 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]"
      >
        <div className="block mb-8 flex flex-row items-center justify-start w-full text-sm font-medium text-slate-800 dark:text-white">
          <span className="flex items-center justify-center h-8 w-8 border rounded-full border-gray-300 mr-2">
            <PiPushPinBold className="text-gray-900" />
          </span>
          <h1 className="text-gray-900">Create Game</h1>
        </div>
        <div className="gap-2 flex flex-col">
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
              <FaUserPlus className="text-gray-700 text-2xl"/>

            </button>
          </div>
          {
            gameCreator.players.length > 0 && (
              <div className="flex flex-wrap gap-2 border p-2 rounded-lg border-gray-300
                max-h-72 overflow-y-auto w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500
              ">
              {gameCreator.players.map((p) => (
                <div key={p}
                className="inline-flex min-w-32 gap-2 justify-between items-center rounded-lg px-2 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:min-w-32"
                >
                  <span 
                  className="text-gray-900"
                  >{p}</span>
                  <button
                    type="button" 
                    onClick={() =>{
                      //delete player
                      deletePLayer(p)
                    }}
                    className="bg-white text-white rounded-lg px-2 py-2 border border-gray-300 hover:bg-white bg-opacity-900"
                  >
                  <FaRegTrashCan className="text-[#F0003C]" />
                  </button>
                </div>
              ))}
            </div>
            )
          }
          <div className="bg-gray-50 sm:flex sm:flex-row-reverse  ">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-[#1ED760] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-full"
            >
              Start
            </button>
            <button
              type="button"
              onClick={() => setGameModal(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
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
          <div class="circle"></div>
          <div class="circle"></div>
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
        {renderButtonGame()}
        {gameModal ? renderModalGame() : null}
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

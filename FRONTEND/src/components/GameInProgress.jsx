import React, { useContext, useEffect, useState } from "react";
import Bar from "./Bar";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/dataContext";
import GameStart from "./GameStart";
import toast from "react-hot-toast";
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
  } = useContext(DataContext);
  const [game, setGame] = useState(null);
  const [gameSrc, setGameSrc] = useState(null);
  const navigate = useNavigate();
  const [gameModal, setGameModal] = useState(false);
  const [temPlayer, setTemPlayer] = useState("");
  const renderHeadSelected = () => {
    return (
      <div className="w-full bg-white rounded-2xl">
        <div className="flex flex-col justify-center items-center text-black gap-5">
          <h3 className="text-3xl font-bold">{game.name}</h3>
          <p className="text-lg">{game.description}</p>
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
      <div className="bg-white w-3/4 md:w-1/2 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">NEW GAME</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={gameCreator.name}
            onChange={(e) => addGameName(e.target.value)}
            type="text"
            className="block w-full p-2 mb-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Name of the game"
            required
          />
          <div className="flex mb-4">
            <input
              value={temPlayer}
              onChange={(e) => setTemPlayer(e.target.value)}
              type="text"
              className="block w-4/5 p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="List of players"
            />
            <button
              type="button"
              onClick={addPlayer}
              className="ml-2 bg-blue-600 text-white rounded-lg px-4 py-2"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap mb-4">
            {gameCreator.players.map((p) => (
              <span key={p} className="m-1 p-2 bg-green-200 rounded-full">
                {p}
              </span>
            ))}
          </div>
          <button
            type="submit"
            disabled={gameCreator.players.length < 2}
            className="w-full bg-green-800 text-white rounded-lg px-4 py-2 disabled:opacity-50"
          >
            Start Game
          </button>
          <button
            type="button"
            onClick={() => setGameModal(false)}
            className="mt-2 w-full bg-red-600 text-white rounded-lg px-4 py-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
  const renderButtonGame = () => {
    return !gameInProgress ? (
      <button
        disabled={game ? false : true}
        onClick={() => setGameModal(true)}
        type="button"
        className="hover:cursor-pointer h-12 w-32 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br
           focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      >
        START
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
    <div className="grid grid-cols-3 grid-rows-5 p-1 h-screen gradient-blue">
      <Bar context={"progress"}></Bar>
      <div className="col-span-1 flex p-4 rounded-2xl h-full">
        {game ? renderHeadSelected() : "Cargando datos..."}
      </div>
      {/* {JSON.stringify(gameQuestions)} */}
      <div className="flex w-full col-span-3 row-span-4 rounded-2xl justify-center h-full">
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
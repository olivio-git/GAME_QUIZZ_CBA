import React, { useContext, useEffect, useState } from 'react';
import Bar from './Bar';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import DataContext from '../context/dataContext';
import GameStart from './GameStart';
import toast from 'react-hot-toast';
import { FetchAllQuestionsBd, fetchGetCategory, fetchPostGame } from '../utils/fetchBackend';
import { KEY_LOCAL_STORAGE } from '../utils/emvironments';

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
  } = useContext(DataContext);
  const [game, setGame] = useState(null);
  const [gameSrc, setGameSrc] = useState(null);
  const navigate = useNavigate();
  const [gameModal, setGameModal] = useState(false);
  const [temPlayer, setTemPlayer] = useState('');
  const renderHeadSelected = () => {
    return (
      <div className='w-full bg-white rounded-2xl'>
        <div className="flex flex-col justify-center items-center text-black gap-5">
          <h3 className="text-3xl font-bold">{game.name}</h3>
          <p className="text-lg">{game.description}</p>
        </div>
      </div>
    );
  };

  const addPlayer = () => {
    addGamePlayers(temPlayer);
    setTemPlayer('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.promise(fetchPostGame(gameCreator), {
      loading: 'Loading Operation',
      success: 'Operation Success!.',
      error: 'Operation Error!.',
    })
      .then(async (r) => { //r = response
        setTemPlayer('');
        restartGameCreator();
        setGameModal(false);
        addGameProgress(true);

        await localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(r.data.data)); //cargar al localstorage como string
        const res = await localStorage.getItem(KEY_LOCAL_STORAGE); //recuperando
        const jsonparse = await JSON.parse(res); //convirtiendo a json
        addGameContext(jsonparse);


        //r.data.data = {game: {name}, players: [1,2,3,4,5]}
        //localstorage.setItem('game', r.data.data)
      });
  }

  const renderModalGame = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(45,45,45,.8)]">
        <div className="bg-white w-1/2 p-4 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">Create Game</h2>
          <form onSubmit={handleSubmit}>
            <div className="relative z-0 w-full group">
              <input
                value={gameCreator.name}
                onChange={(e) => addGameName(e.target.value)}
                type="text"
                name="name"
                id="name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Name
              </label>
            </div>
            <div className="flex items-center gap-2 relative z-0 w-full mb-6 group">
              <div className="w-10/12">
                <input
                  value={temPlayer}
                  onChange={(e) => setTemPlayer(e.target.value)}
                  type="text"
                  name="player"
                  id="player"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="player"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  player
                </label>
              </div>
              <div className="w-2-12">
                <button
                  type="button"
                  onClick={addPlayer}
                  className="flex items-center gap-2 justify-center bg-blue-600 text-white rounded-lg text-sm px-5 py-1 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {"Add player "}
                  <svg
                    id="Layer_1"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                  >
                    <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex relative gap-2 z-0 w-full  group overflow-x-auto">
              {/* {JSON.stringify(gameCreator)} */}
              {gameCreator.players &&
                gameCreator.players.map((p) => {
                  return (
                    <div
                      key={p}
                      className={`m-w-3/5   p-1 rounded shadow bg-green-200`}
                    >
                      {p}
                    </div>
                  );
                })}
            </div>
            <button
              type="submit"
              disabled={gameCreator.players.length >= 2 ? false : true}
              className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
            >
              Let's do it
            </button>
            <button
              type="button"
              onClick={() => setGameModal(false)}
              className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderButtonGame = () => {

    return (
      !gameInProgress ? (
        <button disabled={game ? false : true} onClick={() => setGameModal(true)} type="button"
          className="hover:cursor-pointer h-12 w-32 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br
           focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          START
        </button>
      ) : (
        <GameStart></GameStart>
      )
    )
  }
  const handleStartGame = () => {
    addGameProgress(true)
  };
  const categoryFetch = async () => {
    await fetchGetCategory(addCategorys);
}
  const updateGlobalContext = async () => {
    console.log("object");
    const data = await localStorage.getItem(KEY_LOCAL_STORAGE);
    if(data){
      const jsonparse= await JSON.parse(data);
      addGameContext(jsonparse);
      await updateDataQuestions();
      addGameProgress(true);
      await categoryFetch();
    }
  }
  const updateDataQuestions = async () => {
    return toast
      .promise(FetchAllQuestionsBd(), {
        loading: "Loading Operation",
        success: "Uploaded Information.",
        error: "Operation Error!.",
      })
      .then((r) => {
        addDataQuestions(r.data.data);
      });
  };
  useEffect(()=>{
    updateGlobalContext();
  },[])
  useEffect(() => {
    const handleUpdate = async () => {
      const response = await selected(id);
      setGame(response);
    };
    handleUpdate();
  }, [id, selected]);

  return (
    <div className='grid grid-cols-3 grid-rows-5 p-1 h-screen gradient-blue'>
      <Bar context={'progress'}></Bar>
      <div className='col-span-1 flex p-4 rounded-2xl h-full'>
        {game ? renderHeadSelected() : 'Cargando datos...'}
      </div>
      <div className='flex w-full col-span-3 row-span-4 flex  rounded-2xl justify-center h-full'>
        {
          renderButtonGame()
        }
        {

          gameModal ? renderModalGame() : null
        }
      </div>
    </div>
  );
};

export default GameInProgress;

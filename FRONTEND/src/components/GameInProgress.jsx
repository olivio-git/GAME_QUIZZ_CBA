import React, { useContext, useEffect, useState } from 'react';
import Bar from './Bar';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import DataContext from '../context/dataContext';
import GameStart from './GameStart';

const GameInProgress = () => {
  const { id } = useParams();
  const { data, selected, gameInProgress, addGameProgress } = useContext(DataContext);
  const [game, setGame] = useState(null);
  const [gameSrc, setGameSrc] = useState(null);
  const navigate = useNavigate();
  const renderHeadSelected = () => {
    return (
      <div className='w-full bg-white rounded-2xl p-4'>
        <div className="flex flex-col justify-center items-center text-black gap-5">
          <h3 className="text-3xl font-bold">{game.name}</h3>
          <p className="text-lg">{game.description}</p>
        </div>
      </div>
    );
  };
  const renderButtonGame = () => {
    return (
      !gameInProgress ? (
        <button disabled={ game?false:true } onClick={handleStartGame} type="button"
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
  useEffect(() => {
    const handleUpdate = async () => {
      const response = await selected(id);
      setGame(response);
    };
    handleUpdate();
  }, [id, selected]);

  return (
    <div className='grid grid-cols-3 grid-rows-5 gap-4 p-4 h-screen gradient-blue'>
      <Bar context={'progress'}></Bar>
      <div className='col-span-1 flex p-4 rounded-2xl h-full'>
        {game ? renderHeadSelected() : 'Cargando datos...'}
      </div>
      <div className='col-span-3 row-span-4 flex p-4 rounded-2xl h-full justify-center items-center h-full'>
        {
          renderButtonGame()
        }
      </div>
    </div>
  );
};

export default GameInProgress;

import React, { useContext, useEffect, useState } from 'react';
import Bar from './Bar';
import { useParams } from 'react-router-dom';
import DataContext from '../context/dataContext';

const GameInProgress = () => {
  const { id } = useParams();
  const { data, selected } = useContext(DataContext);
  const [game, setGame] = useState(null);

  const renderSelected = () => {
    return (
      <div className='w-full bg-white rounded-2xl p-4'>
        <div className="flex flex-col justify-center items-center text-black gap-5">
          <h3 className="text-xl font-bold">{game.name}</h3>
          <p>{game.description}</p>
        </div>
      </div>
    );
  }

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
        {game ? renderSelected() : 'Cargando datos...'}
      </div>
      <div className='col-span-3 flex p-4 rounded-2xl h-full'></div>
    </div>
  );
};

export default GameInProgress;

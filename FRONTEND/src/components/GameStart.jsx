import React, { useContext } from 'react';
import DataContext from '../context/dataContext';
import { Link } from 'react-router-dom';

const GameStart = () => {
    const { addGameName, addGamePlayers } = useContext(DataContext);
    return (
        <div>

        </div>
    );
}

export default GameStart;

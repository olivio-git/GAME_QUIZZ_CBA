import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import DataContext from "../../context/dataContext";
import { fetchPostGame } from "../../utils/fetchBackend";
import { KEY_LOCAL_STORAGE } from "../../utils/emvironments";

const GameModal = ({ setGameModal }) => {
  const {
    gameCreator,
    addGamePlayers,
    addGameName,
    restartGameCreator,
    addGameContext,
    addGameProgress,
  } = useContext(DataContext);
  
  const [temPlayer, setTemPlayer] = useState("");

  const addPlayer = () => {
    if (temPlayer !== "") {
      addGamePlayers(temPlayer);
      setTemPlayer("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await toast.promise(fetchPostGame(gameCreator), {
      loading: "Loading Operation",
      success: "Operation Success!",
      error: "Operation Error!",
    }).then(async (r) => {
      setTemPlayer("");
      restartGameCreator();
      setGameModal(false);
      addGameProgress(true);

      await localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(r.data.data));
      const res = await localStorage.getItem(KEY_LOCAL_STORAGE);
      const jsonparse = await JSON.parse(res);
      addGameContext(jsonparse);
    });
  };

  return (
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
};

export default GameModal;

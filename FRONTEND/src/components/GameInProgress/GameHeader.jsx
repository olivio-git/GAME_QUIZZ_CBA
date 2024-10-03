import React from "react";

const GameHeader = ({ game }) => {
  return (
    <div className="w-full bg-white rounded-2xl">
      <div className="flex flex-col justify-center items-center text-black gap-5">
        <h3 className="text-3xl font-bold">{game.name}</h3>
        <p className="text-lg">{game.description}</p>
      </div>
    </div>
  );
};

export default GameHeader;

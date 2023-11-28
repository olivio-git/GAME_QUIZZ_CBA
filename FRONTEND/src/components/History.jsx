import React, { useContext } from 'react'
import DataContext from '../context/dataContext';

export default function History() {
    const {gameQuestions}=useContext(DataContext);
  return (
    <div className="flex h-screen w-full bg-red-100 overflow-x-auto">
      <div className="grid grid-cols-4 grid-rows-4 gap-4 p-4 h-screen gradient-blue w-full">
        {gameQuestions && gameQuestions.map((g,index) => {
          return (
            <div key={index} className="bg-white flex rounded-2xl p-2">
              <div className="w-2/3 flex flex-col items-center justify-center overflow-y-auto overflow-x-auto">
                <p>{"Departure: "}</p>
                <p>{g.name}</p>
              </div>
              <div className="flex h-full flex-col items-center overflow-y-auto overflow-x-auto w-full">
                {g.winners.map((a,index) => {
                  return (
                    <div key={index+1}>
                      <p>
                        {a.name}
                        {": "}
                        {a.point}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

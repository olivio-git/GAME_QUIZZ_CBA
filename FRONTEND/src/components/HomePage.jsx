import React, { useContext } from "react";
import Bar from "./Bar";
import DataContext from "../context/dataContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { data, addCloseMenu } = useContext(DataContext);

  const renderGames = () => {
    return data.map((g) => {
      return (
        <div
          style={{ height: "250px" }}
          className="w-3/6 sm:w-5/12 md:w-4/12 lg:w-3/12 xl:w-2/12
            rounded-lg shadow-lg 
            h-24 relative hover:scale-105 transition ease-in-out delay-80 p-2 bg-opacity-5 bg-white shadow-2xl border-gray-300 "
          key={g.id}
          onClick={addCloseMenu}
        >
          <Link to={`/gameprogress/${g.id}`}>
            <img
              src={g.image}
              alt="One"
              className="w-full h-full rounded-lg"
            />
            <div
              className="absolute top-0 left-0 right-0 bottom-0 hover:cursor-pointer rounded-lg
            flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-95"
            >
              <div className="bg-white text-center hover:text-black w-full h-full justify-center 
              items-center  rounded-lg flex flex-col">
                <h3 className="text-7xl roboto-condensed font-[300] text-[#001E41]">
                  {g.name}
                </h3>
                <p className=" text-2xl font-[300] text-[#001E41] roboto-condensed">
                  {g.description}
                </p>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  return (
    <> 
      <div className="absolute inset-0 h-screen w-full bg-[#151515] z-0 gradient-abc"></div> 
      
      <div className="relative grid grid-cols-3 grid-rows-4 gap-4 p-4 h-screen z-10">
        <Bar context={"home"}></Bar>
        <div className="col-span-3 flex p-4 rounded-lg h-full gap-2 h-max">
          {data.length ? renderGames() : null}
        </div>
      </div>
    </>
  );
  
};
export default HomePage;

import React, { useContext } from 'react'; 
import Bar from './Bar';
import DataContext from '../context/dataContext';
import { Link } from 'react-router-dom';

const HomePage = () => {

  const { data, addCloseMenu } = useContext(DataContext);

  const renderGames = () => {
    return (
      data.map((g) => {
        return (
          <div
            style={{ height: '250px' }}
            className='w-3/6 sm:w-5/12 md:w-4/12 lg:w-3/12 xl:w-2/12 bg-white 
            rounded-2xl dark:bg-gray-800 dark:border-gray-700 shadow-2xl h-24 relative hover:scale-105 transition ease-in-out delay-80'
            key={g.id}
            onClick={addCloseMenu}
          >
            <Link to={`/gameprogress/${g.id}`} >
              <img
                src={g.image}
                alt='One'
                className='w-full h-full rounded-2xl'
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 hover:cursor-pointer rounded-2xl 
            flex items-center justify-center opacity-0 transition-opacity duration-300 bg-black bg-opacity-50 hover:opacity-100">
                <div className="text-white text-center">
                  <h3 className="text-xl font-bold">{g.name}</h3>
                  <p>{g.description}</p>
                </div>
              </div>
            </Link>
          </div>
        );
      })
    );
  };

  return (
    <div className='grid grid-cols-3 grid-rows-4 gap-4 p-4 h-screen gradient-blue'>
      <Bar context={'home'}></Bar>
      <div className='col-span-3 flex p-4 rounded-2xl h-full gap-2'>
        {data.length ? renderGames() : null}
      </div>
    </div>
  );
};
export default HomePage;

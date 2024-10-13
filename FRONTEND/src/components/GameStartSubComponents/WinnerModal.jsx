// WinnerModal.jsx
import React from 'react';
import { FaUserCheck, FaUserTimes } from 'react-icons/fa'; // Import user icons

const WinnerModal = ({ renderOrd, handleSubmitGameSave, handleCloseGame }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="flex justify-center items-center flex-col bg-green-200 w-11/12 md:w-1/3 h-auto p-8 rounded-2xl shadow-lg border-4 border-green-800">
        <div className="flex flex-col items-center justify-center w-full mb-4">
          <h1 className="text-2xl font-extrabold text-green-800">Scoreboard</h1>
          {renderOrd()}
        </div>
        <div className="flex p-1 justify-between w-full mt-8">
          <button
            onClick={handleSubmitGameSave}
            className="flex items-center justify-center p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 shadow-md"
          >
            <FaUserCheck className="h-5 w-5 mr-2" /> {/* User icon for success */}
            Save and Exit
          </button>
          <button
            onClick={handleCloseGame}
            className="flex items-center justify-center p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
          >
            <FaUserTimes className="h-5 w-5 mr-2" /> {/* User icon for cancel */}
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;

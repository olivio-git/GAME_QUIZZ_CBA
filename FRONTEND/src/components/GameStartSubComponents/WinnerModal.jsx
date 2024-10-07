// WinnerModal.jsx
import React from 'react';

const WinnerModal = ({ renderOrd, handleSubmitGameSave, handleCloseGame }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="flex justify-center items-center flex-col bg-white w-1/3 h-[90%] p-10 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center justify-center w-full mb-4">
          <h1 className="text-2xl font-bold text-gray-700">Scoreboard</h1>
          {renderOrd()}
        </div>
        <div className="flex p-1 justify-between w-full mt-8">
          <button
            onClick={handleSubmitGameSave}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save and exit
          </button>
          <button
            onClick={handleCloseGame}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;

import React from 'react';

const ModalError = ({ questionCheck, questionGameIn, onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center text-red-600 p-6 rounded-lg shadow-lg bg-white">
      <div className="flex items-center justify-center mb-4">
        <i className="fas fa-times-circle text-5xl"></i>
      </div>
      <h2 className="text-3xl font-semibold mb-2">Error!</h2>
      <p className="text-lg text-center mb-4">
        {questionCheck ? (
          <div>
            <div className="flex flex-col items-center w-full">
              {questionGameIn.answer.map((q) => (
                <div
                  key={q.value}
                  className={`w-5/5 p-1 rounded-lg text-center mb-2 transition duration-900 ${
                    q.correct ? 'bg-green-200 border border-green-400' : 'bg-red-200 border border-red-400'
                  }`}
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {q.value}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <span className="text-lg">You must select an answer.</span>
        )}
      </p>
      <button
        onClick={onClose}
        className="mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-200"
      >
        Close
      </button>
    </div>
  );
};

export default ModalError;

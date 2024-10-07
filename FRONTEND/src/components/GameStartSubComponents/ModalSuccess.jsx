import React from 'react';
import Confetti from "react-confetti";

const ModalSuccess = ({ success }) => {
  return (
    <div className="flex flex-col items-center justify-center text-green-500 p-4 rounded-lg">
      <i className="fas fa-check-circle text-4xl mb-2"></i>
      <h2 className="text-2xl mb-2">Correct!</h2>
      <p>You answered the question correctly.</p>
      {success ? <Confetti /> : null}
    </div>
  );
};

export default ModalSuccess;

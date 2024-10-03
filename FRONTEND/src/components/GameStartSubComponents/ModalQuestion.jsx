// ModalQuestion.jsx
import React from 'react';
import { Ejemplo } from './ejemplo';
const ejemplo= new Ejemplo('Ronald')
const ModalQuestion = ({ success, error, renderPrevCheckQuestion, renderModalSuccess, renderModalError }) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-1/2 p-8 rounded-2xl shadow-lg">
        <div>
          {!success && !error ? renderPrevCheckQuestion() : null}
          {success ? renderModalSuccess() : null}
          {error ? renderModalError() : null}
        </div>
      </div>
    </div>
  );
};

export default ModalQuestion;

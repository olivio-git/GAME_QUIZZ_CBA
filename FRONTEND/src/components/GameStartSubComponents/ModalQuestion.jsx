import React from 'react';

const ModalQuestion = ({ success, error, renderPrevCheckQuestion, renderModalSuccess, renderModalError }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-1/2 p-8 rounded-2xl shadow-lg">
        <div>
          {/* Muestra el componente de verificación de pregunta si no hay error o éxito */}
          {!success && !error ? renderPrevCheckQuestion() : null}
          {/* Si la respuesta es correcta muestra el modal de éxito */}
          {success ? renderModalSuccess() : null}
          {/* Si la respuesta es incorrecta muestra el modal de error */}
          {error ? renderModalError() : null}
        </div>
      </div>
    </div>
  );
};

export default ModalQuestion;

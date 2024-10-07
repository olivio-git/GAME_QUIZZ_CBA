import React, { useState, useRef } from "react";
import Bar from "../Bar";
import toast from "react-hot-toast";
import { fetchPostFile } from "../../utils/fetchBackend";

export const Uploader = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Referencia al input de tipo file

  // Manejador para la selección manual de archivos desde el explorador
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      toast.success("Archivo correcto");
    } else {
      toast.error("Archivo incorrecto");
    }
  };
  const handleUploadServer = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await  fetchPostFile(formData); 
      toast.success(response.data.data.message); 
    } catch (error) {
      toast.error("Error al subir el archivo");
    }
  }
  // Manejador para el drop de archivos
  const handleDrop = (e) => {
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(droppedFile);
      toast.success("Archivo correcto");
    } else {
      toast.error("Archivo incorrecto");
    }
  };

  return (
    <div className="grid grid-cols-1 grid-rows-4 gap-2 p-2 h-screen gradient-blue w-full">
      <div className="flex p-2 col-span-1 rounded-lg w-full h-full">
        <Bar context={"dashboard"} />
      </div>
      <div className="flex w-full flex-col">
        <div className="flex row-span-1 rounded-lg w-full h-[40vh] justify-center items-center">
          <div
            className="flex flex-col items-center justify-center w-3/4 h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100  "
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(e);
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".xlsx"
              onChange={handleFileSelect}
            />

            {file ? (
              <p className="text-xs text-gray-500 dark:text-gray-700">
                Archivo cargado: {file.name}
              </p>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  <svg
                    className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-700"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-1 text-sm text-gray-700 dark:text-gray-700">
                    <span className="font-semibold">
                      Arrastra archivos aquí
                    </span>{" "}
                    o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-700">
                    Solo archivos .xlsx
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center mt-10">
          {file && (
            <button onClick={handleUploadServer} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m8 8 4-4 4 4"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 4v12M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
              </svg>
              <span>Upload</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

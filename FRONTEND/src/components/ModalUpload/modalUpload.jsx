import { useEffect, useRef, useState } from "react";
import ImageUpload from "../../assets/upload-file.png"; // Your image for upload illustration
import axios from "axios";

const ModalUploadQuestions = ({ handleToggleModal }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload/Filexlsx", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // You can implement your own alert system here
      if (response.data.success) {
        alert(response.data.message); // Replace with your own success notification
      } else {
        alert(response.data.message); // Replace with your own information notification
      }

      setTimeout(() => {
        handleToggleModal();
      }, 1000);
    } catch (error) {
      alert("Registration could not be completed"); // Replace with your own error notification
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (e) => {
    e.preventDefault();
    fileInputRef.current.value = "";
    setFile(null);
  };

  useEffect(() => {}, [file]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950/20 z-[1] p-2 flex items-center justify-center">
      <div onClick={handleToggleModal} className="fixed inset-0 z-[2]"></div>
      <div className="relative w-[500px] h-[500px] bg-white rounded-2xl shadow-xl z-[3]">
        <button
          onClick={handleToggleModal}
          className="right-0 text-zinc-500 absolute m-3 transition ease-in-out duration-500 hover:scale-[1.2]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="gray"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="flex flex-col px-8 pt-8 pb-5 text-zinc-500">
          <span className="font-bold text-xl">Upload a File</span>
          <span>Attach the file below</span>
          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 space-y-2">
              <div className="flex items-center justify-center w-full">
                <label
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={handleDragLeave}
                  className={`cursor-pointer flex flex-col rounded-lg border-[3.5px] border-dashed w-full h-60 p-5 group text-center 
                                    justify-center items-center  
                                    ${
                                      isDragging
                                        ? "border-white bg-violet-100"
                                        : "border-violet-200"
                                    }`}
                >
                  {file != null ? (
                    <div className="h-full w-full flex flex-row justify-center items-center">
                      <div className="flex flex-col w-[130px]">
                        <div className="z-10 h-[130px] w-[130px] bg-teal-50 shadow-xl text-teal-500 flex items-center justify-center rounded-lg relative">
                          <span
                            onClick={removeFile}
                            className="top-0 right-0 text-zinc-500 absolute m-2 transition ease-in-out duration-500 hover:scale-[1.2]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="gray"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </span>
                          <svg
                            fill="#5eead4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 50 50"
                          >
                            <path d="M28.8125 .03125L.8125 5.34375C.339844 5.433594 0 5.863281 0 6.34375L0 43.65625C0 44.136719 .339844 44.566406 .8125 44.65625L28.8125 49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z"></path>
                          </svg>
                        </div>
                        <span className="bg-teal-100 mt-1.5 shadow-xl rounded-full px-2 break-words text-[11px] font-semibold py-[3px] text-center z-10">
                          {file.name}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full text-center flex flex-col items-center justify-center">
                      <img
                        className="has-mask object-center h-[80%]"
                        src={ImageUpload}
                        alt="upload-file-cba"
                      />
                      <p className="pointer-none text-zinc-500 font-extrabold text-base">
                        Drag and drop a{" "}
                        <span className="text-violet-500">file</span> here{" "}
                        <br />
                        <span className="text-xs font-bold">
                          or{" "}
                          <span className="text-violet-500 hover:underline">
                            select a file
                          </span>{" "}
                          from your computer
                        </span>{" "}
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls"
                  />
                </label>
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              <span>File type: xls, xlsx</span>
            </p>
            <div className="flex justify-center py-7">
              <button
                type="submit"
                className="rounded-full bg-cbaBlue text-white font-semibold text-sm px-14 h-10"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalUploadQuestions;

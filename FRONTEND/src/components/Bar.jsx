import React, { useContext, useState } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";
import Menu from "./Menu";
import DataContext from "../context/dataContext";
import {
  KEY_LOCAL_STORAGE,
  KEY_LOCAL_STORAGE_ROUNDS,
  KEY_LOCAL_STORAGE_TURNS,
  KEY_LOCAL_STORAGE_POINTS,
  IMAGE_CLOUDFRONT_STUDENTS,
  KEY_LOCAL_STORAGE_USEDQUESTIONS,
  KEY_LOCAL_STORAGE_TURN,
} from "../utils/emvironments";
import { removeItemsLocalStorage } from "../utils/functions";
const Bar = ({ context }) => {
  const { addOpenMenu, menu, addGameContext, addGameProgress, addCategorys } =
    useContext(DataContext);
  const navigate = useNavigate();
  const [modalConfirm, setModalConfirm] = useState(false);

  const handleNavigate = () => {
    setModalConfirm(false) 
    if (context != "home") {
      // const shouldNavigate = window.confirm(
      //   "Estás seguro de volver al inicio?"
      // );
      // if (shouldNavigate) {
        navigate("/");
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_ROUNDS);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_TURNS);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_TURN);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_POINTS);
        removeItemsLocalStorage(KEY_LOCAL_STORAGE_USEDQUESTIONS);
        addGameContext(null);
        addGameProgress(false);
        addCategorys([]);
        localStorage.removeItem(KEY_LOCAL_STORAGE);
      }
    // }
  };

  return (
    <div className="col-span-2 flex flex-row rounded-lg h-full p-4 gap-2 w-full">
      <div className="w-1/6 flex flex-col  bg-opacity-10 bg-white h-full rounded-lg ">
        <div className="flex justify-center items-center w-12/12 bg-white h-3/6 rounded-t-lg hover:cursor-pointer ">
          <img
            src={IMAGE_CLOUDFRONT_STUDENTS}
            alt="Students"
            className={context != "home" ? "w-[50px]" : "w-[70px]"}
          />
        </div>
        <div className="w-12/12 flex flex-row rounded-b-lg bg-white h-3/6">
          <div
            onClick={() => {
                if(context != "home"){
                  setModalConfirm(true)}}
                }
            className="flex justify-center items-center  hover:bg-white hover:bg-opacity-10  hover:cursor-pointer w-6/12   rounded-bl-lg  "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Outline"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="#001E41"
            >
              <path d="M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z" />
            </svg>
          </div>
          <div
            onClick={() => addOpenMenu(!menu)}
            className="flex justify-center items-center  hover:bg-white hover:bg-opacity-10 hover:cursor-pointer w-6/12 rounded-br-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Outline"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="#001E41"
            >
              <path d="M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" />
              <path d="M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z" />
            </svg>
            <div className="relative">{menu ? <Menu></Menu> : null}</div>
          </div>
        </div>
      </div>
      <div className="w-5/6 flex h-full rounded-lg items-center justify-center">
        <h1 className="mb-4 text-5xl font-extrabold text-gray-800 dark:text-white md:text-5xl lg:text-8xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-[#FEBBC6] from-[#FF4CAD] pixelify-sans">
            CBA
          </span>
          <span className="text-transparent bg-gradient-to-r bg-clip-text from-[#FEBBC6] to-[#628AE4] pixelify-sans"> GAMES</span>
        </h1>
      </div>
      {modalConfirm && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity"
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Go back
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to go back to the home page?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={handleNavigate}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#F0003C] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setModalConfirm(false)}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bar;

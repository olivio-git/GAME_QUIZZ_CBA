import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="absolute left-1/2 z-10 mt-5 ml-0 flex w-80 max-w-max px-4">
      <div className="w-80 max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
        <div className="">
          <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="gray"
              >
                <rect x="7" width="10" height="6" />
                <circle cx="12" cy="14" r="2" />
                <path d="M19,0V8H5V0H3A3,3,0,0,0,0,3V24H24V5ZM12,18a4,4,0,1,1,4-4A4,4,0,0,1,12,18Z" />
              </svg>
            </div>
            <div>
              <Link to={"/dashboard"} className="font-semibold text-gray-900">
                Admin
                <span className="absolute inset-0"></span>
              </Link>
              <p className="mt-1 text-gray-600">Manage questions</p>
            </div>
          </div>
          <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Outline"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="gray"
              >
                <path d="M19,3H12.472a1.019,1.019,0,0,1-.447-.1L8.869,1.316A3.014,3.014,0,0,0,7.528,1H5A5.006,5.006,0,0,0,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V8A5.006,5.006,0,0,0,19,3ZM5,3H7.528a1.019,1.019,0,0,1,.447.1l3.156,1.579A3.014,3.014,0,0,0,12.472,5H19a3,3,0,0,1,2.779,1.882L2,6.994V6A3,3,0,0,1,5,3ZM19,21H5a3,3,0,0,1-3-3V8.994l20-.113V18A3,3,0,0,1,19,21Z" />
              </svg>
            </div>
            <div>
              <Link to={"/history"} className="font-semibold text-gray-900">
                History
                <span className="absolute inset-0"></span>
              </Link>
              <p className="mt-1 text-gray-600">View game history</p>
            </div>
          </div>
          <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
              <svg
                width="30"
                height="30"
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
            </div>
            <div>
              <Link to={"/upload"} className="font-semibold text-gray-900">
                Upload File
                <span className="absolute inset-0"></span>
              </Link>
              <p className="mt-1 text-gray-600">Add questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;

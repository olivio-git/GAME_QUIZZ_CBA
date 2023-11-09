import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
    return (
        <div className="absolute left-1/2 z-10 mt-5 ml-0 flex w-80 max-w-max px-4">
            <div className="w-80 max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                <div className="">
                    <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="20" height="20" fill='gray'><rect x="7" width="10" height="6" /><circle cx="12" cy="14" r="2" /><path d="M19,0V8H5V0H3A3,3,0,0,0,0,3V24H24V5ZM12,18a4,4,0,1,1,4-4A4,4,0,0,1,12,18Z" /></svg>
                        </div>
                        <div>
                            <Link to={'/'} className="font-semibold text-gray-900">
                                History
                                <span className="absolute inset-0"></span>
                            </Link>
                            <p className="mt-1 text-gray-600">View game history</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
};

export default Menu;

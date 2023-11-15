import React, { useContext, useState } from 'react';

import Students from '../assets/students.png'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import DataContext from '../context/dataContext';
import {
    KEY_LOCAL_STORAGE,
    KEY_LOCAL_STORAGE_ROUNDS,
    KEY_LOCAL_STORAGE_TURNS,
    KEY_LOCAL_STORAGE_POINTS} from "../utils/emvironments";
const Bar = ({ context }) => {
const {addOpenMenu, menu , addGameContext,addGameProgress,addCategorys}=useContext(DataContext);
    const navigate = useNavigate();
    const handleNavigate = () => {
        if (context != "home") {
            const shouldNavigate = window.confirm('Estás seguro de volver al inicio?');
            if (shouldNavigate) {
                navigate('/');
                localStorage.removeItem(KEY_LOCAL_STORAGE_ROUNDS);
                localStorage.removeItem(KEY_LOCAL_STORAGE_TURNS);
                localStorage.removeItem(KEY_LOCAL_STORAGE_POINTS);
                addGameContext(null);
                addGameProgress(false);
                addCategorys([]);
                localStorage.removeItem(KEY_LOCAL_STORAGE);
            }
        }
    };

    return (
        <div className='col-span-2 flex flex-row rounded-2xl h-full p-4 gap-2 w-full'>
            <div className='w-1/6 flex flex-col bg-white h-full rounded-2xl '>
                <div className='flex justify-center items-center w-12/12 bg-white h-3/6 rounded-t-2xl border-b'>
                    <img src={Students} alt="Students" className={context != 'home' ? 'w-[50px]' : 'w-[70px]'} />
                </div>
                <div className='w-12/12 flex flex-row rounded-b-2xl bg-white h-3/6'>
                    <div onClick={() => handleNavigate()} className='flex justify-center items-center  hover:bg-gray-100 hover:cursor-pointer w-6/12 bg-white rounded-bl-2xl border-r border-t'>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" fill='gray'>
                            <path d="M23.121,9.069,15.536,1.483a5.008,5.008,0,0,0-7.072,0L.879,9.069A2.978,2.978,0,0,0,0,11.19v9.817a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V11.19A2.978,2.978,0,0,0,23.121,9.069ZM15,22.007H9V18.073a3,3,0,0,1,6,0Zm7-1a1,1,0,0,1-1,1H17V18.073a5,5,0,0,0-10,0v3.934H3a1,1,0,0,1-1-1V11.19a1.008,1.008,0,0,1,.293-.707L9.878,2.9a3.008,3.008,0,0,1,4.244,0l7.585,7.586A1.008,1.008,0,0,1,22,11.19Z" />
                        </svg>
                    </div>
                    <div onClick={() => addOpenMenu(!menu)} className='flex justify-center items-center  hover:bg-gray-100 hover:cursor-pointer w-6/12 bg-white border-l border-t rounded-br-2xl'>
                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" fill='gray'><path d="M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" /><path d="M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z" /></svg>
                        <div className='relative'>
                            {
                                menu ? <Menu></Menu> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-5/6 flex bg-white h-full rounded-2xl items-center justify-center'>
                <h1 className="mb-4 text-5xl font-extrabold text-gray-800 dark:text-white md:text-5xl lg:text-6xl">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">CBA</span>
                    <span className='text-indigo-800'> GAMES</span>
                </h1>
            </div>
        </div>
    );
};

export default Bar;

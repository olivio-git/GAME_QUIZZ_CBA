import React, { useContext, useEffect, useState } from 'react';
import DataContext from '../context/dataContext';
import { fetchGetCategory } from '../utils/fetchBackend';

import dataQuestions from '../utils/exampleQuestions.json';

const GameStart = () => {
    const [modalQuestion, setModalQuestion] = useState(false);
    const [questionGameIn, setQuestinGameIn] = useState(null);
    const { gameContext, categorys, addCategorys } = useContext(DataContext);

    const stateRender = (question) => {
        setQuestinGameIn(question)
        setModalQuestion(true);
    }

    const renderModalQuestion = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white w-1/2 p-8 rounded-2xl shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">
                        {questionGameIn.question}
                    </h1>
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Responses</h2>
                        <div className="pl-4">
                            {questionGameIn.answer.map((a, index) => (
                                <div key={index} className="mb-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="response"
                                            value={a.response}
                                            checked={a.selected} 
                                            onChange={() => handleResponseSelect(index)}
                                            className="mr-2"
                                        />
                                        {a.response}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => setModalQuestion(false)}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
    };



    return (
        <div className='grid grid-cols-3 grid-rows-5 w-full gap-1'>
            <div className='grid grid-cols-3 col-span-3 border bg-white border-none rounded-2xl p-2 shadow shadow-2xl'>
                <div className="flex justify-center items-center col-span-1   border-r-4 ">
                    <h1 className="mb-4 text-4xl font-extrabold leading-none text-blue-700 md:text-2xl lg:text-2xl ">
                        GAME: <span className='text-blue-900'>{gameContext.game.name}</span>
                    </h1>
                </div>
                <div className="flex justify-center items-center col-span-1  pl-2">

                    <div className='w-2/12 justify-center items-center '>
                        <h1 className="text-4xl font-extrabold leading-none text-blue-700 md:text-2xl lg:text-2xl ">
                            Players
                        </h1>
                    </div>
                    <div className='w-10/12 justify-center items-center'>
                        {
                            gameContext.players && gameContext.players.map((g, index) => {
                                return (
                                    <div key={index} className='flex px-12   rounded-2xl'>
                                        <p className='font-bold text-teal-600'><span className='text-blue-800'>{index + 1 + ' '}</span>{g.name_player}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className='w-10/12'>
                        {
                            gameContext.players && gameContext.players.map((g, index) => {
                                return (
                                    <p key={index}>{index + 1}</p>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="flex justify-center items-center col-span-1  border-l-4 pl-2">
                    <div className='w-2/12 justify-center items-center'>
                        <h1 className="text-4xl font-extrabold leading-none text-blue-700 md:text-2xl lg:text-2xl ">
                            Turn
                        </h1>
                    </div>

                </div>
            </div>
            <div className='col-span-3 row-span-4 grid grid-cols-5 grid-rows-6 justify-center gap-2 rounded-2xl  '>
                {
                    categorys && categorys.map((c) => {
                        return (
                            <div key={c.id_category} className='col-span-1 row-span-1'>
                                <button type="button"
                                    className="w-full  h-full bg-white rounded-2xl shadow">
                                    <h1 className='text-4xl font-extrabold leading-none text-red-400 md:text-2xl lg:text-2xl '>
                                        {c.name_category}
                                    </h1>
                                </button>
                            </div>
                        );
                    })
                }
                {
                    categorys && categorys.map((c, index) => {
                        return (
                            <div key={c.index} className='col-span-1  row-span-5 grid grid-rows-5 gap-2 '>
                                {
                                    dataQuestions.map((q, ind) => {
                                        if (q.CategoryIdCategory == categorys[index].id_category) {
                                            return (
                                                <div key={ind + 1} onClick={() => stateRender(q)} className="flex items-center justify-center
                                                font-bold text-gray-600 bg-white row-span-1 rounded-2xl shadow-2xl hover:cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="35" fill='purple' height="35"><path d="M12,19c-.829,0-1.5-.672-1.5-1.5,0-1.938,1.352-3.709,3.909-5.118,1.905-1.05,2.891-3.131,2.51-5.301-.352-2.003-1.997-3.648-4-4-1.445-.254-2.865,.092-4.001,.974-1.115,.867-1.816,2.164-1.922,3.559-.063,.825-.785,1.445-1.609,1.382-.826-.063-1.445-.783-1.382-1.609,.17-2.237,1.29-4.315,3.073-5.7C8.89,.278,11.149-.275,13.437,.126c3.224,.566,5.871,3.213,6.437,6.437,.597,3.399-1.018,6.794-4.017,8.447-1.476,.813-2.357,1.744-2.357,2.49,0,.828-.671,1.5-1.5,1.5Zm-1.5,3.5c0,.828,.672,1.5,1.5,1.5s1.5-.672,1.5-1.5-.672-1.5-1.5-1.5-1.5,.672-1.5,1.5Z" /></svg>
                                                </div>

                                            )
                                        }
                                    })
                                }
                            </div>
                        );
                    })
                }
                {
                    modalQuestion ? renderModalQuestion() : null
                }
            </div>
        </div>
    );
}

export default GameStart;

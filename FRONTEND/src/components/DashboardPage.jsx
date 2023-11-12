import React, { useContext, useEffect, useState } from 'react';
import Bar from './Bar';
import { fetchDeleteCategory, fetchDeleteQuestion, fetchGetCategory, fetchGetQuestions, fetchPostCategory, fetchPostQuestion } from '../utils/fetchBackend';
import toast, { Toaster } from 'react-hot-toast';
import DataContext from '../context/dataContext';
import { dateFormat } from '../utils/functions';
import { motion, AnimatePresence } from 'framer-motion';


const HEAD_PROPERTYS_CATEGORYS = [
    'Ident', 'Category Name', 'Creation', " "
]
const HEAD_PROPERTYS_QUESTION = [
    'Ident', 'Question', 'Category', 'Difficulty', " "
]
const DashboardPage = () => {
    const { categorys, addCategorys, questions, addQuestions,catSelect, addCatSet } = useContext(DataContext);
    const [selected, setSelected] = useState(null);
    const [modalCat, setModalCat] = useState(false);
    const [modalQuest, setModalQuest] = useState(false);
    const [name_category, setCategory] = useState(""); //estado de carga
    const [question, setQuestion] = useState({ //estado de carga
        question: "",
        category: "",
        type: "",
        answer: [],
        difficulty: "easy",
        stage: "",
        CategoryIdCategory: selected ? selected.id_category : ""
    });
    const [tempQuest, setTempQuest] = useState({
        value: "",
        correct: false
    });
    const handleDelete = (id) => {
        toast.promise(fetchDeleteCategory(id), {
            loading: 'Loading Operation',
            success: 'Operation Success!.',
            error: 'Operation Error!.',
        })
            .then((r) => {
                addCategorys(r.data.data.length > 0 ? r.data.data : []);
                setSelected(null);
            });
    };
    const handleDeleteQuestion = (id) => {
        toast.promise(fetchDeleteQuestion(id,catSelect.id_category), {
            loading: 'Loading Operation',
            success: 'Operation Success!.',
            error: 'Operation Error!.',
        })
            .then((r) => {
                addQuestions(r.data.data.length > 0 ? r.data.data : []);
                setSelected(null);
            });
    }
    const handleSelect = (obj) => {
        setSelected(obj);
        addCatSet(obj);
    }
    const renderHeaderCategorys = () => {
        return (
            HEAD_PROPERTYS_CATEGORYS.map((c, index) => {
                return (
                    <th key={c} scope="col" className="p-3 py-3 ">
                        {c}
                    </th>
                )
            })
        );
    };

    const renderBodyCategory = () => {
        return (
            categorys.map((c, index) => {
                return (
                    <motion.tr
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        key={c.id_category}
                        className={`bg-white ${selected && selected.id_category == c.id_category ? 'bg-blue-200' : ''}`}
                    >
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {index + 1 + " "} 
                        </th>
                        <td className={`px-6 py-4`}>
                            {c.name_category}
                        </td>
                        <td className="px-6 py-4">
                            {dateFormat(c.createdAt)}
                        </td>
                        <td className=''>
                            <button onClick={() => handleSelect(c)} className='hover:bg-green-200 rounded-2xl'>
                                <svg id="Layer_1" height="20" viewBox="0 0 24 24" width="20" fill='green' xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m15.008 24a3.007 3.007 0 0 1 -2.681-1.636l-3.127-6.704-3.542 3.093a1 1 0 0 1 -1.658-.753v-15.02a3 3 0 0 1 4.989-2.246l10.7 10.238a1 1 0 0 1 -.6 1.719l-4.468.407 3.065 6.569a3 3 0 0 1 -2.678 4.333zm-5.465-10.968a1.039 1.039 0 0 1 .207.021 1 1 0 0 1 .7.556l3.675 7.876a1 1 0 0 0 1.767-.94l-3.682-7.891a1 1 0 0 1 .815-1.419l3.7-.337-9.091-8.692a.972.972 0 0 0 -1.045-.138.986.986 0 0 0 -.589.912v12.82l2.885-2.52a1 1 0 0 1 .658-.248z" /></svg>
                            </button>
                            <button onClick={() => handleDelete(c.id_category)} className='hover:bg-red-200 rounded-2xl'>
                                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" fill='red'>
                                    <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z" /><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z" />
                                    <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z" />
                                </svg>
                            </button>
                        </td>

                    </motion.tr>
                )
            })
        );
    };
    const renderBodyQuestions = () => {

        return (
            questions.map((q,index) => {
                return (
                    <motion.tr
                        key={q.id_question}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-white"
                    >
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {index+1}
                        </th>
                        <td className="px-6 py-4">
                            {q.question}
                        </td>
                        <td className="px-6 py-4">
                            {
                                q.answer.map((a)=>{
                                    return(
                                        <p className={`${a.correct?"text-green-500":"text-red-400"}`} key={a.value}>{a.value}</p>  
                                    )
                                })
                            }
                        </td>
                        <td className="px-6 py-4">
                            {q.difficulty}
                        </td>
                        <td className="px-6 py-4">
                        <button onClick={() => handleDeleteQuestion(q.id_question)} className='hover:bg-red-200 rounded-2xl'>
                                <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="20" height="20" fill='red'>
                                    <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z" /><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z" />
                                    <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z" />
                                </svg>
                            </button>
                        </td>
                    </motion.tr>
                );
            })
        );
    }
    const renderHeaderQuestions = () => {
        return (
            HEAD_PROPERTYS_QUESTION.map((c) => {
                return (
                    <th key={c} scope="col" className="p-3 py-3 ">
                        {c}
                    </th>
                )
            })
        )
    };
    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        toast.promise(fetchPostCategory(name_category), {
            loading: 'Loading Operation',
            success: 'Operation Success!.',
            error: 'Operation Error!.',
        })
            .then((r) => {
                addCategorys(r.data.data);
                setCategory("")
                setModalCat(false);
            });
    };
    const handleSubmitQuestions = async (e) => {
        e.preventDefault();
        toast.promise(fetchPostQuestion(question), {
            loading: 'Loading Operation',
            success: 'Operation Success!.',
            error: 'Operation Error!.',
        })
            .then((r) => {
                addQuestions(r.data.data);
                setQuestion({
                    ...question,
                    question: "",
                    category: "",
                    type: "",
                    answer: [],
                    stage: "",
                })
                setModalQuest(false);
            });
    };
    const handleChange = (e) => {
        const property = e.target.name;
        const value = e.target.value;
        setQuestion({
            ...question,
            [property]: value
        })
    };
    const handleSetAnswer = () => {
        setQuestion(prevState => ({
            ...prevState,
            answer: [...prevState.answer, tempQuest]
        }));
        setTempQuest({
            ...tempQuest,
            value: "",
            correct: false
        });
    }
    useEffect(() => {
        fetchGetCategory(addCategorys);
    }, []) 
    useEffect(() => {
        selected ?
            setQuestion({
                ...question,
                CategoryIdCategory: selected.id_category
            }) : null; 
        selected ?fetchGetQuestions(addQuestions,selected.id_category):null;
    }, [selected])
    const renderModalCategorys = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(45,45,45,.8)]">
                <div className="bg-white w-1/2 p-4 rounded-2xl shadow">
                    <h2 className="text-xl font-bold mb-4">Create Category</h2>
                    <form onSubmit={handleSubmitCategory}>
                        <div className="relative z-0 w-full mb-6 group">
                            <input value={name_category} onChange={(e) => setCategory(e.target.value)} type="text" name="name_category" id="name_category" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="name_category" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                        </div>
                        <button type='submit' className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"  >
                            Save
                        </button>
                        <button type='button' onClick={() => setModalCat(false)} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"  >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        )
    }
    const renderModalQuestions = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(45,45,45,.8)]">
                <div className="bg-white w-1/2 p-4 rounded-2xl shadow">
                    <h2 className="text-xl font-bold mb-4">Create Questions</h2>
                    <form onSubmit={handleSubmitQuestions}>
                        <div className="relative z-0 w-full mb-6 group">
                            <input value={question.question} onChange={handleChange} type="text" name="question" id="question" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                            <label htmlFor="question" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Question</label>
                        </div>
                        <div className="flex items-center gap-2 relative z-0 w-full mb-6 group">
                            <div className='w-5/12'>
                                <input value={tempQuest.value} onChange={(e) => setTempQuest({ ...tempQuest, value: e.target.value })} type="text" name="answer" id="answer" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                                <label htmlFor="answer" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Answer</label>
                            </div>
                            <div className='w-3/12'>
                                <input id="default-checkbox" checked={tempQuest.correct} onChange={(e) => setTempQuest({ ...tempQuest, correct: e.target.checked })} type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Correct Answer</label>
                            </div>
                            <div className='w-4-12'>
                                <button onClick={handleSetAnswer} type='button' className="flex items-center gap-2 justify-center  text-white rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"  >
                                    {"Answer "}
                                    <svg id="Layer_1" height="20" viewBox="0 0 24 24" width="20" fill='white' xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex relative gap-2 z-0 w-full mb-6 group overflow-x-auto">
                            {
                                question.answer && question.answer.map((q) => {
                                    return (
                                        <div
                                            key={q.value}
                                            className={`m-w-3/5   p-1 rounded shadow ${q.correct ? 'bg-green-200' : 'bg-red-200'}`}
                                        >
                                            {q.value}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="relative z-0 w-4/12 mb-6 group">
                            <label htmlFor="difficulty" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Difficulty</label>
                            <select
                                id='difficulty'
                                name="difficulty"
                                onChange={handleChange}
                                value={question.difficulty}
                                className="block w-full mt-1 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div> 
                        <button type='submit' className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"  >
                            Save
                        </button>
                        <button type='button' onClick={() => setModalQuest(false)} className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"  >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        )
    }
    return (
        <div className='grid grid-cols-1 grid-rows-4 gap-4 p-4 h-screen gradient-blue w-full'>
            <div className=' flex p-4 col-span-1 rounded-2xl w-full h-full gap-2'>
                <Bar context={"dashboard"} ></Bar>
            </div>
            <div className=' flex row-span-3 rounded-2xl w-full h-[65vh] gap-2'>
                <div className="w-1/2 ">
                    <div className='flex justify-between'>
                        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-2xl dark:text-white">Table
                            <span className="text-blue-600 dark:text-blue-500"> Category </span>
                        </h1>
                        <button onClick={() => setModalCat(true)} type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2">
                            <svg id="Layer_1" fill='white' height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
                                <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" />
                            </svg>
                        </button>
                    </div>
                    <div className="relative overflow-x-auto h-full">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                            <thead className="text-xs text-gray-700 uppercase  bg-white border-b-2">
                                <tr>
                                    {
                                        renderHeaderCategorys()
                                    }
                                </tr>
                            </thead>
                            <tbody className='overflow-y-auto'>
                                <AnimatePresence >
                                    {categorys && renderBodyCategory()}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="w-1/2 pb-10">
                    <div className='flex justify-between'>
                        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-2xl dark:text-white">Category
                            <span className="text-blue-600 dark:text-blue-500"> {catSelect ? catSelect.name_category : ""}</span> Questions.
                        </h1>
                        <button disabled={!catSelect} onClick={() => setModalQuest(true)} type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2">
                            <svg id="Layer_1" fill='white' height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1">
                                <path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z" />
                            </svg>
                        </button>
                    </div>  
                    <div className="relative overflow-x-auto h-full">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase  bg-white ">
                                <tr>
                                    {
                                        renderHeaderQuestions()
                                    }
                                </tr>
                            </thead>
                            <tbody className='overflow-y-auto'>
                                <AnimatePresence >
                                    {
                                        questions && renderBodyQuestions()
                                    }
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
            {
                //saco mi modal category
                modalCat ? renderModalCategorys() : null
            }
            {
                //saco mi modal questions
                modalQuest ? renderModalQuestions() : null
            }
        </div>
    );
}

export default DashboardPage;

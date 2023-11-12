import { createContext, useState } from "react";
import One from "../assets/ONE.avif"
export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [gameInProgress, setGameInProgress] = useState(false);
    const [questions,setQuestions]=useState([]);//mis estado big
    const [categorys,setCategorys]=useState([]);//mis estado big
    const [gameSelected, setGameSelected] = useState(null); 
    const [catSelect,setCatSelect]=useState(null);
    const [menu, setMenu] = useState(false);
    const [data, setData] = useState(
        [
            {
                id: 1,
                name: "Quizz",
                description: "Logic Master",
                image: One
            },
            {
                id: 2,
                name: "Ajedrez",
                description: "Logic Master",
                image: One
            }
        ]
    );
    const selected = (id) => {
        const game = data.find((ob) => ob.id == id); //FILTRAR JUEGO Y RETORNO
        setGameSelected(game);
        return game;
    };
    const addCategorys=(data)=>{
        setCategorys(data);
    }
    const addQuestions=(data)=>{
        setQuestions(data);
    }
    const addGameProgress = (state) => {
        setGameInProgress(state); //TRUE
    }; 
    const addOpenMenu = () => {
        setMenu(!menu);
    };
    const addCatSet = (obj) => {
        setCatSelect(obj);
    };
    const addCloseMenu = () => {
        setMenu(false);
    };
    const STATES_MODIFIC={ 
        data, selected, addGameProgress,gameInProgress, gameSelected,
         addOpenMenu, menu,addCloseMenu,categorys,addCategorys,questions,
         addQuestions,catSelect, addCatSet};
    return (
        <DataContext.Provider value={STATES_MODIFIC}>
            {children}
        </DataContext.Provider>
    );
}
export default DataContext;
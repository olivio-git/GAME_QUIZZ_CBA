import { createContext, useState } from "react";
import One from "../assets/ONE.avif"
export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [gameInProgress, setGameInProgress] = useState(false);
    const [gameSelected, setGameSelected] = useState(null); 
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
        const game = data.find((ob) => ob.id == id);
        return game;
    };
    const addGameProgress = (state) => {
        setGameInProgress(state)
    }; 
    const addOpenMenu = () => {
        setMenu(!menu);
    };
    const addCloseMenu = () => {
        setMenu(false);
    };
    return (
        <DataContext.Provider value={{ data, selected, addGameProgress,gameInProgress, gameSelected, addOpenMenu, menu,addCloseMenu }}>
            {children}
        </DataContext.Provider>
    );
}
export default DataContext;
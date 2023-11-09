import { createContext, useState } from "react";
import One from "../assets/ONE.avif"
export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [gameInProgress, setGameInProgress] = useState(null);
    const [gameSelected, setGameSelected] = useState(null);
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
    const addSelected = (obj) => {
        setGameInProgress()
    };
    return (
        <DataContext.Provider value={{ data, selected, addSelected, gameSelected }}>
            {children}
        </DataContext.Provider>
    );
}
export default DataContext;
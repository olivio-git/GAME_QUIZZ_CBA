import { createContext, useState } from "react";
import { IMAGE_CLOUDFRONT_QUIZZ } from "../utils/emvironments";
export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [gameCreator, setGame] = useState({
    name: "",
    players: [],
  });
  const [gameContext, setGameContext] = useState(null);
  //states game start
  const [dataQuestions, setDataQuestions] = useState(null);
  //dataGameQuestions
  const [gameQuestions, setGameQuestions] = useState(null);
  //history
  const [stateModalHistory, setStateModalHistory] = useState(false);

  const [gameInProgress, setGameInProgress] = useState(false); //para saber si mostrar partida o boton
  const [questions, setQuestions] = useState([]); //mis estado big
  const [categorys, setCategorys] = useState([]); //mis estado big
  const [gameSelected, setGameSelected] = useState(null);
  const [catSelect, setCatSelect] = useState(null);
  const [menu, setMenu] = useState(false);
  const [data, setData] = useState([
    {
      id: 1,
      name: "MASTER MIND",
      description: "Jeopardy",
      image: IMAGE_CLOUDFRONT_QUIZZ,
    },
  ]);
  const addGameQuestions = (obj) => {
    setGameQuestions(obj);
  };
  const selected = (id) => {
    const game = data.find((ob) => ob.id == id); //FILTRAR JUEGO Y RETORNO
    setGameSelected(game);
    return game;
  };
  const addCategorys = (data) => {
    setCategorys(data);
  };
  const addQuestions = (data) => {
    setQuestions(data);
  };
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
  const addGameName = (name) => {
    setGame({
      ...gameCreator,
      name: name,
    });
  };
  const addGamePlayers = (name) => {
    setGame((prevState) => ({
      ...prevState,
      players: [...prevState.players, name],
    }));
  };

  const restartGameCreator = () => {
    setGame({
      ...gameCreator,
      name: "",
      players: [],
    });
  };
  const addGameContext = (obj) => {
    setGameContext(obj);
  };
  const addDataQuestions = (data) => {
    setDataQuestions(data);
  };
  const STATES_MODIFIC = {
    data,
    selected,
    addGameProgress,
    gameInProgress,
    gameSelected,
    addOpenMenu,
    menu,
    addCloseMenu,
    categorys,
    addCategorys,
    questions,
    addQuestions,
    catSelect,
    addCatSet,
    addGameName,
    addGamePlayers,
    gameCreator,
    restartGameCreator,
    addGameContext,
    gameContext,
    dataQuestions,
    addDataQuestions,
    addGameQuestions,
    gameQuestions,
    stateModalHistory,
    setStateModalHistory,
  };
  return (
    <DataContext.Provider value={STATES_MODIFIC}>
      {children}
    </DataContext.Provider>
  );
};
export default DataContext;

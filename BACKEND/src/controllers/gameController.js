const { Game, Player, Question } = require("../db");
const { response } = require("../utils/");

// Agrega un nuevo juego a la base de datos
const addGame = async (req, res) => {
  console.log(req.body);
  const { name, players } = req.body;

  if (!name || !Array.isArray(players) || players.length === 0) {
    return response(res, 400, { message: "Invalid input data" });
  }

  try {
    const game = await Game.create({ name });
    const playersContext = await Promise.all(
      players.map(async (player) => {
        const newPlayer = await Player.create({ name_player: player });
        await game.addPlayer(newPlayer.id_player);
        return newPlayer;
      })
    );

    const obj = { game, players: playersContext };
    response(res, 200, obj);
  } catch (error) {
    response(res, 500, { message: "Error adding game", error });
  }
};

// Guarda las preguntas del juego
const addGameSaveQuestions = async (req, res) => {
  const { idGame, idQuestions, top } = req.body;

  if (!idGame || !Array.isArray(idQuestions) || idQuestions.length === 0) {
    return response(res, 400, { message: "Invalid input data" });
  }

  try {
    const game = await Game.findByPk(idGame);
    
    if (!game) {
      return response(res, 404, { message: "Game not found" });
    }

    await game.update({ winners: top });

    const idsQuest = idQuestions.map((q) => q.id_question);
    await Promise.all(idsQuest.map(async (id) => game.addQuestion(id)));

    response(res, 200, game);
  } catch (error) {
    response(res, 500, { message: "Error saving questions", error });
  }
};

// Obtiene todos los juegos con preguntas
const getAllGamesWithQuestions = async (req, res) => {
  try {
    const games = await Game.findAll();
    const filteredGames = games.filter((g) => g.winners !== null);

    response(res, 200, filteredGames);
  } catch (error) {
    response(res, 500, { message: "Error retrieving games", error });
  }
};

module.exports = {
  addGame,
  addGameSaveQuestions,
  getAllGamesWithQuestions,
};

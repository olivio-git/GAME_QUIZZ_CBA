const { Game, Player, Question } = require("../db");
const { response } = require("../utils/");
const addGame = async (req, res) => {
  console.log(req.body);
  const { name, players } = req.body;
  let idsPlayer = [];
  let result = [];
  let playersContext = [];
  const game = await Game.create({ name });

  for (let player of players) {
    const newPlayer = await Player.create({ name_player: player });
    playersContext.push(newPlayer);
    idsPlayer.push(newPlayer.id_player);
  }
  for (let ids of idsPlayer) {
    const relations = await game.addPlayer(ids);
    result.push(relations);
  }
  const obj = { game: game, players: playersContext };
  response(res, 200, obj);
};
const addGameSaveQuestions = async (req, res) => {
  const { idGame, idQuestions,top } = req.body;

  let idsQuest = [];
  let result = [];
  for(let q of idQuestions){
    idsQuest.push(q.id_question);
  };
  const game = await Game.findByPk(idGame);
  await game.update({ winners: top });
  for(let id of idsQuest){
    const relations = await game.addQuestion(id);
    result.push(relations);
  };
  response(res, 200, game);
};
const getAllGamesWithQuestions = async (req, res) => {
    let filter = [];
  const games = await Game.findAll();
  for(let g of games ){
    if(g.winners!=null)filter.push(g);
  }
  console.log(filter);
  response(res, 200, filter);
};
module.exports = {
  addGame,
  addGameSaveQuestions,
  getAllGamesWithQuestions,
};

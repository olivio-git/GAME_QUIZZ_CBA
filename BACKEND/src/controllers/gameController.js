const { Game, Player } = require('../db');
const { response } = require('../utils/');
const addGame = async (req, res) => {
    console.log(req.body)
    const { name, players } = req.body;
    let idsPlayer = [];
    let result = [];
    const game = await Game.create({ name });

    for (let player of players) {
        const newPlayer = await Player.create({ name_player: player });
        idsPlayer.push(newPlayer.id_player);
    };
    for (let ids of idsPlayer) {
        const relations = await game.addPlayer(ids);
        result.push(relations);
    }
    response(res, 200, result);
}

module.exports = {
    addGame
}
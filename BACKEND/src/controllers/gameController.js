const { Game, Player } = require('../db');
const { response } = require('../utils/');
const addGame = async (req, res) => {
    console.log(req.body)
    const { name, players } = req.body;
    let idsPlayer = [];
    let result = [];
    let playersContext = [];
    const game = await Game.create({ name });

    for (let player of players) {
        const newPlayer = await Player.create({ name_player: player });
        playersContext.push(newPlayer);
        idsPlayer.push(newPlayer.id_player);
    };
    for (let ids of idsPlayer) {
        const relations = await game.addPlayer(ids);
        result.push(relations);
    }
    const obj={game:game,players:playersContext}
    response(res, 200, obj);
}

module.exports = {
    addGame
}
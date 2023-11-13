const { Player } = require('../db');
const { response } = require('../utils/');
const addPlayer = async () => {
    const player = req.body;
    const result = await Player.create(player);
    response(res, 200, result);
}

module.exports = {
    addPlayer
}
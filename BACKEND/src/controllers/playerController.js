const { Player } = require('../db');
const { response } = require('../utils/');

// Agrega un nuevo jugador a la base de datos
const addPlayer = async (req, res) => {
  const player = req.body;

  if (!player || !player.name_player) {
    return response(res, 400, { message: "Invalid player data" });
  }

  try {
    const result = await Player.create(player);
    response(res, 200, result);
  } catch (error) {
    response(res, 500, { message: "Error adding player", error });
  }
};

module.exports = {
  addPlayer,
};

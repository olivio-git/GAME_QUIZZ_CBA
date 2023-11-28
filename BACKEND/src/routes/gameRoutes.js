const express = require('express');
const { addGame, addGameSaveQuestions, getAllGamesWithQuestions } = require('../controllers/gameController');
const { catchedAsync } = require('../utils');

const router = express();

router.post('/', catchedAsync(addGame));
router.post("/save/end", catchedAsync(addGameSaveQuestions));
router.get("/questions", catchedAsync(getAllGamesWithQuestions));
module.exports = router;
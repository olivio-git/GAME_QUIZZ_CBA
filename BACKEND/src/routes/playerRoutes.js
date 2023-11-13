const express = require('express');
const { addPlayer } = require('../controllers/playerController');
const { catchedAsync } = require('../utils/catchedAsync');

const router = express();

router.post('/', catchedAsync(addPlayer));

module.exports = router;
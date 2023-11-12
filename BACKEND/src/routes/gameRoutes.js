const express =require('express');
const { addGame } = require('../controllers/gameController');
const { catchedAsync } = require('../utils');

const router=express();

router.post('/',catchedAsync(addGame));

module.exports=router;
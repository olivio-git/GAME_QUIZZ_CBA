const {Game}=require('../db');
const { response }=require('../utils/');
const addGame = async(req,res) => {
    const game=req.body;
    const result=await Game.create(game);
    response(res,200,result);
}

module.exports={
    addGame
}
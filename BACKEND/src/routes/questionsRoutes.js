const express = require('express');
const {
  getAllQuestions,
  deleteQuestion,
  addQuestion,
  getAllQuestionsById,
  findAllQuestionsAsId,
} = require("../controllers/questionsController");
const { catchedAsync } = require('../utils');
const router = express();
router.get('/', catchedAsync(getAllQuestions));
router.get('/byid/:id', catchedAsync(getAllQuestionsById));
router.delete('/:id', catchedAsync(deleteQuestion));
router.post('/', catchedAsync(addQuestion));
router.get("/as", catchedAsync(findAllQuestionsAsId));
module.exports = router;
const express = require('express');
const {
  getAllQuestions,
  deleteQuestion,
  addQuestion,
  getAllQuestionsById,
  findAllQuestionsAsId,
  deleteQuestionID
} = require("../controllers/questionsController");
const { catchedAsync } = require('../utils');
const router = express();
router.get('/', catchedAsync(getAllQuestions));
router.get('/byid/:id', catchedAsync(getAllQuestionsById));
router.delete('/:id', catchedAsync(deleteQuestion));
router.delete('/X/:id', catchedAsync(deleteQuestionID));
router.post('/', catchedAsync(addQuestion));
router.get("/as", catchedAsync(findAllQuestionsAsId));
module.exports = router;
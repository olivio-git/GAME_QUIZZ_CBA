const express = require('express');
const { getAllQuestions, deleteQuestion, addQuestion, getAllQuestionsById } = require('../controllers/questionsController');
const { catchedAsync } = require('../utils');
const router = express();
router.get('/', catchedAsync(getAllQuestions));
router.get('/byid/:id', catchedAsync(getAllQuestionsById));
router.delete('/:id', catchedAsync(deleteQuestion));
router.post('/', catchedAsync(addQuestion));
module.exports = router;
const express = require('express');
const {
  getAllQuestions,
  deleteQuestion,
  addQuestion,
  getAllQuestionsById,
  findAllQuestionsAsId,
  uploadFile
} = require("../controllers/questionsController");
const { catchedAsync } = require('../utils');
const router = express();
const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', catchedAsync(getAllQuestions));
router.get('/byid/:id', catchedAsync(getAllQuestionsById));
router.delete('/:id', catchedAsync(deleteQuestion));
router.post('/', catchedAsync(addQuestion));
router.get("/as", catchedAsync(findAllQuestionsAsId));

router.post('/upload',upload.single('file') , catchedAsync(uploadFile));

module.exports = router;
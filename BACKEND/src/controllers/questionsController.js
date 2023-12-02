const { Question, Category } = require("../db");
const { response } = require('../utils');

// const addQuestion = async (req, res) => {
//     const question = req.body;
//     await Question.create(question)
//     const result = await Question.findAll({ where: { CategoryIdCategory: question.CategoryIdCategory } });
//     response(res, 200, result);
// };

const addQuestion = async (req, res) => {
  const questions = req.body;
  await Promise.all(
    questions.map(async (question) => {
      await Question.create(question);
    })
  );
  const result = await Question.findAll({
    where: { CategoryIdCategory: questions[0].CategoryIdCategory },
  });

  response(res, 200, result);
};
const deleteQuestion = async (req, res) => {
  const id = req.params.id;
  const iduser = req.query.iduser;
  const question = await Question.findByPk(id);
  await question.destroy();
  const result = await Question.findAll({ where: { CategoryIdCategory: iduser } });
  response(res, 200, result);
};

const deleteQuestionID = async (req, res) => {
  try {
    const id = req.params.id;
    const question = await Question.findByPk(id);

    if (!question) {
      return response(res, 404, { message: 'Question not found' });
    }

    await question.destroy();
    response(res, 200, { message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    response(res, 500, { message: 'Internal Server Error' });
  }
     const id = req.params.id;
     const question = await Question.findByPk(id);
     await question.destroy();
     const result = await Question.findAll();
     response(res, 200, result);
};
const getAllQuestions = async (req, res) => {
  const result = await findAllQuestions();
  response(res, 200, result);
};
const getAllQuestionsById = async (req, res) => {
  const id = req.params.id;
  const result = await Question.findAll({ where: { CategoryIdCategory: id } });
  response(res, 200, result);
};
const findAllQuestions = async () => {
  const result = await Question.findAll();
  return result;
};
const findAllQuestionsAsId = async (req, res) => {

  const result = await Question.findAll({
    include: [
      {
        model: Category,
        as: "Category",
        attributes: ["id_category"],
      },
    ],
  });
  response(res, 200, result);

}
module.exports = {
  addQuestion,
  deleteQuestion,
  getAllQuestions,
  getAllQuestionsById,
  findAllQuestionsAsId,
  deleteQuestionID
};
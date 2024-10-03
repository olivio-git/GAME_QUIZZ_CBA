const { Question, Category } = require("../db");
const { response } = require('../utils');

// Agrega una o más preguntas a la base de datos
const addQuestion = async (req, res) => {
  const questions = req.body;

  try {
    await Promise.all(
      questions.map(async (question) => {
        await Question.create(question);
      })
    );
    const result = await Question.findAll({
      where: { CategoryIdCategory: questions[0].CategoryIdCategory },
    });
    response(res, 200, result);
  } catch (error) {
    response(res, 500, { message: "Error adding questions", error });
  }
};

// Elimina una pregunta de la base de datos por ID
const deleteQuestion = async (req, res) => {
  const id = req.params.id;
  const question = await Question.findByPk(id);

  if (!question) {
    return response(res, 404, { message: "Question not found" });
  }

  await question.destroy();
  const result = await Question.findAll();
  response(res, 200, result);
};

// Obtiene todas las preguntas de la base de datos
const getAllQuestions = async (req, res) => {
  try {
    const result = await findAllQuestions();
    response(res, 200, result);
  } catch (error) {
    response(res, 500, { message: "Error retrieving questions", error });
  }
};

// Obtiene todas las preguntas de una categoría específica por ID
const getAllQuestionsById = async (req, res) => {
  const id = req.params.id;
  const result = await Question.findAll({ where: { CategoryIdCategory: id } });

  if (result.length === 0) {
    return response(res, 404, { message: "No questions found for this category" });
  }

  response(res, 200, result);
};

// Función auxiliar para encontrar todas las preguntas
const findAllQuestions = async () => {
  const result = await Question.findAll();
  return result;
};

// Obtiene todas las preguntas junto con sus categorías
const findAllQuestionsAsId = async (req, res) => {
  try {
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
  } catch (error) {
    response(res, 500, { message: "Error retrieving questions", error });
  }
};

module.exports = {
  addQuestion,
  deleteQuestion,
  getAllQuestions,
  getAllQuestionsById,
  findAllQuestionsAsId,
};

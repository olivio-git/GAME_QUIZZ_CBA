const { Question, Category } = require("../db");
const { response  } = require('../utils');
const xlsx = require("xlsx");
const fs = require("fs");
// const addQuestion = async (req, res) => {
//     const question = req.body;
//     await Question.create(question)
//     const result = await Question.findAll({ where: { CategoryIdCategory: question.CategoryIdCategory } });
//     response(res, 200, result);
// };

  
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

const uploadFile = async (req, res) => {
  try {
    const isValidXlsx = req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isValidXlsx) {
      return res.status(400).json({ error: 'Solo se permiten archivos XLSX' });
    }

    const workbook = xlsx.readFile(req.file.path, {type:"buffer", cellDates: true});
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = await xlsx.utils.sheet_to_json(sheet); 

    let c

    const category = data[0].Category; 
    let cat = await Category.findOne({ where: { name_category: category } });
    if (!cat) {
      cat = await Category.create({ name_category: category });
    }

    const promises = data.map(async (question) => {
      if (!question.Question) {
        return;
      }
      const answers = [];
      const correct = question[question.CorrectAnswer];

      question.CategoryIdCategory = cat.id_category;
      question.question = question.Question;
      question.answers = [];
      answers.push(question.A, question.B, question.C, question.D);
      answers.forEach((answer, index) => {
        if (answer) {
          question.answers.push({
            value: answer,
            correct: answer === correct ? true : false
          });
        }
      }); 
      const find = await Question.findOne({ where: { question: question.question } });
      if (!find) {
        await Question.create({
          question: question.question,
          answer: question.answers,
          CategoryIdCategory: question.CategoryIdCategory,
          type: "",
          difficulty: "",
          stage: "",
          category: ""
        });
      }
    });

    await Promise.all(promises); 
    const result = await Question.findAll();  
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Error al eliminar el archivo:', err);
        return;
      }
    });
    response(res, 200, {message:"Archivo cargado correctamente", data: result});
  } catch (error) {
    console.error('Error al cargar el archivo:', error);
    response(res, 500, { error: 'Ocurrió un error al cargar el archivo' });
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
  uploadFile
};

const { Category } = require('../db');
const { response } = require('../utils');

// Agrega una nueva categoría a la base de datos
const addCategory = async (req, res) => {
  const category = req.body;

  try {
    await Category.create(category);
    const fnFindAll = await findAllCategory();
    response(res, 200, fnFindAll);
  } catch (error) {
    response(res, 500, { message: "Error adding category", error });
  }
};

// Obtiene todas las categorías de la base de datos
const getAllCategory = async (req, res) => {
  try {
    const result = await findAllCategory();
    response(res, 200, result);
  } catch (error) {
    response(res, 500, { message: "Error retrieving categories", error });
  }
};

// Elimina una categoría de la base de datos por ID
const deleteCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Category.findByPk(id);
    
    if (!result) {
      return response(res, 404, { message: "Category not found" });
    }

    await result.destroy();
    const results = await findAllCategory();
    response(res, 200, results);
  } catch (error) {
    response(res, 500, { message: "Error deleting category", error });
  }
};

// Función auxiliar para encontrar todas las categorías
const findAllCategory = async () => {
  const returnAllCategorys = await Category.findAll();
  return returnAllCategorys;
};

module.exports = {
  addCategory,
  getAllCategory,
  deleteCategory,
};

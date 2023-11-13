const express = require('express');
const { addCategory, getAllCategory, deleteCategory } = require('../controllers/categoryController');
const { catchedAsync } = require('../utils');

const router = express();

router.get('/', catchedAsync(getAllCategory));
router.post('/', catchedAsync(addCategory));
router.delete('/:id', catchedAsync(deleteCategory));


module.exports = router;
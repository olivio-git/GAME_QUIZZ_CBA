const { Router } = require('express');
const router = Router();
const categoryRoutes = require('./categoryRoutes');
const questionRoutes = require('./questionsRoutes');
const gameRoutes = require('./gameRoutes');

router.use('/category', categoryRoutes);
router.use('/questions', questionRoutes);
router.use('/game', gameRoutes);

module.exports = router;
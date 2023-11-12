const {Router}= require('express'); 
const router = Router();
const categoryRoutes=require('./categoryRoutes');
const qustionRoutes=require('./questionsRoutes');

router.use('/category',categoryRoutes);
router.use('/questions',qustionRoutes);

module.exports = router;
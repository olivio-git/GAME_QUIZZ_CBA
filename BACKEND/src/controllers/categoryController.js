const { Category }= require('../db');
const {response}=require('../utils')

const addCategory=async(req,res)=>{
    const category=req.body;
    await Category.create(category);
    const fnFindAll=await findAllCategory();
    response(res,200,fnFindAll);
};
const getAllCategory=async(req,res)=>{
    const result=await findAllCategory();
    response(res,200,result);
}
const deleteCategory=async (req,res) => {
    const id=req.params.id;
    const result=await Category.findByPk(id);
    await result.destroy();
    const results=await findAllCategory();
    response(res,200,results);
}
const findAllCategory=async () => {
    const returnAllCategorys=await Category.findAll();
    return returnAllCategorys;
}
module.exports={
    addCategory,
    getAllCategory,
    deleteCategory
}
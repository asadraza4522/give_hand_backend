const express = require('express')
const router = express.Router();
const CategoriesController = require('../controller/CategoriesController')
const { ValidateToken } = require('../controller/AuthController')
const uploadImg = require('../middleware/uploadImg')


router.post('/api/category/addCategory', ValidateToken,uploadImg.single('image'), CategoriesController.addCategories)

router.get('/api/category/viewCategory', ValidateToken, CategoriesController.viewCategories)

router.post('/api/category/delete', ValidateToken, CategoriesController.delCategory)

router.post('/api/category/edit', ValidateToken, CategoriesController.EditCategory)


module.exports = router;
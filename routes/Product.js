const express = require('express')
const router = express.Router();
const ProductController = require('../controller/ProductController')
const { ValidateToken } = require('../controller/AuthController')
const uploadImg = require('../middleware/uploadImg')



router.post('/api/product/createProduct', ValidateToken, uploadImg.single('image'), ProductController.createProduct)

router.post('/api/product/edit', ValidateToken, uploadImg.single('image'), ProductController.EditProduct)

router.get('/api/product/viewProducts', ValidateToken, ProductController.viewProducts)

router.post('/api/product/delete', ValidateToken, ProductController.delProduct)

router.get('/api/product/:id', ValidateToken, ProductController.singleProduct)

router.get('/api/product/search/:search', ValidateToken, ProductController.liveSearch)



module.exports = router;
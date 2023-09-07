const express = require('express')
const router = express.Router();
const BrandController = require('../controller/BrandsController')
const { ValidateToken } = require('../controller/AuthController')


router.post('/api/brand/addBrand', ValidateToken, BrandController.addBrands)

router.get('/api/brand/viewBrand', ValidateToken, BrandController.viewBrands)

router.post('/api/brand/delete', ValidateToken, BrandController.delBrand)

router.post('/api/brand/edit', ValidateToken, BrandController.EditBrand)


module.exports = router;
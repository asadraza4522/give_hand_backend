const express = require('express')
const router = express.Router();
const AuthController = require('../controller/AuthController')
const uploadImg = require('../middleware/uploadImg')

router.post('/api/register', AuthController.createrUser)

router.post('/api/login', AuthController.loginUser)

router.get('/api/checkToken', AuthController.ValidateToken,AuthController.okResponse)

router.get('/api/viewUsers', AuthController.ValidateToken, AuthController.viewUsers)

router.get('/api/users/:id', AuthController.ValidateToken, AuthController.showUser)

router.post('/api/users/update', AuthController.ValidateToken, AuthController.updateUser)

router.post('/api/users/UploadImage', AuthController.ValidateToken, uploadImg.single('image') , AuthController.editUserImg)



module.exports = router;
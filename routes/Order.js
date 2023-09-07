const express = require('express')
const router = express.Router();
const OrderController = require('../controller/OrderController')
const { ValidateToken } = require('../controller/AuthController')

router.get('/api/order/:user', ValidateToken, OrderController.viewOrders)

router.post('/api/order/addOrder', ValidateToken, OrderController.createUserOrder)

router.post('/api/order/update', ValidateToken, OrderController.updateOrderStatus)

module.exports = router;
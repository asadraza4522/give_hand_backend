const express = require('express')
const router = express.Router();
const AdminController = require('../controller/AdminController')
const AuthController = require('../controller/AuthController')

router.get('/api/dashboard/statistics', AuthController.ValidateToken, AdminController.dashboardStatistics)


module.exports = router;
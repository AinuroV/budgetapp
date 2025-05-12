const express = require('express')
const router = express.Router()
const categoryLimitController = require('../controllers/categoryLimitController')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/budget/limits - Получение всех лимитов категорий
router.get('/limits', authMiddleware, categoryLimitController.getAll)

// POST /api/budget/limits - Установка/обновление лимита категории
router.post('/limits',authMiddleware,categoryLimitController.set)

module.exports = router
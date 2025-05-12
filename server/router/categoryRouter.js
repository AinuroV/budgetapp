const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/categories - Получение всех категорий пользователя
router.get('/categories', authMiddleware, categoryController.getAll)

// POST /api/categories/add - Создание новой категории
router.post('/categories/add',authMiddleware,categoryController.create)

// POST /api/categories/update - Обновление категории
router.post('/categories/update',authMiddleware,categoryController.update)

// POST /api/categories/delete - Удаление категории
router.post('/categories/delete',authMiddleware,categoryController.delete)

module.exports = router
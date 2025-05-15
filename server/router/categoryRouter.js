const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/CategoryControllers')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/categories - Получение всех категорий пользователя
router.get('/', authMiddleware, categoryController.getAll)

// POST /api/categories/add - Создание новой категории
router.post('/add',authMiddleware,categoryController.create)

// POST /api/categories/update - Обновление категории
router.post('/update',authMiddleware,categoryController.update)

// POST /api/categories/delete - Удаление категории
router.post('/delete',authMiddleware,categoryController.delete)

module.exports = router
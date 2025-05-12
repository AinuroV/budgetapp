const express = require('express')
const router = express.Router()
const goalController = require('../controllers/goalController')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/goals - Получение всех целей пользователя
router.get('/', authMiddleware, goalController.getAll)

// POST /api/goals/add - Создание новой цели
router.post('/add',authMiddleware,goalController.create)

// POST /api/goals/update - Обновление цели
router.post('/update',authMiddleware,goalController.update)

// POST /api/goals/delete - Удаление цели
router.post('/delete',authMiddleware,goalController.delete)

// POST /api/goals/add-money - Добавление денег к цели
router.post('/add-money',authMiddleware,goalController.addMoney)

module.exports = router
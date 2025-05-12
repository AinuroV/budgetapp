const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/transactions - Получение транзакций
router.get('/transactions',authMiddleware,transactionController.getAll)

// POST /api/transactions/add - Создание транзакции
router.post('/transactions/add',authMiddleware,transactionController.create)

// POST /api/transactions/update - Обновление транзакции
router.post('/transactions/update',authMiddleware,transactionController.update)

// POST /api/transactions/delete - Удаление транзакции
router.post('/transactions/delete',authMiddleware,transactionController.delete)

module.exports = router
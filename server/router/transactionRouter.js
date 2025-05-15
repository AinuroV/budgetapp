const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/transactions - Получение транзакций
router.get('/',authMiddleware,transactionController.getAll)

// POST /api/transactions/add - Создание транзакции
router.post('/add',authMiddleware,transactionController.create)

// POST /api/transactions/update - Обновление транзакции
router.post('/update',authMiddleware,transactionController.update)

// POST /api/transactions/delete - Удаление транзакции
router.post('/delete',authMiddleware,transactionController.delete)

module.exports = router
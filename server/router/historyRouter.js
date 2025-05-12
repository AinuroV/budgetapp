const express = require('express')
const router = express.Router()
const historyController = require('../controllers/historyController')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/history - Получение истории действий
router.get('/',authMiddleware,historyController.getAll)

// POST /api/history/add - Добавление записи в историю
router.post('/add',authMiddleware,historyController.add)

// POST /api/history/undo - Отмена действия
router.post('/undo',authMiddleware,historyController.undo)

module.exports = router
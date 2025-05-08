// routes/goals.js
const express = require('express');
const router = express.Router();
const FinancialGoalController = require('../controllers/fincialGoal');
const authMiddleware = require('../middleware/authMiddleware'); // Ваш middleware для проверки токена/сессии

// Создать новую цель
router.post('/goals', authMiddleware, FinancialGoalController.create);

// Получить все цели пользователя
router.get('/goals', authMiddleware, FinancialGoalController.getAll);

// Обновить цель по ID
router.put('/goals/:id', authMiddleware, FinancialGoalController.update);

// Удалить цель по ID
router.delete('/goals/:id', authMiddleware, FinancialGoalController.delete);

module.exports = router;

const express = require('express')
const router = express.Router()
const authRouter = require('./authRouter')
const categoryRouter = require('./categoryRouter')
const transactionRouter = require('./transactionRouter')
const authMiddleware = require('../middleware/authMiddleware')
const budgetRouter = require('./budgetRouter')
const goalsRoutes = require('./financialGoalRouter');

router.use('/api', goalsRoutes);
router.use('/category',authMiddleware, categoryRouter)
router.use('/transaction', authMiddleware, transactionRouter )
router.use('/auth', authRouter)
router.use('/budget', budgetRouter)
module.exports = router
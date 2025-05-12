const express = require('express')
const router = express.Router()
const authRouter = require('./authRouter')
const budgetRouter = require('./budgetRouter')
const categoryLimitRouter = require('./categoryLimitRouter')
const categoryRouter = require('./categoryRouter')
const goalRouter = require('./goalRouter')
const historyRouter = require('./historyRouter')
const transactionRouter = require('./transactionRouter')

router.use('/auth', authRouter)
router.use('/budget', budgetRouter)
router.use('/budget', categoryLimitRouter)
router.use('/category', categoryRouter)
router.use('/goals', goalRouter)
router.use('/history', historyRouter)
router.use('/transaction', transactionRouter)

module.exports = router
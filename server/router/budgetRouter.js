const express = require('express')
const router = express.Router()
const budgetController = require('../controllers/budgetController')
const authMiddleware = require('../middleware/authMiddleware')

// GET /api/budget
router.get('/', authMiddleware, budgetController.get)
// POST /api/budget
router.post('/',authMiddleware,budgetController.set)

module.exports = router
const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware')


router.get('/',authMiddleware, budgetController.get)
router.post('/',authMiddleware, budgetController.create)


module.exports = router;
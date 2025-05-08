const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/CategoryControllers')
const authMiddleware = require('../middleware/authMiddleware')
router.post('/',authMiddleware , CategoryController.create)
router.get('/',authMiddleware , CategoryController.getAll)
router.put('/:id',authMiddleware , CategoryController.update)
router.delete('/:id',authMiddleware , CategoryController.delete)
router.get('/:id',authMiddleware , CategoryController.getOne)
router.get('/type/:isTypeIncome', authMiddleware, CategoryController.getAllByType)
module.exports = router

//expense
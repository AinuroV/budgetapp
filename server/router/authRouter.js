const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const authController = require('../controllers/authController')


router.post('/registration', authController.registration)
router.post('/login', authController.login)
router.delete('/user/:id', authController.deleteUser)
router.post('/logout', authController.logout)
router.get('/me', authMiddleware, authController.checkAuth) // Добавляем новый эндпоинт


module.exports = router

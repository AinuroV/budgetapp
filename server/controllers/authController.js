const { User, Token} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
require('dotenv').config()

const SECRET_KEY = process.env.SECRET_KEY 
// генерация токена
const generateAccessToken = (id) => {
    const payload = { 
        id
    }
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "30d" })
}

class AuthController { 
    
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Ошибка валидации",
                    errors: errors.array()
                })
            }

            const { username, password } = req.body

            // Проверка на существование пользователя
            const candidate = await User.findOne({ where: { username } })
            if (candidate) {
                return res.status(400).json({ 
                    message: "Пользователь с таким именем уже существует" 
                })
            }

            // Хеширование пароля
            const hashPassword = await bcrypt.hash(password, 10) 

            // Создание пользователя
            const user = await User.create({ 
                username, 
                password: hashPassword 
            })
           
            // Генерация токена
            const token = generateAccessToken(user.id)
           
            const lifeTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней

            await Token.create({
                tokenName: token,
                userId: user.id,
                lifeTime: lifeTime  
            })
            return res.status(201).json({ // 201 для успешного создания
                message: "Пользователь успешно зарегистрирован",
                token,
                userId: user.id
            })

        } catch (error) {
            console.error("Ошибка регистрации:", error)
            return res.status(500).json({ 
                message: "Внутренняя ошибка сервера",
                error: error.message 
            })
        }
    }
    
    async login(req, res) {
        try {
            const { username, password } = req.body

            // Поиск пользователя
            const user = await User.findOne({ where: { username } })
            if (!user) {
                return res.status(401).json({ 
                    message: "Неверное имя пользователя или пароль" 
                })
            }

            // Проверка пароля
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                return res.status(401).json({ 
                    message: "Неверное имя пользователя или пароль"
                })
            }

            // Генерация токена
            const token = generateAccessToken(user.id)
            const lifeTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

            await Token.create({
                tokenName: token,
                userId: user.id,
                lifeTime: lifeTime
            })

            return res.json({
                message: "Успешная авторизация",
                token,
                userId: user.id,
                username: user.username
            })

        } catch (error) {
            console.error("Ошибка авторизации:", error)
            return res.status(500).json({ 
                message: "Внутренняя ошибка сервера",
                error: error.message 
            })
        }
    }
    async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1]
            if (!token) {
                return res.status(400).json({message: "Токен не предоставлен"})
            }
    
            await Token.destroy({ where: { tokenName: token } })
            return res.json({message: "Выход выполнен успешно"})
        } catch (e) {
            return res.status(500).json({message: "Ошибка при выходе"})
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params

            // Проверка, что пользователь существует
            const user = await User.findByPk(id)
            if (!user) {
                return res.status(404).json({ 
                    message: 'Пользователь не найден' 
                })
            }

            // Удаление пользователя
            await user.destroy()

            return res.json({ 
                message: 'Пользователь успешно удален',
                deletedUserId: id
            })

        } catch (error) {
            console.error("Ошибка удаления пользователя:", error)
            return res.status(500).json({ 
                message: "Не удалось удалить пользователя",
                error: error.message 
            })
        }
    }

    async checkAuth(req, res) {
        try {
            const reqUser = req.user
            if (!reqUser) {
                return res.status(404).json({ message: "Сессия истекла" });
            }
            
            const user = await User.findOne({ where: { id: reqUser.id } })

            return res.json({
                message: 'Активная сессия',
                userId: user.id,
                username: user.username
            });
            
        } catch (error) {
            console.error("Check auth error:", error);
            return res.status(500).json({ message: "Ошибка проверки авторизации" });
        }
    }
}

module.exports = new AuthController()

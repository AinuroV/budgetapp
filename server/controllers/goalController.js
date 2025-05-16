const {Goal} = require('../models/models')
const ApiError = require('../error/ApiError')
const {validationResult} = require('express-validator')

class GoalController {
    async getAll(req, res, next) {
        try {
            const goals = await Goal.findAll({
                where: {user_id: req.user.id},
                attributes: [
                    'id', 'title', 'description', 
                    'target_amount', 'current_amount',
                    'deadline', 'completed', 'created_at'
                ],
                order: [['deadline', 'ASC']]
            })
            return res.json(goals)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()))
            }

            const {title, description, target_amount, deadline} = req.body
            const goal = await Goal.create({
                user_id: req.user.id,
                title,
                description,
                target_amount,
                deadline,
                current_amount: 0,
                completed: false
            })

            return res.json({
                id: goal.id,
                title: goal.title,
                description: goal.description,
                target_amount: goal.target_amount,
                current_amount: goal.current_amount,
                deadline: goal.deadline,
                completed: goal.completed,
                created_at: goal.createdAt
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()))
            }

            const {id, ...updateData} = req.body
            const goal = await Goal.findOne({
                where: {
                    id,
                    user_id: req.user.id
                }
            })

            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            // Обновляем только разрешенные поля
            const allowedFields = ['title', 'description', 'target_amount', 'deadline']
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    goal[field] = updateData[field]
                }
            })

            // Проверяем, выполнена ли цель
            if (goal.current_amount >= goal.target_amount) {
                goal.completed = true
            }

            await goal.save()

            return res.json({
                id: goal.id,
                title: goal.title,
                description: goal.description,
                target_amount: goal.target_amount,
                current_amount: goal.current_amount,
                deadline: goal.deadline,
                completed: goal.completed,
                created_at: goal.createdAt
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.body
            const goal = await Goal.findOne({
                where: {
                    id,
                    user_id: req.user.id
                }
            })

            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            await goal.destroy()
            return res.json({
                success: true,
                message: 'Goal deleted'
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async addMoney(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()))
            }

            const {id, amount} = req.body
            const goal = await Goal.findOne({
                where: {
                    id,
                    user_id: req.user.id
                }
            })

            if (!goal) {
                return next(ApiError.notFound('Цель не найдена'))
            }

            if (amount <= 0) {
                return next(ApiError.badRequest('Сумма должна быть положительной'))
            }

            goal.current_amount = parseFloat(goal.current_amount) + parseFloat(amount)
            
            // Проверяем, выполнена ли цель
            goal.completed = goal.current_amount >= goal.target_amount

            await goal.save()

            return res.json({
                id: goal.id,
                title: goal.title,
                description: goal.description,
                target_amount: goal.target_amount,
                current_amount: goal.current_amount,
                deadline: goal.deadline,
                completed: goal.completed,
                created_at: goal.createdAt
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new GoalController()
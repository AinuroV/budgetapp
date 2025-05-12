const {Budget} = require('../models/models')
const ApiError = require('../error/ApiError')
const {validationResult} = require('express-validator')

class BudgetController {
    async get(req, res, next) {
        try {
            const budget = await Budget.findOne({
                where: {user_id: req.user.id},
                attributes: ['amount', 'updated_at']
            })

            if (!budget) {
                return next(ApiError.notFound('Бюджет не найден'))
            }

            return res.json({
                amount: budget.amount,
                updated_at: budget.updatedAt
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async set(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()))
            }

            const {amount} = req.body
            const userId = req.user.id

            let budget = await Budget.findOne({where: {user_id: userId}})

            if (budget) {
                budget.amount = amount
                await budget.save()
            } else {
                budget = await Budget.create({user_id: userId, amount})
            }

            return res.json({
                amount: budget.amount,
                updated_at: budget.updatedAt
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new BudgetController()
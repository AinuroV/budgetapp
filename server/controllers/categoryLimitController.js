const {CategoryLimit, Category} = require('../models/models')
const ApiError = require('../error/ApiError')
const {validationResult} = require('express-validator')

class CategoryLimitController {
    async getAll(req, res, next) {
        try {
            const limits = await CategoryLimit.findAll({
                where: {user_id: req.user.id},
                include: [{
                    model: Category,
                    attributes: ['id']
                }],
                attributes: ['category_id', 'limit_amount']
            })

            // Форматируем ответ в нужный формат { "1": 15000.00, "2": 10000.00 }
            const formattedLimits = {}
            limits.forEach(limit => {
                formattedLimits[limit.category_id] = limit.limit_amount
            })

            return res.json(formattedLimits)
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

            const {categoryId, limit} = req.body
            const userId = req.user.id

            // Проверяем, существует ли категория у пользователя
            const category = await Category.findOne({
                where: {
                    id: categoryId,
                    user_id: userId
                }
            })

            if (!category) {
                return next(ApiError.badRequest('Категория не найдена'))
            }

            let categoryLimit = await CategoryLimit.findOne({
                where: {
                    user_id: userId,
                    category_id: categoryId
                }
            })

            if (categoryLimit) {
                // Обновляем существующий лимит
                categoryLimit.limit_amount = limit
                await categoryLimit.save()
            } else {
                // Создаём новый лимит
                categoryLimit = await CategoryLimit.create({
                    user_id: userId,
                    category_id: categoryId,
                    limit_amount: limit
                })
            }

            return res.json({
                categoryId: categoryLimit.category_id,
                limit: categoryLimit.limit_amount,
                updated_at: categoryLimit.updatedAt
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new CategoryLimitController()
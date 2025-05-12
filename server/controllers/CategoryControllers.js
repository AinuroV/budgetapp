const {Category} = require('../models/models')
const ApiError = require('../error/ApiError')
const {validationResult} = require('express-validator')

class CategoryController {
    async getAll(req, res, next) {
        try {
            const categories = await Category.findAll({
                where: {user_id: req.user.id},
                attributes: ['id', 'name', 'color', 'is_type_income', 'created_at']
            })
            return res.json(categories)
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

            const {name, color, is_type_income} = req.body
            const category = await Category.create({
                user_id: req.user.id,
                name,
                color,
                is_type_income
            })

            return res.json({
                id: category.id,
                name: category.name,
                color: category.color,
                is_type_income: category.is_type_income,
                created_at: category.createdAt
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

            const {id, name, color} = req.body
            const category = await Category.findOne({
                where: {
                    id,
                    user_id: req.user.id
                }
            })

            if (!category) {
                return next(ApiError.notFound('Категория не найдена'))
            }

            category.name = name || category.name
            category.color = color || category.color
            await category.save()

            return res.json({
                id: category.id,
                name: category.name,
                color: category.color,
                is_type_income: category.is_type_income,
                updated_at: category.updatedAt
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.body
            const category = await Category.findOne({
                where: {
                    id,
                    user_id: req.user.id
                }
            })

            if (!category) {
                return next(ApiError.notFound('Категория не найдена'))
            }

            await category.destroy()
            return res.json({
                success: true,
                message: 'Category deleted'
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new CategoryController()
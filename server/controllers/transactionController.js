const {Transaction, Category} = require('../models/models')
const ApiError = require('../error/ApiError')
const {validationResult} = require('express-validator')
const {Op} = require('sequelize')
const moment = require('moment')

class TransactionController {
    async getAll(req, res, next) {
        try {
            const {
                dateRange,
                startDate,
                endDate,
                category,
                type,
                search,
                page = 1,
                limit = 10
            } = req.query
            
            const userId = req.user.id
            const offset = (page - 1) * limit
            
            // Настройка фильтра по дате
            let dateFilter = {}
            const now = moment()
            
            switch (dateRange) {
                case 'week':
                    dateFilter = {
                        date: {
                            [Op.gte]: now.startOf('week').toDate(),
                            [Op.lte]: now.endOf('week').toDate()
                        }
                    }
                    break
                case 'month':
                    dateFilter = {
                        date: {
                            [Op.gte]: now.startOf('month').toDate(),
                            [Op.lte]: now.endOf('month').toDate()
                        }
                    }
                    break
                case 'year':
                    dateFilter = {
                        date: {
                            [Op.gte]: now.startOf('year').toDate(),
                            [Op.lte]: now.endOf('year').toDate()
                        }
                    }
                    break
                case 'custom':
                    if (!startDate || !endDate) {
                        return next(ApiError.badRequest('Для custom диапазона нужны startDate и endDate'))
                    }
                    dateFilter = {
                        date: {
                            [Op.gte]: new Date(startDate),
                            [Op.lte]: new Date(endDate)
                        }
                    }
                    break
                case 'all':
                    // Без фильтра по дате
                    break
                default:
                    return next(ApiError.badRequest('Некорректный период'))
            }
            
            // Формируем условия запроса
            const where = {
                user_id: userId,
                ...dateFilter
            }
            
            if (category) where.category_id = category
            if (type) where.type = type
            if (search) {
                where.description = {
                    [Op.iLike]: `%${search}%`
                }
            }
            
            const transactions = await Transaction.findAndCountAll({
                where,
                order: [['date', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [{
                    model: Category,
                    attributes: ['id', 'name', 'color']
                }],
                attributes: ['id', 'amount', 'description', 'date', 'type', 'category_id', 'created_at']
            })
            
            return res.json({
                transactions: transactions.rows,
                total: transactions.count
            })
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
            
            const {amount, description, date, type, category_id} = req.body
            const userId = req.user.id
            
            // Проверяем, что категория принадлежит пользователю
            if (category_id) {
                const category = await Category.findOne({
                    where: {
                        id: category_id,
                        user_id: userId
                    }
                })
                
                if (!category) {
                    return next(ApiError.badRequest('Категория не найдена'))
                }
                
                // Проверяем, что тип транзакции соответствует типу категории
                if ((type === 'income' && !category.is_type_income) || 
                    (type === 'expense' && category.is_type_income)) {
                    return next(ApiError.badRequest('Тип транзакции не соответствует типу категории'))
                }
            }
            
            const transaction = await Transaction.create({
                user_id: userId,
                amount,
                description,
                date: date || new Date(),
                type,
                category_id
            })
            
            return res.json({
                id: transaction.id,
                amount: transaction.amount,
                description: transaction.description,
                date: transaction.date,
                type: transaction.type,
                category_id: transaction.category_id,
                created_at: transaction.createdAt
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
            const userId = req.user.id
            
            const transaction = await Transaction.findOne({
                where: {
                    id,
                    user_id: userId
                }
            })
            
            if (!transaction) {
                return next(ApiError.notFound('Транзакция не найдена'))
            }
            
            // Обновляем только разрешенные поля
            const allowedFields = ['amount', 'description', 'date', 'type', 'category_id']
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    transaction[field] = updateData[field]
                }
            })
            
            // Если обновляется категория, проверяем ее
            if (updateData.category_id) {
                const category = await Category.findOne({
                    where: {
                        id: updateData.category_id,
                        user_id: userId
                    }
                })
                
                if (!category) {
                    return next(ApiError.badRequest('Категория не найдена'))
                }
                
                // Проверяем соответствие типа категории и транзакции
                if ((transaction.type === 'income' && !category.is_type_income) || 
                    (transaction.type === 'expense' && category.is_type_income)) {
                    return next(ApiError.badRequest('Тип транзакции не соответствует типу категории'))
                }
            }
            
            await transaction.save()
            
            return res.json({
                id: transaction.id,
                amount: transaction.amount,
                description: transaction.description,
                updated_at: transaction.updatedAt
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.body
            const userId = req.user.id
            
            const transaction = await Transaction.findOne({
                where: {
                    id,
                    user_id: userId
                }
            })
            
            if (!transaction) {
                return next(ApiError.notFound('Транзакция не найдена'))
            }
            
            await transaction.destroy()
            
            return res.json({
                success: true,
                message: 'Transaction deleted'
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new TransactionController()
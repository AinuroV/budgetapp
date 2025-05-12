const { HistoryAction, actionTypes, entityTypes } = require('../models/historyActionModel')
const ApiError = require('../error/ApiError')
const { validationResult } = require('express-validator')
const { Op } = require('sequelize')
const moment = require('moment')

// Импортируем модели для отмены действий
const { Transaction } = require('../models/transactionModel')
const { Category } = require('../models/categoryModel')
const { Budget } = require('../models/budgetModel')
const { Goal } = require('../models/goalModel')

class HistoryController {
    async getAll(req, res, next) {
        try {
            const { actionType, entityType, dateRange, startDate, endDate } = req.query
            const userId = req.user.id
            
            // Валидация параметров
            if (actionType && !actionTypes.includes(actionType)) {
                return next(ApiError.badRequest('Некорректный тип действия'))
            }
            
            if (entityType && !entityTypes.includes(entityType)) {
                return next(ApiError.badRequest('Некорректный тип сущности'))
            }
            
            // Настройка фильтра по дате
            let dateFilter = {}
            const now = moment()
            
            switch (dateRange) {
                case 'day':
                    dateFilter = {
                        timestamp: {
                            [Op.gte]: now.startOf('day').toDate(),
                            [Op.lte]: now.endOf('day').toDate()
                        }
                    }
                    break
                case 'week':
                    dateFilter = {
                        timestamp: {
                            [Op.gte]: now.startOf('week').toDate(),
                            [Op.lte]: now.endOf('week').toDate()
                        }
                    }
                    break
                case 'month':
                    dateFilter = {
                        timestamp: {
                            [Op.gte]: now.startOf('month').toDate(),
                            [Op.lte]: now.endOf('month').toDate()
                        }
                    }
                    break
                case 'year':
                    dateFilter = {
                        timestamp: {
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
                        timestamp: {
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
            
            if (actionType) where.action_type = actionType
            if (entityType) where.entity_type = entityType
            
            const history = await HistoryAction.findAll({
                where,
                order: [['timestamp', 'DESC']],
                attributes: ['id', 'action_type', 'entity_type', 'entity_id', 'old_data', 'new_data', 'timestamp']
            })
            
            return res.json(history)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async add(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()))
            }
            
            const { action_type, entity_type, entity_id, old_data, new_data } = req.body
            const userId = req.user.id
            
            // Проверяем, что тип действия и тип сущности допустимы
            if (!actionTypes.includes(action_type)) {
                return next(ApiError.badRequest('Недопустимый тип действия'))
            }
            
            if (!entityTypes.includes(entity_type)) {
                return next(ApiError.badRequest('Недопустимый тип сущности'))
            }
            
            const action = await HistoryAction.create({
                user_id: userId,
                action_type,
                entity_type,
                entity_id,
                old_data,
                new_data
            })
            
            return res.json({
                id: action.id,
                action_type: action.action_type,
                entity_type: action.entity_type,
                entity_id: action.entity_id,
                timestamp: action.timestamp
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async undo(req, res, next) {
        try {
            const { id } = req.body
            const userId = req.user.id
            
            // Находим действие в истории
            const action = await HistoryAction.findOne({
                where: {
                    id,
                    user_id: userId
                }
            })
            
            if (!action) {
                return next(ApiError.notFound('Действие не найдено'))
            }
            
            let restoredEntity = null
            
            // Восстанавливаем данные в зависимости от типа сущности
            switch (action.entity_type) {
                case 'Transaction':
                    if (action.action_type === 'DELETE') {
                        // Восстанавливаем удаленную транзакцию
                        restoredEntity = await Transaction.create({
                            ...action.old_data,
                            user_id: userId
                        })
                    } else {
                        // Для других действий обновляем существующую транзакцию
                        const transaction = await Transaction.findOne({
                            where: {
                                id: action.entity_id,
                                user_id: userId
                            }
                        })
                        
                        if (transaction) {
                            await transaction.update(action.old_data)
                            restoredEntity = transaction
                        }
                    }
                    break
                    
                case 'Category':
                    if (action.action_type === 'DELETE') {
                        restoredEntity = await Category.create({
                            ...action.old_data,
                            user_id: userId
                        })
                    } else {
                        const category = await Category.findOne({
                            where: {
                                id: action.entity_id,
                                user_id: userId
                            }
                        })
                        
                        if (category) {
                            await category.update(action.old_data)
                            restoredEntity = category
                        }
                    }
                    break
                    
                case 'Budget':
                    const budget = await Budget.findOne({
                        where: {
                            user_id: userId
                        }
                    })
                    
                    if (budget) {
                        await budget.update(action.old_data)
                        restoredEntity = budget
                    }
                    break
                    
                case 'Goal':
                    if (action.action_type === 'DELETE') {
                        restoredEntity = await Goal.create({
                            ...action.old_data,
                            user_id: userId
                        })
                    } else {
                        const goal = await Goal.findOne({
                            where: {
                                id: action.entity_id,
                                user_id: userId
                            }
                        })
                        
                        if (goal) {
                            await goal.update(action.old_data)
                            restoredEntity = goal
                        }
                    }
                    break
            }
            
            if (!restoredEntity) {
                return next(ApiError.badRequest('Не удалось отменить действие'))
            }
            
            // Удаляем запись из истории (опционально)
            await action.destroy()
            
            return res.json({
                success: true,
                message: 'Action undone',
                restored_entity: restoredEntity
            })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new HistoryController()
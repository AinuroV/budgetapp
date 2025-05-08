const { Category } = require('../models/models')

class CategoryController {
    async create(req, res) {
        try {
            const { name, isTypeIncome, limit } = req.body
            const userId = req.user.id 

            if (!name) {
                return res.status(400).json({ message: "Название категории обязательно" })
            }

            const category = await Category.create({ name, userId,isTypeIncome, limit })
            return res.status(201).json({
                message: "Категория расходов создана",
                category
            })

        } catch (error) {
            console.error('Ошибка при создании категории:', error)
            return res.status(500).json({ 
                message: "Ошибка при создании категории",
                error: error.message 
            })
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id
            const categories = await Category.findAll({ where: { userId } })
            
            return res.json({categories})
        } catch (error) {
            console.error('Ошибка при получении категорий:', error)
            return res.status(500).json({
                 message: "Ошибка при получении категорий",
                error: error.message })
        }
    }

    async getAllByType(req, res) {
        try {
            const { isTypeIncome } = req.params
            const userId = req.user.id
            const categories = await Category.findAll({ where: { userId,isTypeIncome } })
            
            return res.json({categories})
        } catch (error) {
            console.error('Ошибка при получении категорий:', error)
            return res.status(500).json({
                 message: "Ошибка при получении категорий",
                error: error.message })
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id

            const category = await Category.findOne({ 
                where: { id, userId },
               
            })

            if (!category) {
                return res.status(404).json({ 
                    message: `Категория расходов с ID ${id} не найдена`
                })
            }

            return res.json(category)
        } catch (error) {
            console.error('Ошибка при получении категории:', error)
            return res.status(500).json({ 
                message: "Ошибка при получении категории расходов",
                error: error.message
            })
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params
            const { name } = req.body
            const userId = req.user.id

            if (!name) {
                return res.status(400).json({ message: "Название категории обязательно" })
            }

            const category = await Category.findOne({ 
                where: { id, userId }
            })

            if (!category) {
                return res.status(404).json({ 
                    message: `Категория расходов с ID ${id} не найдена`
                })
            }

            category.name = name
            await category.save()

            return res.json({
                message: "Категория расходов обновлена",
                category
            })
        } catch (error) {
            console.error('Ошибка при обновлении категории:', error)
            return res.status(500).json({ 
                message: "Ошибка при обновлении категории расходов",
                error: error.message
            })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id

            const category = await Category.findOne({ 
                where: { id, userId }
            })

            if (!category) {
                return res.status(404).json({ 
                    message: `Категория расходов с ID ${id} не найдена`
                })
            }

            await category.destroy()
            return res.json({ 
                message: "Категория расходов успешно удалена",
                deletedId: id
            })
        } catch (error) {
            console.error('Ошибка при удалении категории:', error)
            return res.status(500).json({ 
                message: "Ошибка при удалении категории расходов",
                error: error.message
            })
        }
    }

    
}

module.exports = new CategoryController()
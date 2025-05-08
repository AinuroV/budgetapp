const { Transaction, Category } = require('../models/models');

class TransactionController {
    async getOne(req, res) {
        try {
            const { id } = req.params;
            const transaction = await Transaction.findOne({ where: { id } });
            
            if (!transaction) {
                return res.status(404).json({ message: "Транзакция не найдена" });
            }
            
            return res.json(transaction);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async create(req, res) {
        try {
            const { date_transaction, name, sum, categoryId,isTypeIncome } = req.body;
            const userId = req.user.id; 
            console.log('--------------------------------',isTypeIncome)
            if (categoryId) {
                const category = await Category.findOne({ 
                    where: { id: categoryId, userId } 
                });
                if (!category) {
                    return res.status(400).json({ message: "Категория расходов не найдена" });
                }
            }

           
            const transaction = await Transaction.create({ 
                date_transaction, 
                name, 
                sum, 
                categoryId,
                userId,
                isTypeIncome })

            return res.json(transaction);
        } 
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка при создании транзакции" });
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id; // Получаем userId из токена
            const transactions = await Transaction.findAll({ 
                where: { userId } 
            });
            return res.json(transactions);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async getTotals(req, res) {
        try {
            const { isTypeIncome } = req.params;
            const userId = req.user.id;
            
            // Получаем все транзакции пользователя с указанным типом (доход/расход)
            const transactions = await Transaction.findAll({ 
                where: { userId, isTypeIncome } 
            });
    
            // Если нет транзакций, возвращаем пустой результат
            if (transactions.length === 0) {
                return res.json({
                    totalSum: 0,
                    categoryTransactions: []
                });
            }
    
            // Вычисляем общую сумму всех транзакций
            const totalSum = transactions.reduce((sum, transaction) => sum + transaction.sum, 0);
    
            // Группируем транзакции по категориям и вычисляем суммы по каждой категории
            const categorySums = transactions.reduce((acc, transaction) => {
                const categoryId = transaction.categoryId || 0; // Если категория не указана, используем 0
                if (!acc[categoryId]) {
                    acc[categoryId] = 0;
                }
                acc[categoryId] += transaction.sum;
                return acc;
            }, {});
    
            // Формируем массив категорий с суммами и процентами
            const categoryTransactions = Object.entries(categorySums).map(([categoryId, sum]) => ({
                categoryId: categoryId === '0' ? null : parseInt(categoryId),
                sum,
                percent: Math.round((sum / totalSum) * 100)
            }));
    
            return res.json({
                totalSum,
                categoryTransactions
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }


    async deleteOne(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const transaction = await Transaction.findOne({ 
                where: { id, userId } 
            });

            if (!transaction) {
                return res.status(404).json({ message: "Транзакция не найдена" });
            }

            await transaction.destroy();
            return res.json({ message: "Транзакция удалена" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async updateOne(req, res) {
        try {
            const { id } = req.params;
            const { name, sum, date_transaction } = req.body;
            const userId = req.user.id;

            const transaction = await Transaction.findOne({ 
                where: { id, userId } 
            });

            if (!transaction) {
                return res.status(404).json({ message: "Транзакция не найдена" });
            }

            transaction.name = name || transaction.name;
            transaction.sum = sum || transaction.sum;
            transaction.date_transaction = date_transaction || transaction.date_transaction;

            await transaction.save();
            return res.json(transaction);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    


}

module.exports = new TransactionController();
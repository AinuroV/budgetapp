const {Budget} = require('../models/models')

class BudgetController{

    async get(req, res) {
        try {
          
          const budget = await Budget.findOne({
            where: {userId: req.user.id} 
          });
          
          if (!budget) {
            
            const defaultBudget = await Budget.create({
              sum: 0,
              userId: req.user.id
            });
            
            return res.json({
              total: defaultBudget.sum,
              categories: [
                {name: 'Категория 1', percentage: 0, amount: 0},
                {name: 'Категория 2', percentage: 0, amount: 0}
              ]
            });
          }
          
         
          res.json({
            total: budget.sum})
          
        } catch (err) {
          console.error('Ошибка при получении бюджета:', err);
          res.status(500).json({message: 'Ошибка сервера'});
        }
    }

    async create(req, res){
        try {
            const {sum} = req.body
            const userId = req.user.id 
            console.log("----------------------------", userId)
            if(!sum){
                return res.status(400).json({ message: "Назначение бюджета обязательно" })
            }
            const budget = await Budget.create({sum, userId})
            return res.status(201).json({
                message: "Бюджет создан",
                budget
            })
            
        } catch (error) {
            console.log('Ошибка сохранения бюджета', error)
            return res.status(400).json({message: "Ошибка при получения бюджета"})
        }
    }
}

module.exports = new BudgetController
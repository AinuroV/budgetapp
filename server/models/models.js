const User = require('./userModels')
const Category = require('./categoryModels')
const Transaction = require('./transactionModel')
const Token = require('./tokenModels')
const Budget = require('./budgetModels')
const Goal = require('./goalModel')
const CategoryLimit = require('./categoryLimitModel')
const {HistoryAction} = require('./historyActionModel')

// Ассоциации пользователя
User.hasMany(Category) // Один пользователь имеет много категорий
Category.belongsTo(User) // Одна категория имеет одного пользователя

User.hasMany(Token)
Token.belongsTo(User)

User.hasOne(Budget)
Budget.belongsTo(User)

User.hasMany(Goal)
Goal.belongsTo(User)

User.hasMany(Transaction)
Transaction.belongsTo(User)

User.hasMany(CategoryLimit)
CategoryLimit.belongsTo(User)

User.hasMany(HistoryAction)
HistoryAction.belongsTo(User)

// Ассоциации категорий
Category.hasMany(Transaction)
Transaction.belongsTo(Category)

Category.hasMany(CategoryLimit)
CategoryLimit.belongsTo(Category)

module.exports = {
  Category,
  Transaction,
  User,
  Token,
  Budget,
  Goal,
  CategoryLimit,
  HistoryAction
}
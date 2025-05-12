const User = require('./userModels')
const Category = require('./categoryModels.js')
const Transaction = require('./transactionModels')
const Token = require('./tokenModels')
const Budget = require('./budgetModels.js')
const Goal = require('./goalModel.js')

User.hasMany(Category) // Один пользователь имеет много категорий
Category.belongsTo(User) // Одна категория имеет одного пользователя

User.hasMany(Token)
Token.belongsTo(User)

User.hasOne(Budget)
Budget.belongsTo(User)

Goal.associate = (models) => {
  Goal.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

};
User.hasMany(Transaction)
Transaction.belongsTo(User)

Category.hasMany(Transaction)
Transaction.belongsTo(Category)


module.exports = {
  Category,
  Transaction,
  User,
  Token,
  Budget,
  Goal
}
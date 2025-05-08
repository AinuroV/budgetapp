// models/FinancialGoal.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db'); // Подключение к экземпляру Sequelize (ваш файл инициализации БД)

class FinancialGoal extends Model {}
FinancialGoal.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Связь с моделью User: в таблице обязательно должен быть внешний ключ userId
    references: {
      model: 'Users', // название таблицы пользователей
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'FinancialGoal',
});

// Определение связи "многие к одному": несколько целей принадлежит одному пользователю


module.exports = FinancialGoal;

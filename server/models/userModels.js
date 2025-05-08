const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { notEmpty: true }},
    password: { type: DataTypes.STRING, allowNull: false, validate: { len: [6, 100] }}
  }, {
    tableName: 'Users' // <-- Явное имя таблицы
  });

module.exports = User
const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING,  allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    isTypeIncome: { type: DataTypes.BOOLEAN, allowNull: false},
    limit: {type: DataTypes.INTEGER, allowNull: false},
    sum: {type: DataTypes.INTEGER, allowNull: true},
}) 

module.exports = Category
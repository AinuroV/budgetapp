const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Transaction = sequelize.define('transaction', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    date_transaction: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    sum: {type: DataTypes.INTEGER, allowNull: false},
    categoryId: { type: DataTypes.INTEGER, allowNull: true }, 
    userId: { type: DataTypes.INTEGER, allowNull: false },
    isTypeIncome: { type: DataTypes.BOOLEAN, allowNull: false}

})

module.exports = Transaction
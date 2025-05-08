const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Budget = sequelize.define('budget', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
    sum: {type: DataTypes.INTEGER, allowNull: false},
    userId: { type: DataTypes.INTEGER, allowNull: false }   

})

module.exports = Budget
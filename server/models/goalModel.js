const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const Goal = sequelize.define('goal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    target_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    current_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
    }
}, {
    tableName: 'goals',
    timestamps: true,
    underscored: true
})

module.exports = Goal
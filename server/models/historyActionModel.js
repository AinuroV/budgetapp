const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const actionTypes = ['ADD', 'UPDATE', 'DELETE', 'UPDATE_BUDGET', 'SET_CATEGORY_LIMIT']
const entityTypes = ['Transaction', 'Category', 'Budget', 'Goal']

const HistoryAction = sequelize.define('history_action', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action_type: {
        type: DataTypes.ENUM(...actionTypes),
        allowNull: false
    },
    entity_type: {
        type: DataTypes.ENUM(...entityTypes),
        allowNull: false
    },
    entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    old_data: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    new_data: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    }
}, {
    tableName: 'history_actions',
    timestamps: false,
    underscored: true
})

module.exports = { HistoryAction, actionTypes, entityTypes }
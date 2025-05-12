const {DataTypes} = require('sequelize')
const sequelize = require('../db')

const CategoryLimit = sequelize.define('category_limit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    limit_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
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
    tableName: 'category_limits',
    timestamps: true,
    underscored: true
})

module.exports = CategoryLimit
const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    code:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    marque: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lot: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    family: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
            model: 'family',
            key: 'id'
        }
    },
    zone: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
            model: 'zone',
            key: 'id'
        }
    }
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Product;
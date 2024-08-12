const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Consommation = sequelize.define('consommation', {
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
    panne: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'panne',
            key: 'id'
        }
    },
    piece: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'piece',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Consommation;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Lot = sequelize.define('lot', {
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
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Lot;
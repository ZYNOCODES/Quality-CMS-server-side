const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Action = sequelize.define('action', {
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
    },
    duree:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Action;
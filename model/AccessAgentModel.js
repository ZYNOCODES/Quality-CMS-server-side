const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Agent = sequelize.define('agent', {
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
    username:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    zone: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Agent;
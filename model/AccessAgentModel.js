const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Zone = require('./ZoneModel');

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
    fullname:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    zone: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'zone',
            key: 'id'
        }
    },
},{
    freezeTableName: true,
    timestamps: false,
});

Agent.belongsTo(Zone, {
    foreignKey: 'zone',
    as: 'zoneAssociation'
});

module.exports = Agent;
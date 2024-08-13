const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Zone = require('./ZoneModel');

const Workshop = sequelize.define('workshop', {
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
    zone:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'zone',
            key: 'id'
        }
    }
},{
    freezeTableName: true,
    timestamps: false,
});

Workshop.belongsTo(Zone, {
    foreignKey: 'zone',
    as: 'zoneAssociation'
});

module.exports = Workshop;
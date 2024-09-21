const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const typePanne = require('./PanneTypeModel.js');

const PanneTypeAssignment = sequelize.define('pannetypeassignment', {
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
    typepanne: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'typepanne',
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

// Define associations
PanneTypeAssignment.belongsTo(typePanne, {
    foreignKey: 'typepanne',
    as: 'typepanneAssociation'
});

module.exports = PanneTypeAssignment;
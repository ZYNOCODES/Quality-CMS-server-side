const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Action = require('./ActionModel.js');
const Panne = require('./PanneModel.js');

const Actioncorrective = sequelize.define('actioncorrective', {
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
    action: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'action',
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    mesure: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    resultat: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

Actioncorrective.belongsTo(Action, {
    foreignKey: 'action',
    as: 'actionAssociation'
});

Actioncorrective.belongsTo(Panne, {
    foreignKey: 'panne',
    as: 'panneAssociation'
});

module.exports = Actioncorrective;
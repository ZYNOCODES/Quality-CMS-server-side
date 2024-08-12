const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

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
    },
    resultat: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Actioncorrective;
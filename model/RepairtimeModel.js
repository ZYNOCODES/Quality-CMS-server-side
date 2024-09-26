const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Repairtime = sequelize.define('repairtime', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    start:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    end:{
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    panne: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'panne',
            key: 'id'
        }
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Repairtime;
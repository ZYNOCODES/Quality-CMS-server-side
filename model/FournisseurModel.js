const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const Fournisseur = sequelize.define('fournisseur', {
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
    fullname:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Fournisseur;
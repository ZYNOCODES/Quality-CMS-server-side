const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Family = require('./FamilyModel');
const Zone = require('./ZoneModel');
const Lot = require('./LotModel');

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    marque: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lot: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'lot',
            key: 'id'
        }
    },
    tailleLot: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    family: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'family',
            key: 'id'
        }
    },
    zone: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'zone',
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    timestamps: false,
});

// Define associations
Product.belongsTo(Family, {
    foreignKey: 'family',
    as: 'familyAssociation'
});

Product.belongsTo(Zone, {
    foreignKey: 'zone',
    as: 'zoneAssociation'
});

Product.belongsTo(Lot, {
    foreignKey: 'lot',
    as: 'lotAssociation'
});

module.exports = Product;
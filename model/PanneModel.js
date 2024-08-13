const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Product = require('./ProductModel');
const Workshop = require('./WorkshopModel');
const Technician = require('./TechnicianModel');

const Panne = sequelize.define('panne', {
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
    product: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'product',
            key: 'id'
        }
    },
    fournisseur: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sn: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    technician: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
            model: 'technician',
            key: 'id'
        }
    },
    workshop: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
            model: 'workshop',
            key: 'id'
        }
    },
    panne: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateDeclaration: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ligne: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateReparation: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    source: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    etat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    liberation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    dateLibiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    tempInitial: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    tempFinal: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    dureeDintervention: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    freezeTableName: true,
    timestamps: false,
});

// Define associations
Panne.belongsTo(Technician, {
    foreignKey: 'technician',
    as: 'technicianAssociation'
});

Panne.belongsTo(Workshop, {
    foreignKey: 'workshop',
    as: 'workshopAssociation'
});

Panne.belongsTo(Product, {
    foreignKey: 'product',
    as: 'productAssociation'
});

module.exports = Panne;

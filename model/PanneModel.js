const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Product = require('./ProductModel');
const Workshop = require('./WorkshopModel');
const Technician = require('./TechnicianModel');
const Agent = require('./AccessAgentModel');
const Fournisseur = require('./FournisseurModel');

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
    sn: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fournisseur: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'fournisseur',
            key: 'id'
        }
    },
    agent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'agent',
            key: 'id'
        }
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
    livraison:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    DateLivraison:{
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
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    reouverture: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    reouvertureTempInitial: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    reouvertureTempFinal: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    isPaused: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

// Define associations
Panne.belongsTo(Technician, {
    foreignKey: 'technician',
    as: 'technicianAssociation'
});

Panne.belongsTo(Agent, {
    foreignKey: 'agent',
    as: 'agentAssociation'
});

Panne.belongsTo(Workshop, {
    foreignKey: 'workshop',
    as: 'workshopAssociation'
});

Panne.belongsTo(Product, {
    foreignKey: 'product',
    as: 'productAssociation'
});

Panne.belongsTo(Fournisseur, {
    foreignKey: 'fournisseur',
    as: 'fournisseurAssociation'
});

module.exports = Panne;

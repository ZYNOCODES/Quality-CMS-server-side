const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const Agent = require('./AccessAgentModel.js');
const Panne = require('./PanneModel.js');

const AgentUpdateActions = sequelize.define('agent_update_actions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    agent:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'agent',
            key: 'id'
        }
    },
    panne:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'panne',
            key: 'id'
        }
    },
    action:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    date:{
        type: DataTypes.DATE,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

AgentUpdateActions.belongsTo(Agent, {
    foreignKey: 'agent',
    as: 'agentAssociation'
});
AgentUpdateActions.belongsTo(Panne, {
    foreignKey: 'panne',
    as: 'panneAssociation'
});


module.exports = AgentUpdateActions;
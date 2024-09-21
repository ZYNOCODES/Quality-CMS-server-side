const AgentUpdateActions = require('../model/AgentUpdateActionsModel');

const findAgentUpdateActionsById = async (id) => {
    return await AgentUpdateActions.findByPk(id);
};
const findAgentUpdateActionsByCode = async (code) => {
    return await AgentUpdateActions.findOne({
        where: {
            code
        },
    })
};
const createAgentUpdateActions = async (agent, panne, date, action) => {
    return await AgentUpdateActions.create({
        agent: agent,
        panne: panne,
        action: action,
        date: date,
    });
};
module.exports = {
    findAgentUpdateActionsById,
    findAgentUpdateActionsByCode,
    createAgentUpdateActions
}
const AgentUpdateActions = require('../model/AgentUpdateActionsModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');

//get all agent update actions
const GetAllAgentUpdateActions = asyncErrorHandler(async (req, res) => {
    const { code } = req.params;
    //check if code is provided
    if(!code || validator.isEmpty(code)){
        return next(new CustomError('Code non fourni', 400));
    }
    const agentUpdateActions = await AgentUpdateActions.findAll({
        where: {
            agent: code
        }
    });
    // Check if there are agent update actions
    if (!agentUpdateActions || agentUpdateActions.length < 1) {
        return next(new CustomError('Aucune action de mise à jour trouvée', 404));
    }
    res.status(200).json(agentUpdateActions);
});

module.exports = {
    GetAllAgentUpdateActions
}
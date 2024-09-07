const ActionCorrective = require('../model/ActionCorrectiveModel.js');
const Action = require('../model/ActionModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const PanneService = require('../service/PanneService.js');
const ActionService = require('../service/ActionService.js');
const UserService = require('../service/UsersService.js');
const ActionCorrectiveService = require('../service/ActionCorrectiveService.js');
const moment = require('moment');
require('moment-timezone');

//get all actions corrective by panne
const GetAllActionsCorrectiveByPanne = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    const actionsCorrective = await ActionCorrective.findAll({
        where: {
            panne: existingPanne.id
        },
        include: [
            {
                model: Action,
                as: 'actionAssociation',
                attributes: ['code', 'name'],
            }
        ],
    });
    //check if there are actions corrective
    if (actionsCorrective.length < 1) {
        return next(new CustomError('Aucune action corrective trouvée', 404));
    }
    res.status(200).json(actionsCorrective);
});
//create action corrective
const CreateActionCorrective = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { action, mesure, resultat, agent } = req.body;
    // Validate required fields
    if ([code, action, agent].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //Validate one of the optional fields
    if ([mesure, resultat].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Au moins un des champs optionnels doit être rempli', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if its the same agent who create this panne
    if(existingAgent.id != existingPanne.agent){
        return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
    }

    //check if the panne is submitted to second scan
    if(!existingPanne.technician && !existingPanne.tempInitial){
        return next(new CustomError('La panne n\'a pas encore été soumise au deuxième scan', 400));
    }

    //check if the panne is already closed
    if(existingPanne.dateReparation){
        return next(new CustomError('La panne est déjà clôturée, vous ne pouvez pas ajouter une nouveau action corrective', 400));
    }

    //check if action exists
    const existingAction = await ActionService.findActionByCode(action);
    if(!existingAction){
        return next(new CustomError('Action non trouvée', 404));
    }

    //check if action corrective exists for the panne
    const existingActionCorrective = await ActionCorrectiveService.findActionCorrectiveByPanneAndAction(existingPanne.id, existingAction.id);
    if(existingActionCorrective){
        return next(new CustomError(`Action corrective déjà existante pour ${existingAction.name}`, 400));
    }

    // Generate a unique code for the family
    const codeACC = await generateUniqueCode("ACC", 6, ActionCorrective);
    if (!codeACC) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // get current date and time DZ
    const date = moment().tz("Africa/Algiers").format('YYYY-MM-DD HH:mm:ss');

    // Create the new action corrective
    const newActionCorrective = await ActionCorrective.create({
        code: codeACC,
        panne: existingPanne.id,
        action: existingAction.id,
        date,
        mesure,
        resultat
    });

    // Check if the new action corrective was created successfully
    if (!newActionCorrective) {
        return next(new CustomError('Un problème est survenu lors de la création de l\'action corrective, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Action corrective créée avec succès' });
});
//update action corrective
const UpdateActionCorrective = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { action, mesure, resultat } = req.body;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //Validate one of the optional fields
    if ([action, mesure, resultat].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Au moins un des champs optionnels doit être rempli', 400));
    }

    //check if action corrective exists
    const existingActionCorrective = await ActionCorrectiveService.findActionCorrectiveByCode(code);
    if(!existingActionCorrective){
        return next(new CustomError('Action corrective non trouvée', 404));
    }

    if(action){
        //check if action exists
        const existingAction = await ActionService.findActionByCode(action);
        if(!existingAction){
            return next(new CustomError('Action non trouvée', 404));
        }
        //check if action corrective exists for the panne
        const existingActionPanne = await ActionCorrectiveService.findActionCorrectiveByPanneAndAction(existingActionCorrective.panne, existingAction.id);
        if(existingActionPanne){
            return next(new CustomError(`Action corrective déjà existante pour ${existingAction.name}`, 400));
        }
        //update action
        existingActionCorrective.action = existingAction.id;
    }

    //update action corrective
    if(mesure) existingActionCorrective.mesure = mesure;
    if(resultat) existingActionCorrective.resultat = resultat;
    // Save the updated action corrective
    const updatedActionCorrective = await existingActionCorrective.save();

    // Check if the action corrective was updated successfully
    if (!updatedActionCorrective) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour de l\'action corrective, veuillez réessayer.', 400));
    }
    // Respond with success message
    res.status(200).json({ message: 'L\'action corrective a été modifiée avec succès' });
});
//delete action corrective
const DeleteActionCorrective = asyncErrorHandler(async (req, res, next) => {
    const { code, agent } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code) ||
        !agent || validator.isEmpty(agent)
    ) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    
    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    //check if action corrective exists
    const existingActionCorrective = await ActionCorrectiveService.findActionCorrectiveByCode(code);
    if(!existingActionCorrective){
        return next(new CustomError('Action corrective non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneById(existingActionCorrective.panne);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if its the same agent who create this panne
    if(existingAgent.id != existingPanne.agent){
        return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
    }

    //check if the panne is already closed
    if(existingPanne.dateReparation){
        return next(new CustomError('La panne est déjà clôturée, vous ne pouvez pas supprimer l\'action corrective', 400));
    }

    //delete action corrective
    const deletedActionCorrective = await existingActionCorrective.destroy();

    // Check if the action corrective was deleted successfully
    if (!deletedActionCorrective) {
        return next(new CustomError('Un problème est survenu lors de la suppression de l\'action corrective, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'L\'action corrective a été supprimée avec succès' });
});

module.exports = {
    GetAllActionsCorrectiveByPanne,
    CreateActionCorrective,
    UpdateActionCorrective,
    DeleteActionCorrective
}
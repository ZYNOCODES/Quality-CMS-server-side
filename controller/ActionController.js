const Action = require('../model/ActionModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const ActionCorrectiveService = require('../service/ActionCorrectiveService.js');

//get all actions
const GetAllActions = asyncErrorHandler(async (req, res, next) => {
    const actions = await Action.findAll();
    //check if there are actions
    if (actions.length < 1) {
        return next(new CustomError('Aucune action trouvée', 404));
    }
    res.status(200).json(actions);
});
//create a new Action
const CreateAction = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;

    // Check if the name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Generate a unique code for the Action
    const code = await generateUniqueCode("AC", 4, Action);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // Check if the Action name already exists
    const existingName = await Action.findOne({
        where: {
            name
        },
    });
    if (existingName) {
        return next(new CustomError('Le nom de cette action existe déjà', 400));
    }

    // Create a new Action
    const newAction = await Action.create({
        code,
        name
    });

    // Check if the new Action was created successfully
    if (!newAction) {
        return next(new CustomError('Un problème est survenu lors de la création d\'une action, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Action créée avec succès' });
});
//update Action
const UpdateAction = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { name } = req.body;
    //check if name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Action exists
    const existAction = await Action.findOne({
        where: {
            code
        },
    });
    if (!existAction) {
        return next(new CustomError('Action non trouvée', 404));
    }
    //update Action
    if(name) existAction.name = name;
    const updatedAction = await existAction.save();
    //check if Action is updated
    if (!updatedAction) {
        return next(new CustomError('Un problème est survenu lors de la mettre à jour d\'une action, veuillez réessayer.', 400));

    }
    res.status(200).json({ message: 'Action mise à jour avec succès' });
});
//delete Action
const DeleteAction = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Action exists
    const existAction = await Action.findOne({
        where: {
            code
        },
    });
    if (!existAction) {
        return next(new CustomError('Action non trouvée', 404));
    }
    //check if there is Products related to this Action
    const actionCorrective = await ActionCorrectiveService.findActionCorrectiveByAction(existAction.id);
    if(actionCorrective){
        return next(new CustomError('Vous ne pouvez pas supprimer cette action car elle est liée à une action corrective existante.', 400));
    }
    //deletec Action
    const deletedAction = await existAction.destroy();
    //check if Action is updated
    if (!deletedAction) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'une action, veuillez réessayer.', 400));
    }
    res.status(200).json({ message: 'Action supprimée avec succès' });
});

module.exports = {
    GetAllActions,
    CreateAction,
    UpdateAction,
    DeleteAction
}
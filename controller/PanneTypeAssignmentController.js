const PanneTypeAssignment = require('../model/PanneTypeAssignmentModel.js');
const PanneType = require('../model/PanneTypeModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const PanneService = require('../service/PanneService.js');
const PanneTypeService = require('../service/PanneTypeService.js');
const UserService = require('../service/UsersService.js');
const PanneTypeAssignmentService = require('../service/PanneTypeAssignmentService.js');
const utilMoment = require('../util/Moment.js');


//get all type panne assignments by panne
const GetAllPanneTypeAssignmentByPanne = asyncErrorHandler(async (req, res, next) => {
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

    const newPanneTypeAssignment = await PanneTypeAssignment.findAll({
        where: {
            panne: existingPanne.id
        },
        include: [
            {
                model: PanneType,
                as: 'typepanneAssociation',
                attributes: ['code', 'name'],
            }
        ],
    });
    //check if there are panne type assignments
    if (newPanneTypeAssignment.length < 1) {
        return next(new CustomError('Aucune type de panne trouvée', 404));
    }
    res.status(200).json(newPanneTypeAssignment);
});
//create new type panne assignment
const CreatePanneTypeAssignment = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { typePanne, agent } = req.body;
    // Validate required fields
    if ([code, typePanne, agent].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
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


    //check if type of panne exists
    const existingPanneType = await PanneTypeService.findPanneTypeByCode(typePanne);
    if(!existingPanneType){
        return next(new CustomError('Type de panne non trouvée', 404));
    }

    //check if Panne Type Assignment exists for the type of panne
    const existingPanneTypeAssignment = await PanneTypeAssignmentService.findPanneTypeAssignmentByPanneAndType(existingPanne.id, existingPanneType.id);
    if(existingPanneTypeAssignment){
        return next(new CustomError(`${existingPanneType.name} existe déjà pour cette panne`, 400));
    }

    // Generate a unique code for the new PanneTypeAssignment
    const codeACC = await generateUniqueCode("PTP", 6, PanneTypeAssignment);
    if (!codeACC) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // get current date and time DZ
    const date = utilMoment.getCurrentDateTime();

    // Create the new PanneTypeAssignment
    const newPanneTypeAssignment = await PanneTypeAssignment.create({
        code: codeACC,
        panne: existingPanne.id,
        typepanne: existingPanneType.id,
        date,
    });

    // Check if the new PanneTypeAssignment was created successfully
    if (!newPanneTypeAssignment) {
        return next(new CustomError('Un problème est surveu lors de l\'ajout d\'un type de panne, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Type de panne ajouté avec succès' });
});
//update type panne assignment
const UpdatePanneTypeAssignment = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { typePanne } = req.body;
    //check if name is provided
    if (!code || validator.isEmpty(code) ||
        !typePanne || validator.isEmpty(typePanne)
    ) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if type panne assignment exists
    const existingPanneTypeAssignment = await PanneTypeAssignmentService.findPanneTypeAssignmentByCode(code);
    if(!existingPanneTypeAssignment){
        return next(new CustomError('Type de panne non trouvée', 404));
    }

    //check if type panne exists
    const existingPanneType = await PanneTypeService.findPanneTypeByCode(typePanne);
    if(!existingPanneType){
        return next(new CustomError('Type de panne non trouvée', 404));
    }

    //check if type panne assignment exists for the type of panne
    const existingTypeAssignment = await PanneTypeAssignmentService.findPanneTypeAssignmentByPanneAndType(existingPanneTypeAssignment.panne, existingPanneType.id);
    if(existingTypeAssignment){
        return next(new CustomError(`${existingPanneType.name} existe déjà pour cette panne`, 400));
    }
    //update type panne assignment
    existingPanneTypeAssignment.typepanne = existingPanneType.id;

    // Save the updated type panne assignment
    const updatedPanneTypeAssignment = await existingPanneTypeAssignment.save();

    // Check if the type panne assignment was updated successfully
    if (!updatedPanneTypeAssignment) {
        return next(new CustomError('Un problème est survenu lors de la modification du type de panne, veuillez réessayer.', 400));
    }
    // Respond with success message
    res.status(200).json({ message: 'Type de panne modifié avec succès' });
});
//delete type panne assignment
const DeletePanneTypeAssignment = asyncErrorHandler(async (req, res, next) => {
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

    //check if type panne assignment exists
    const existingPanneTypeAssignment = await PanneTypeAssignmentService.findPanneTypeAssignmentByCode(code);
    if(!existingPanneTypeAssignment){
        return next(new CustomError('Type de panne non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneById(existingPanneTypeAssignment.panne);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if its the same agent who create this panne
    if(existingAgent.id != existingPanne.agent){
        return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
    }

    //delete action corrective
    const deletedPanneTypeAssignment = await existingPanneTypeAssignment.destroy();

    // Check if the action corrective was deleted successfully
    if (!deletedPanneTypeAssignment) {
        return next(new CustomError('Un problème est survenu lors de la suppression du type de panne, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Type de panne supprimé avec succès' });
});

module.exports = {
    GetAllPanneTypeAssignmentByPanne,
    CreatePanneTypeAssignment,
    UpdatePanneTypeAssignment,
    DeletePanneTypeAssignment
}
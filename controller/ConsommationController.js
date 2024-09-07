const Consommation = require('../model/ConsommationModel.js');
const Piece = require('../model/PieceModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const PanneService = require('../service/PanneService.js');
const PieceService = require('../service/PieceService.js');
const ConsommationService = require('../service/ConsommationService.js');
const UserService = require('../service/UsersService.js');

//get all consommation pdr by panne
const GetAllConsommationsByPanne = asyncErrorHandler(async (req, res, next) => {
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

    const consommation = await Consommation.findAll({
        where: {
            panne: existingPanne.id
        },
        include: [
            {
                model: Piece,
                as: 'pieceAssociation',
                attributes: ['code', 'name'],
            }
        ],
    });
    //check if there are consommations PDR
    if (consommation.length < 1) {
        return next(new CustomError('Aucune consommation PDR trouvée', 404));
    }
    res.status(200).json(consommation);
});
//create consommation pdr
const CreateConsommation = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { piece, quantity, agent } = req.body;
    // Validate required fields
    if ([code, piece, agent].some(field => !field || validator.isEmpty(field.toString()))) {
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

    //check if the panne is submitted to second scan
    if(!existingPanne.technician && !existingPanne.tempInitial){
        return next(new CustomError('La panne n\'a pas encore été soumise au deuxième scan', 400));
    }

    //check if the panne is already closed
    if(existingPanne.dateReparation){
        return next(new CustomError('La panne est déjà clôturée, vous ne pouvez pas ajouter une nouveau consommation PDR', 400));
    }

    //check if piece exists
    const existingPiece = await PieceService.findPieceByCode(piece);
    if(!existingPiece){
        return next(new CustomError('Piece non trouvée', 404));
    }

    //check if consommation exists for the panne
    const consommationExists = await ConsommationService.findConsommationByPanneAndPiece(existingPanne.id, existingPiece.id);
    if(consommationExists){
        return next(new CustomError(`${existingPiece.name} est déjà consommée vous pouvez juste changer la quantite consommée`, 400));
    }

    // Generate a unique code for the family
    const codeCS = await generateUniqueCode("CS", 6, Consommation);
    if (!codeCS) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    const newConsommation = await Consommation.create({
        code: codeCS,
        panne: existingPanne.id,
        piece: existingPiece.id,
        quantity
    });
    // Check if the new consommation PDR was created successfully
    if (!newConsommation) {
        return next(new CustomError('Un problème est survenu lors de la création du consommation PDR, veuillez réessayer.', 400));
    }
    // Respond with success message
    res.status(200).json({ message: 'Consommation PDR a été créée avec succès' });
});
//update consommation pdr corrective
const UpdateConsommation = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { piece, quantity } = req.body;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //Validate one of the optional fields
    if ([piece, quantity].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Au moins un des champs optionnels doit être rempli', 400));
    }

    //check if piece corrective exists
    const existingConsommation = await ConsommationService.findConsommationByCode(code);
    if(!existingConsommation){
        return next(new CustomError('Consommation PDR non trouvée', 404));
    }

    //check if piece exists
    if(piece){
        const existingPiece = await PieceService.findPieceByCode(piece);
        if(!existingPiece){
            return next(new CustomError('Piece non trouvée', 404));
        }
        //check if consommation exists for the panne
        const consommationExists = await ConsommationService.findConsommationByPanneAndPiece(existingConsommation.panne, existingPiece.id);
        if(consommationExists){
            return next(new CustomError(`${existingPiece.name} est déjà consommée vous pouvez juste changer la quantite consommée`, 400));
        }
        //update piece
        existingConsommation.piece = existingPiece.id;
    }

    //update consommation PDR
    if(quantity) existingConsommation.quantity = quantity;

    // Save the updated consommation PDR
    const updatedConsommation = await existingConsommation.save();

    // Check if the consommation PDR was updated successfully
    if (!updatedConsommation) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour du consommation PDR, veuillez réessayer.', 400));
    }
    // Respond with success message
    res.status(200).json({ message: 'Consommation PDR a été modifiée avec succès' });
});
//delete consommation PDR
const DeleteConsommation = asyncErrorHandler(async (req, res, next) => {
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

    //check if consommation PDR exists
    const existingConsommation = await ConsommationService.findConsommationByCode(code);
    if(!existingConsommation){
        return next(new CustomError('Consommation PDR non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneById(existingConsommation.panne);
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

    //delete consommation PDR
    const deletedConsommation = await existingConsommation.destroy();

    // Check if the consommation PDR was deleted successfully
    if (!deletedConsommation) {
        return next(new CustomError('Un problème est survenu lors de la suppression de l\'consommation PDR, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'L\'consommation PDR a été supprimée avec succès' });
});

module.exports = {
    GetAllConsommationsByPanne,
    CreateConsommation,
    UpdateConsommation,
    DeleteConsommation
}

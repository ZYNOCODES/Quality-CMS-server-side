const Piece = require('../model/PieceModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const ConsommationService = require('../service/ConsommationService.js');

//get all Pieces
const GetAllPieces = asyncErrorHandler(async (req, res, next) => {
    const Pieces = await Piece.findAll();
    //check if there are Pieces
    if (Pieces.length < 1) {
        return next(new CustomError('Aucune piece trouvée', 404));
    }
    res.status(200).json(Pieces);
});
//create a new Piece
const CreatePiece = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;

    // Check if the name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Generate a unique code for the Piece
    const code = await generateUniqueCode("PC", 4, Piece);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // Check if the Piece name already exists
    const existingName = await Piece.findOne({
        where: {
            name
        },
    });
    if (existingName) {
        return next(new CustomError('Le nom de cette piece existe déjà', 400));
    }

    // Create a new Piece
    const newPiece = await Piece.create({
        code,
        name
    });

    // Check if the new Piece was created successfully
    if (!newPiece) {
        return next(new CustomError('Un problème est survenu lors de la création d\'une piece, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Piece créée avec succès' });
});
//update Piece
const UpdatePiece = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { name } = req.body;
    //check if name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Piece exists
    const existPiece = await Piece.findOne({
        where: {
            code
        },
    });
    if (!existPiece) {
        return next(new CustomError('Piece non trouvée', 404));
    }
    //update Piece
    if(name) existPiece.name = name;
    const updatedPiece = await existPiece.save();
    //check if Piece is updated
    if (!updatedPiece) {
        return next(new CustomError('Un problème est survenu lors de la mettre à jour d\'une piece, veuillez réessayer.', 400));

    }
    res.status(200).json({ message: 'Piece mise à jour avec succès' });
});
//delete Piece
const DeletePiece = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Piece exists
    const existPiece = await Piece.findOne({
        where: {
            code
        },
    });
    if (!existPiece) {
        return next(new CustomError('Piece non trouvée', 404));
    }
    //check if there is consommation related to this Piece
    const Consommation = await ConsommationService.findConsommationByPiece(existPiece.id);
    if(Consommation){
        return next(new CustomError('Vous ne pouvez pas supprimer cette piece car elle est liée à une piece consommable existante.', 400));
    }
    //deletec Piece
    const deletedPiece = await existPiece.destroy();
    //check if Piece is updated
    if (!deletedPiece) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'une piece, veuillez réessayer.', 400));
    }
    res.status(200).json({ message: 'Piece supprimée avec succès' });
});

module.exports = {
    GetAllPieces,
    CreatePiece,
    UpdatePiece,
    DeletePiece
}
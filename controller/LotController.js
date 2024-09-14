const Lot = require('../model/LotModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const ProductService = require('../service/ProductService.js');
const LotService = require('../service/LotService.js');

//get all Lots
const GetAllLots = asyncErrorHandler(async (req, res, next) => {
    const Lots = await Lot.findAll();
    //check if there are Lots
    if (Lots.length < 1) {
        return next(new CustomError('Aucun lot trouvée', 404));
    }
    res.status(200).json(Lots);
});
//create a new Lot
const CreateLot = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;

    // Check if the name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Generate a unique code for the Lot
    const code = await generateUniqueCode("L", 4, Lot);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // Check if the Lot name already exists
    const existingName = await LotService.findLotByName(name);
    if (existingName) {
        return next(new CustomError('Le nom du lot existe déjà', 400));
    }

    // Create a new Lot
    const newLot = await Lot.create({
        code,
        name
    });

    // Check if the new Lot was created successfully
    if (!newLot) {
        return next(new CustomError('Un problème est survenu lors de la création d\'un lot, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Lot créée avec succès' });
});
//update Lot
const UpdateLot = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { name } = req.body;
    //check if name is provided
    if (!name || validator.isEmpty(name) ||
        !code || validator.isEmpty(code)
    ) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Lot exists
    const existLot = await Lot.findOne({
        where: {
            code
        }
    });
    if (!existLot) {
        return next(new CustomError('Lot non trouvée', 404));
    }

    // Check if the Lot name already exists
    const existingName = await LotService.findLotByName(name);
    if (existingName) {
        return next(new CustomError('Le nom du lot existe déjà', 400));
    }

    //update Lot
    existLot.name = name;
    //save Lot
    const updatedLot = await existLot.save();
    //check if Lot is updated
    if (!updatedLot) {
        return next(new CustomError('Un problème est survenu lors de la mettre à jour d\'un lot, veuillez réessayer.', 400));
    }

    res.status(200).json({ message: 'Lot mise à jour avec succès' });
});
//delete Lot
const DeleteLot = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Lot exists
    const existingLot = await Lot.findOne({
        where: {
            code
        }
    });
    if (!existingLot) {
        return next(new CustomError('Lot non trouvée', 404));
    }
    //check if there is Products related to this Lot
    const product = await ProductService.findProductByLot(existingLot.id);
    if(product){
        return next(new CustomError('Veuillez libérer tous les produits liés à ce lot avant de pouvoir le supprimer.', 400));
    }
    //deletec Lot
    const deletedLot = await existingLot.destroy();
    //check if Lot is updated
    if (!deletedLot) {
        return next(new CustomError('Un problème est survenu lors de la suppression du lot, veuillez réessayer.', 400));
    }

    res.status(200).json({ message: 'Lot supprimée avec succès' });
});

module.exports = {
    GetAllLots,
    CreateLot,
    UpdateLot,
    DeleteLot
}
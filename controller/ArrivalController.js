const Arrival = require('../model/ArrivalModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const ArrivalService = require('../service/ArrivalService.js');
const ProductService = require('../service/ProductService.js');

// Function to get all Arrivals
const GetAllArrivals = asyncErrorHandler(async (req, res, next) => {
    const existingArrivals = await Arrival.findAll();
    //check if there are Arrivals
    if (existingArrivals.length < 1) {
        return next(new CustomError('Aucun arrivage trouvée', 404));
    }
    res.status(200).json(existingArrivals);
});
//create a new Arrival
const CreateArrival = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;

    // Check if the name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Generate a unique code for the Arrival
    const code = await generateUniqueCode("AR", 4, Arrival);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // Check if the Arrival name already exists
    const existingName = await ArrivalService.findArrivalByName(name);
    if (existingName) {
        return next(new CustomError('Le nom du arrivage existe déjà', 400));
    }

    // Create a new Arrival
    const newArrival = await Arrival.create({
        code,
        name
    });

    // Check if the new Arrival was created successfully
    if (!newArrival) {
        return next(new CustomError('Un problème est survenu lors de la création d\'un arrivage, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Arrivage créée avec succès' });
});
//update Arrival
const UpdateArrival = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { name } = req.body;
    //check if name is provided
    if (!name || validator.isEmpty(name) ||
        !code || validator.isEmpty(code)
    ) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Arrival exists
    const existArrival = await Arrival.findOne({
        where: {
            code
        }
    });
    if (!existArrival) {
        return next(new CustomError('Arrivage non trouvée', 404));
    }

    // Check if the Arrival name already exists
    const existingName = await ArrivalService.findArrivalByName(name);
    if (existingName) {
        return next(new CustomError('Le nom du arrivage existe déjà', 400));
    }

    //update Arrival
    existArrival.name = name;
    //save Arrival
    const updatedArrival = await existArrival.save();
    //check if Arrival is updated
    if (!updatedArrival) {
        return next(new CustomError('Un problème est survenu lors de la mettre à jour d\'un arrivage, veuillez réessayer.', 400));
    }

    res.status(200).json({ message: 'Arrivage mise à jour avec succès' });
});
//delete Arrival
const DeleteArrival = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Arrival exists
    const existingArrival = await Arrival.findOne({
        where: {
            code
        }
    });
    if (!existingArrival) {
        return next(new CustomError('Arrivage non trouvée', 404));
    }
    //check if there is Products related to this Arrival
    const product = await ProductService.findProductByArrival(existingArrival.id);
    if(product){
        return next(new CustomError('Veuillez libérer tous les produits liés à ce arrivage avant de pouvoir le supprimer.', 400));
    }
    //deletec Arrival
    const deletedArrival = await existingArrival.destroy();
    //check if Arrival is updated
    if (!deletedArrival) {
        return next(new CustomError('Un problème est survenu lors de la suppression du arrivage, veuillez réessayer.', 400));
    }

    res.status(200).json({ message: 'Arrivage supprimée avec succès' });
});

module.exports = {
    GetAllArrivals,
    CreateArrival,
    UpdateArrival,
    DeleteArrival
}
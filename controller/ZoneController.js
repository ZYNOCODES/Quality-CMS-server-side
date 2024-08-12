const Zone = require('../model/ZoneModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const WorkshopService = require('../service/WorkshopService.js');
const ProductService = require('../service/ProductService.js');

//get all Zones
const GetAllZones = asyncErrorHandler(async (req, res, next) => {
    const Zones = await Zone.findAll();
    //check if there are Zones
    if (Zones.length < 1) {
        return next(new CustomError('Aucune zone trouvée', 404));
    }
    res.status(200).json(Zones);
});
//create a new Zone
const CreateZone = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;

    // Check if the name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Generate a unique code for the Zone
    const code = await generateUniqueCode("Z", 4, Zone);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // Check if the Zone name already exists
    const existingName = await Zone.findOne({
        where: {
            name
        },
    });
    if (existingName) {
        return next(new CustomError('Le nom de cette zone existe déjà', 400));
    }

    // Create a new Zone
    const newZone = await Zone.create({
        code,
        name
    });

    // Check if the new Zone was created successfully
    if (!newZone) {
        return next(new CustomError('Un problème est survenu lors de la création d\'une zone, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Zone créée avec succès' });
});
//update Zone
const UpdateZone = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { name } = req.body;
    //check if name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Zone exists
    const existZone = await Zone.findOne({
        where: {
            code
        },
    });
    if (!existZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }
    //update Zone
    if(name) existZone.name = name;
    const updatedZone = await existZone.save();
    //check if Zone is updated
    if (!updatedZone) {
        return next(new CustomError('Un problème est survenu lors de la mettre à jour d\'une zone, veuillez réessayer.', 400));

    }
    res.status(200).json({ message: 'Zone mise à jour avec succès' });
});
//delete Zone
const DeleteZone = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Zone exists
    const existZone = await Zone.findOne({
        where: {
            code
        },
    });
    if (!existZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }
    //check if there is consommation related to this Zone
    const Workshop = await WorkshopService.findWorkshopByZone(existZone.id);
    const Product = await ProductService.findProductByZone(existZone.id);
    if(Workshop || Product){
        return next(new CustomError('Vous ne pouvez pas supprimer cette zone car elle est liée à un atelier ou un produit existante.', 400));
    }
    //deletec Zone
    const deletedZone = await existZone.destroy();
    //check if Zone is updated
    if (!deletedZone) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'une zone, veuillez réessayer.', 400));
    }
    res.status(200).json({ message: 'Zone supprimée avec succès' });
});

module.exports = {
    GetAllZones,
    CreateZone,
    UpdateZone,
    DeleteZone
}
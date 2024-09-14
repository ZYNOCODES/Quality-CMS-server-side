const Family = require('../model/FamilyModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const ProductService = require('../service/ProductService.js');
const FamilyService = require('../service/FamilyService.js');

//get all families
const GetAllFamilies = asyncErrorHandler(async (req, res, next) => {
    const families = await Family.findAll();
    //check if there are families
    if (families.length < 1) {
        return next(new CustomError('Aucune famille trouvée', 404));
    }
    res.status(200).json(families);
});
//create a new family
const CreateFamily = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;

    // Check if the name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Generate a unique code for the family
    const code = await generateUniqueCode("F", 4, Family);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // Check if the family name already exists
    const existingName = await FamilyService.findFamilyByName(name);
    if (existingName) {
        return next(new CustomError('Le nom de la famille existe déjà', 400));
    }

    // Create a new family
    const newFamily = await Family.create({
        code,
        name
    });

    // Check if the new family was created successfully
    if (!newFamily) {
        return next(new CustomError('Un problème est survenu lors de la création de la famille, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Famille créée avec succès' });
});
//update family
const UpdateFamily = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { name } = req.body;
    //check if name is provided
    if (!name || validator.isEmpty(name) ||
        !code || validator.isEmpty(code)
    ) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if family exists
    const existFamily = await Family.findOne({
        where: {
            code
        }
    });
    if (!existFamily) {
        return next(new CustomError('Famille non trouvée', 404));
    }

    // Check if the family name already exists
    const existingName = await FamilyService.findFamilyByName(name);
    if (existingName) {
        return next(new CustomError('Le nom de la famille existe déjà', 400));
    }

    //update family
    existFamily.name = name;
    //save family
    const updatedFamily = await existFamily.save();
    //check if family is updated
    if (!updatedFamily) {
        return next(new CustomError('Un problème est survenu lors de la mettre à jour de la famille, veuillez réessayer.', 400));
    }
    
    res.status(200).json({ message: 'Famille mise à jour avec succès' });
});
//delete family
const DeleteFamily = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if family exists
    const family = await Family.findOne({
        where: {
            code
        }
    });
    if (!family) {
        return next(new CustomError('Famille non trouvée', 404));
    }
    //check if there is Products related to this family
    const product = await ProductService.findProductByFamily(family.id);
    if(product){
        return next(new CustomError('Veuillez libérer tous les produits liés à cette famille avant de pouvoir la supprimer.', 400));
    }
    //deletec family
    const deletedFamily = await family.destroy();
    //check if family is updated
    if (!deletedFamily) {
        return next(new CustomError('Un problème est survenu lors de la suppression de la famille, veuillez réessayer.', 400));
    }
    res.status(200).json({ message: 'Family supprimée avec succès' });
});

module.exports = {
    GetAllFamilies,
    CreateFamily,
    UpdateFamily,
    DeleteFamily
}
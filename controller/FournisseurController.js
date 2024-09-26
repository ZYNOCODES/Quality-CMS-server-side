const Fournisseur = require('../model/FournisseurModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const FournisseurService = require('../service/FournisseurService.js');
const PanneService = require('../service/PanneService.js');

//create new fournisseur
const createFournisseur = asyncErrorHandler(async (req, res, next) => {
    const { fullname } = req.body;
    //validate fullname
    if (!fullname || validator.isEmpty(fullname)) {
        return next(new CustomError('Tous les champs sont obligatoires', 400));
    }
    // Generate a unique code for the fournisseur
    const code = await generateUniqueCode("F", 4, Fournisseur);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }
    //check if the fournisseur name already exists
    const existingName = await FournisseurService.findFournisseurByName(fullname);
    if (existingName) {
        return next(new CustomError('Le nom du fournisseur existe déjà', 400));
    }

    //create fournisseur
    const fournisseur = await Fournisseur.create({ 
        code, 
        fullname 
    });
    //check if the new fournisseur was created successfully
    if (!fournisseur) {
        return next(new CustomError('Un problème est survenu lors de la création du fournisseur, veuillez réessayer.', 400));
    }
    //send response
    res.status(200).json({ message: 'Fournisseur créé avec succès' });
});
//get all fournisseurs
const getAllFournisseurs = asyncErrorHandler(async (req, res, next) => {
    const fournisseurs = await Fournisseur.findAll();
    //check if there are fournisseurs
    if (!fournisseurs || fournisseurs.length < 1) {
        return next(new CustomError('Aucun fournisseur trouvé', 404));
    }
    res.status(200).json(fournisseurs);
});
//update fournisseur
const updateFournisseur = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { fullname } = req.body;
    //check if fullname is provided
    if (!fullname || validator.isEmpty(fullname) ||
        !code || validator.isEmpty(code)
    ) {
        return next(new CustomError('Tous les champs sont obligatoires', 400));
    }
    //check if the fournisseur exists
    const fournisseur = await FournisseurService.findFournisseurByCode(code);
    if (!fournisseur) {
        return next(new CustomError('Fournisseur non trouvé', 404));
    }
    //check if the fournisseur name already exists
    const existingName = await FournisseurService.findFournisseurByName(fullname);
    if (existingName) {
        return next(new CustomError('Le nom du fournisseur existe déjà', 400));
    }

    //update fournisseur
    fournisseur.fullname = fullname;
    const updatedFournisseur = await fournisseur.save();
    //check if the fournisseur was updated successfully
    if (!updatedFournisseur) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour du fournisseur, veuillez réessayer.', 400));
    }
    //send response
    res.status(200).json({ message: 'Fournisseur mis à jour avec succès' });
});
//delete fournisseur
const deleteFournisseur = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if code is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Code du fournisseur manquant', 400));
    }
    //check if the fournisseur exists
    const fournisseur = await FournisseurService.findFournisseurByCode(code);
    if (!fournisseur) {
        return next(new CustomError('Fournisseur non trouvé', 404));
    }
    //check if the fournisseur has any pannes
    const existingPannes = await PanneService.findPanneByFournisseur(fournisseur.id);
    if (existingPannes) {
        return next(new CustomError('Impossible de supprimer le fournisseur car il a des pannes associées', 400));
    }
    //delete fournisseur
    const deletedFournisseur = await fournisseur.destroy();
    //check if the fournisseur was deleted successfully
    if (!deletedFournisseur) {
        return next(new CustomError('Un problème est survenu lors de la suppression du fournisseur, veuillez réessayer.', 400));
    }

    //send response
    res.status(200).json({ message: 'Fournisseur supprimé avec succès' });
});

module.exports = {
    createFournisseur,
    getAllFournisseurs,
    updateFournisseur,
    deleteFournisseur
}
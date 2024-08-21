const PanneType = require('../model/PanneTypeModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const PanneService = require('../service/PanneService.js');

//get all PanneTypes
const GetAllPanneTypes = asyncErrorHandler(async (req, res, next) => {
    const PanneTypes = await PanneType.findAll();
    //check if there are PanneTypes
    if (PanneTypes.length < 1) {
        return next(new CustomError('Aucun type de panne trouvée', 404));
    }
    res.status(200).json(PanneTypes);
});
//create a new PanneType
const CreatePanneType = asyncErrorHandler(async (req, res, next) => {
    const { name } = req.body;

    // Check if the name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Generate a unique code for the PanneType
    const code = await generateUniqueCode("PT", 4, PanneType);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }

    // Check if the PanneType name already exists
    const existingName = await PanneType.findOne({
        where: {
            name
        },
    });
    if (existingName) {
        return next(new CustomError('Le nom de ce type de panne existe déjà', 400));
    }

    // Create a new PanneType
    const newPanneType = await PanneType.create({
        code,
        name,
    });

    // Check if the new PanneType was created successfully
    if (!newPanneType) {
        return next(new CustomError('Un problème est survenu lors de la création d\'une type de panne, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Type de panne créée avec succès' });
});
//update PanneType
const UpdatePanneType = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { name } = req.body;
    //check if name is provided
    if (!name || validator.isEmpty(name)) {
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }
    //check if PanneType exists
    const existPanneType = await PanneType.findOne({
        where: {
            code
        },
    });
    if (!existPanneType) {
        return next(new CustomError('Type de panne non trouvée', 404));
    }
    // Check if the PanneType name already exists
    const existingName = await PanneType.findOne({
        where: {
            name
        },
    });
    if (existingName) {
        return next(new CustomError('Le nom de ce type de panne existe déjà', 400));
    }

    //update PanneType
    if(name) existPanneType.name = name;
    //save
    const updatedPanneType = await existPanneType.save();
    
    //check if PanneType is updated
    if (!updatedPanneType) {
        return next(new CustomError('Un problème est survenu lors de la mettre à jour d\'un type de panne, veuillez réessayer.', 400));

    }
    res.status(200).json({ message: 'Type de panne mise à jour avec succès' });
});
//delete PanneType
const DeletePanneType = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if PanneType exists
    const existPanneType = await PanneType.findOne({
        where: {
            code
        },
    });
    if (!existPanneType) {
        return next(new CustomError('Type de panne non trouvée', 404));
    }
    //check if there is pannes are related to this PanneType
    const existingPanne = await PanneService.findPanneByPanneType(existPanneType.id);

    if(existingPanne){
        return next(new CustomError('Vous ne pouvez pas supprimer ce type de panne car elle est liée à une panne existante.', 400));
    }

    //deletec PanneType
    const deletedPanneType = await existPanneType.destroy();
    //check if PanneType is deleted
    if (!deletedPanneType) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'un type de panne, veuillez réessayer.', 400));
    }
    res.status(200).json({ message: 'Type de panne supprimée avec succès' });
});

module.exports = {
    GetAllPanneTypes,
    CreatePanneType,
    UpdatePanneType,
    DeletePanneType
}
const Technician = require('../model/TechnicianModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const ZoneService = require('../service/ZoneService.js');
const PanneService = require('../service/PanneService.js');
const Zone = require('../model/ZoneModel.js');


// Create a new Technician
const CreateTechnician = asyncErrorHandler(async (req, res, next) => {
    const { fullname, zone } = req.body;
    // Check if all required fields are provided
    if (validator.isEmpty(fullname) || validator.isEmpty(zone)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Check if zone is valid
    const zoneExists = await ZoneService.findZoneByCode(zone);
    if (!zoneExists) {
        return next(new CustomError('Zone invalide', 400));
    }

    //check if name exists
    const nameCheck = await Technician.findOne({
        where:{
            fullname
        }
    });
    if (nameCheck) {
        return next(new CustomError('Nom de technicien déjà utilisé', 400));
    }


    // Generate a unique code for the technician
    const code = await generateUniqueCode('T', 8, Technician);
    // Create the technician
    const technician = await Technician.create({
        code,
        fullname,
        zone: zoneExists.id
    });

    //check if technician is created
    if (!technician) {
        return next(new CustomError('Erreur lors de la création d\'un technicien, réessayez', 400));
    }

    // Return the created technician
    res.status(200).json({ message: 'Technicien créé avec succès' });
});
// Get all Technicians
const GetAllTechnicians = asyncErrorHandler(async (req, res, next) => {
    const technicians = await Technician.findAll({
        include: [
            {
                model: Zone,
                as: 'zoneAssociation'
            }
        ]
    });
    //check if technicians are found
    if (!technicians || technicians.length <= 0) {
        return next(new CustomError('Aucun technicien trouvé', 404));
    }
    // Return
    res.status(200).json(technicians);
});
// Get a Technician by zone
const GetTechnicianByZone = asyncErrorHandler(async (req, res, next) => {
    const { zone } = req.params;
    // Check if zone is provided
    if (!zone) {
        return next(new CustomError('Zone non fournie', 400));
    }
    // Check if zone is valid
    const zoneExists = await ZoneService.findZoneByCode(zone);
    if (!zoneExists) {
        return next(new CustomError('Zone invalide', 400));
    }
    const technicians = await Technician.findAll({
        where: {
            zone: zoneExists.id
        },
        include: [
            {
                model: Zone,
                as: 'zoneAssociation'
            }
        ]
    });
    //check if technicians are found
    if (!technicians || technicians.length <= 0) {
        return next(new CustomError('Aucun technicien trouvé', 404));
    }
    // Return
    res.status(200).json(technicians);
});
//update specific user
const UpdateTechnician = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { fullname, zone } = req.body;
    //check if name is provided
    if(!code || validator.isEmpty(code)){
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }
    if ([fullname, zone].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }

    // Find the Technician
    const existinguser = await Technician.findOne({
        where:{
            code
        }
    })

    // Check if the user exists
    if (!existinguser) {
        return next(new CustomError('Technician non trouvé', 404));
    }

    // Update the user
    if(fullname){
        //check if name exists
        const nameCheck = await Technician.findOne({
            where:{
                fullname
            }
        });
        if (nameCheck) {
            return next(new CustomError('Nom de technicien déjà utilisé', 400));
        }
        existinguser.fullname = fullname;
    }
    if(zone) {
        const existingZone = await ZoneService.findZoneByCode(zone);
        if (!existingZone) {
            return next(new CustomError('Zone non trouvée', 404));
        }
        existinguser.zone = existingZone.id;
    }

    const updatedUser = await existinguser.save();

    // Check if the user was updated successfully
    if (!updatedUser) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour d\'un technician, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Technician mis à jour avec succès' });
});
//delete specific user
const DeleteTechnician = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if(!code || validator.isEmpty(code)){
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }

    // Find the user by code if its start with AA its an Technician
    // otherwise its a technician if start with T 
    const existinguser = await Technician.findOne({
        where:{
            code
        }
    });
    // Check if the user exists
    if (!existinguser) {
        return next(new CustomError('Technician non trouvé', 404));
    }
    //check if there is no panne related to this Technician
    const Panne = await PanneService.findPanneByTechnician(existinguser.id);
    if(Panne){
        return next(new CustomError('Vous ne pouvez pas supprimer ce technician car il est liée à une panne existante.', 400));
    }

    //delete
    const deletedUser = await existinguser.destroy();

    // Check if the user was deleted successfully
    if (!deletedUser) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'un technician, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Technician a été supprimé avec succès' });
});


module.exports = {
    CreateTechnician,
    GetAllTechnicians,
    GetTechnicianByZone,
    UpdateTechnician,
    DeleteTechnician
}
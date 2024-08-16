const Workshop = require('../model/WorkshopModel.js');
const Zone = require('../model/ZoneModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const PanneService = require('../service/PanneService.js');
const ZoneService = require('../service/ZoneService.js');
const WorkshopService = require('../service/WorkshopService.js');

//get all Workshops
const GetAllWorkshops = asyncErrorHandler(async (req, res, next) => {
    const Workshops = await Workshop.findAll({
        include: [
            {
                model: Zone,
                as: 'zoneAssociation'
            }
        ]
    });
    //check if there are Workshops
    if (Workshops.length < 1) {
        return next(new CustomError('Aucune atelier trouvée', 404));
    }
    res.status(200).json(Workshops);
});
//get all Workshops by zone
const GetAllWorkshopsByZone = asyncErrorHandler(async (req, res, next) => {
    const { zone } = req.params;
    //check if the zone is provided
    if ([zone].some(field => !field || validator.isEmpty(field))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if zone exists
    const existZone = await ZoneService.findZoneByCode(zone);
    if (!existZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }
    //get all Products
    const Workshops = await Workshop.findAll({
        where: {
            zone: existZone.id
        },
        include: [
            {
                model: Zone,
                as: 'zoneAssociation'
            }
        ]
    });
    //check if there are Workshops
    if (Workshops.length < 1) {
        return next(new CustomError('Aucune atelier trouvée', 404));
    }
    res.status(200).json(Workshops);
});
//create a new Workshop
const CreateWorkshop = asyncErrorHandler(async (req, res, next) => {
    const { name, zone } = req.body;

    // Check if the name is provided
    if (!name || validator.isEmpty(name) ||
        !zone || validator.isEmpty(zone)
    ) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Generate a unique code for the Workshop
    const code = await generateUniqueCode("W", 4, Workshop);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }
    //check if zone exists
    const existZone = await ZoneService.findZoneByCode(zone);
    if (!existZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }
    // Check if the Workshop name already exists
    const existingName = await Workshop.findOne({
        where: {
            name,
            zone: existZone.id
        },
    });
    if (existingName) {
        return next(new CustomError(`Le nom de ce atelier existe déjà dans la zone de ${existZone.name}`, 400));
    }

    // Create a new Workshop
    const newWorkshop = await Workshop.create({
        code,
        zone: existZone.id,
        name
    });

    // Check if the new Workshop was created successfully
    if (!newWorkshop) {
        return next(new CustomError('Un problème est survenu lors de la création d\'un atelier, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Atelier créée avec succès' });
});
//update Workshop
const UpdateWorkshop = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { name, zone } = req.body;
    //check if name is provided
    if ((!name || validator.isEmpty(name)) && (!zone || validator.isEmpty(zone))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }
    //check if Workshop exists
    const existWorkshop = await WorkshopService.findWorkshopByCode(code);
    if (!existWorkshop) {
        return next(new CustomError('Atelier non trouvée', 404));
    }

    if(zone) {
        //check if zone exists
        const existingZone = await ZoneService.findZoneByCode(zone);
        if(!existingZone){
            return next(new CustomError('Zone non trouvée', 404));
        }
        // save
        existWorkshop.zone = existingZone.id;
    }
    //update Workshop
    if(name) existWorkshop.name = name;
    const updatedWorkshop = await existWorkshop.save();
    //check if Workshop is updated
    if (!updatedWorkshop) {
        return next(new CustomError('Un problème est survenu lors de la mettre à jour d\'un atelier, veuillez réessayer.', 400));

    }
    res.status(200).json({ message: 'Atelier mise à jour avec succès' });
});
//delete Workshop
const DeleteWorkshop = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if Workshop exists
    const existWorkshop = await Workshop.findOne({
        where: {
            code
        },
    });
    if (!existWorkshop) {
        return next(new CustomError('Atelier non trouvée', 404));
    }
    //check if there is consommation related to this Workshop
    const Panne = await PanneService.findPanneByWorkshop(existWorkshop.id);
    if(Panne){
        return next(new CustomError('Vous ne pouvez pas supprimer ce atelier car elle est liée à une panne existante.', 400));
    }
    //deletec Workshop
    const deletedWorkshop = await existWorkshop.destroy();
    //check if Workshop is updated
    if (!deletedWorkshop) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'une Workshop, veuillez réessayer.', 400));
    }
    res.status(200).json({ message: 'Workshop supprimée avec succès' });
});

module.exports = {
    GetAllWorkshops,
    GetAllWorkshopsByZone,
    CreateWorkshop,
    UpdateWorkshop,
    DeleteWorkshop
}
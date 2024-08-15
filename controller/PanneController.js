const sequelize = require('../config/Database.js');
const validator = require('validator');
const Panne = require('../model/PanneModel.js');
const Product = require('../model/ProductModel.js');
const Workshop = require('../model/WorkshopModel.js');
const Technician = require('../model/TechnicianModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const { generateUniqueCode } = require('../util/Codification.js');
const FamilyService = require('../service/FamilyService.js');
const TechnicianService = require('../service/TechnicienService.js');
const ProductService = require('../service/ProductService.js');
const WorkshopService = require('../service/WorkshopService.js');
const ZoneService = require('../service/ZoneService.js');
const PanneService = require('../service/PanneService.js');
const ConsommationService = require('../service/ConsommationService.js');
const ActionCorrectiveService = require('../service/ActionCorrectiveService.js');
const moment = require('moment');
require('moment-timezone');

// first panne step
const firstPanneStep = asyncErrorHandler(async (req, res, next) => {
    const { marque, model, sn, lot, family, workshop, fournisseur, panne, ligne } = req.body;

    // Validate required fields
    if ([ marque, model, sn, lot, family, workshop, fournisseur, panne, ligne].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Validate existence of related entities
        const [existingFamily , existingWorkshop] = await Promise.all([
            FamilyService.findFamilyById(family),
            WorkshopService.findWorkshopById(workshop)
        ]);

        if (!existingFamily) throw new CustomError('Famille non trouvée', 404);
        if (!existingWorkshop) throw new CustomError('Atelier non trouvé', 404);

        // Check if the Product already exists
        let product = await ProductService.findProductByModel(model);

        if (!product) {
            // Generate a unique code for the product
            const code = await generateUniqueCode("P", 6, Product);
            if (!code) throw new CustomError('Un problème est survenu, veuillez réessayer.', 400);

            // Create a new Product
            product = await Product.create({
                code,
                marque,
                model,
                lot,
                family: existingFamily.id,
                zone: existingWorkshop.zone
            }, { transaction });

            if (!product) throw new CustomError('Un problème est survenu lors de la création d\'un produit, veuillez réessayer.', 400);
        }

        // Get the current date and time
        const dateDeclaration = moment().tz("Africa/Algiers").format('YYYY-MM-DD HH:mm:ss');

        // Generate a unique code for the product
        const code = await generateUniqueCode("PN", 6, Panne);
        if (!code) throw new CustomError('Un problème est survenu, veuillez réessayer.', 400);

        // Create a new Panne
        const newPanne = await Panne.create({
            code,
            dateDeclaration,
            fournisseur,
            sn,
            panne,
            ligne,
            product: product.id,
            workshop: existingWorkshop.id
        }, { transaction });

        if (!newPanne) throw new CustomError('Un problème est survenu lors de la création d\'une panne, veuillez réessayer.', 400);

        // Commit the transaction
        await transaction.commit();

        // Send the response message
        res.status(200).json({ message: 'Panne créée avec succès' });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        return next(error);
    }
});
// get all pannes by technician
const getAllPannesByTechnician = asyncErrorHandler(async (req, res, next) => {
    console.log('*************************getAllPannesByTechnician*************************');

    const { code } = req.params;

    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the technician exists
    const existingTechnician = await TechnicianService.findTechnicianByCode(code);
    if (!existingTechnician) {
        return next(new CustomError('Technicien non trouvé', 404));
    }

    // Get all pannes by technician
    const pannes = await Panne.findAll({
        where: {
            technician: existingTechnician.id
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['marque', 'model', 'lot'],
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            }
        ],
    })

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }

    // Respond with the pannes
    res.status(200).json(pannes);
});
// get all pannes by zone
const getAllPannesByZone = asyncErrorHandler(async (req, res, next) => {
    console.log('*************************getAllPannesByZone*************************');

    const { code } = req.params;

    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the zone exists
    const existingZone = await ZoneService.findZoneByCode(code);
    if (!existingZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }

    // get all workshops related to zone
    const existingWorkshops = await WorkshopService.findAllWorkshopsByZone(existingZone.id);
    if (existingWorkshops.length <= 0) {
        return next(new CustomError('Aucun atelier trouvée dans cette zone', 404));
    }
    
    // Extract workshop IDs
    const workshopIds = existingWorkshops.map(workshop => workshop.id);

    // Get all pannes by zone
    const pannes = await Panne.findAll({
        where: {
            workshop: workshopIds,
            technician: null
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['code', 'marque', 'model', 'lot'],
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            }
        ]
    })

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }

    // Respond with the pannes
    res.status(200).json(pannes);
});
// second panne step
const secondPanneStep = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { codeT } = req.body;
    // Validate required fields
    if ([code, codeT].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if technician exists
    const existingTechnician = await TechnicianService.findTechnicianByCode(codeT);
    if(!existingTechnician){
        return next(new CustomError('Technician non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if the panne is already assigned to a technician
    if(existingPanne.technician){
        return next(new CustomError('Cette panne est déjà assignée à un technicien', 400));
    }

    // Get the current date and time
    const dateDeclaration = moment().tz("Africa/Algiers").format('YYYY-MM-DD HH:mm:ss');
    
    //update the panne 
    existingPanne.technician = existingTechnician.id;
    existingPanne.tempInitial = dateDeclaration;

    //save the updated panne
    const updatedPanne = await existingPanne.save();

    //check if the panne was updated successfully
    if (!updatedPanne) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour du panne, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Panne mis à jour avec succès' });
});
// third panne step
const thirdPanneStep = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { source, etat, liberation, DateLiberation } = req.body;
    // Validate required fields
    if ([code, source, etat, DateLiberation].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if the panne is submitted to second scan
    if(!existingPanne.technician && !existingPanne.tempInitial){
        return next(new CustomError('La panne n\'a pas encore été soumise au deuxième scan', 400));
    }
    
    //update the panne 
    if (source) existingPanne.source = source;
    if (etat) existingPanne.etat = etat;
    existingPanne.liberation = liberation;
    if (DateLiberation) existingPanne.dateLibiration = DateLiberation;
    //save the updated panne
    const updatedPanne = await existingPanne.save();

    //check if the panne was updated successfully
    if (!updatedPanne) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour du panne, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Panne mis à jour avec succès' });
});
// fourth panne step
const fourthPanneStep = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    // Validate required fields
    if ([code].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if the panne is submitted to second scan
    if(!existingPanne.technician && !existingPanne.tempInitial){
        return next(new CustomError('La panne n\'a pas encore été soumise au deuxième scan', 400));
    }

    // //make sure that the panne is ready to be closed
    // if([
    //         existingPanne.product, 
    //         existingPanne.technician,
    //         existingPanne.dateDeclaration
    //     ].some(field => !field || validator.isEmpty(field.toString()))){
    //     return next(new CustomError('Tous les champs obligatoires doivent être remplis avant de clôturé la panne', 400));
    // }

    //check if the panne is already have action corrective and consommation
    const existingConsommation = await ConsommationService.findConsommationByPanne(existingPanne.id);
    const existingActionCorrective = await ActionCorrectiveService.findActionCorrectiveByPanne(existingPanne.id);
    if(!existingConsommation || !existingActionCorrective){
        return next(new CustomError('Vous ne pouvez pas clôturer cette panne car elle n\'a pas de PDRConsome ou d\'action corrective.', 400));
    }

    //check if the panne is already closed
    if(existingPanne.dateReparation){
        return next(new CustomError('Cette panne est déjà clôturée', 400));
    }
    
    // Get the current date and time
    const dateReparation = moment().tz("Africa/Algiers").format('YYYY-MM-DD HH:mm:ss');
    //check if dateReparation is greater than existingPanne.tempInitial
    if(moment(dateReparation, "YYYY-MM-DD HH:mm:ss").isBefore(moment(existingPanne.tempInitial, "YYYY-MM-DD HH:mm:ss"))){
        return next(new CustomError('La date de réparation doit être supérieure à la date d\'intervention', 400));
    }
    // Calculate the difference in milliseconds
    let dureeInMilliseconds = moment(dateReparation, "YYYY-MM-DD HH:mm:ss").diff(moment(existingPanne.tempInitial, "YYYY-MM-DD HH:mm:ss"));

    // Convert to duration
    let duree = moment.duration(dureeInMilliseconds);

    // Format the duration to hours, minutes, and seconds
    let formattedDuree = `${Math.floor(duree.asDays())} jours, ${duree.hours()} heures, ${duree.minutes()} minutes, et ${duree.seconds()} secondes`;

    //update the panne 
    existingPanne.dateReparation = dateReparation;
    existingPanne.tempFinal = dateReparation;
    existingPanne.dureeDintervention = formattedDuree;

    //save the updated panne
    const updatedPanne = await existingPanne.save();

    //check if the panne was updated successfully
    if (!updatedPanne) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour du panne, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'La panne a ete clôturé avec succès' });
});
// delete panne
const DeletePanne = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    // Validate required fields
    if ([code].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if there is consommation and actioncorrective related to this panne
    const existingConsommation = await ConsommationService.findConsommationByPanne(existingPanne.id);
    const existingActionCorrective = await ActionCorrectiveService.findActionCorrectiveByPanne(existingPanne.id);
    if(existingConsommation || existingActionCorrective){
        return next(new CustomError('Vous ne pouvez pas supprimer cette panne car elle est liée à un PDRConsome ou une action corrective existante.', 400));
    }
    //deletec Panne
    const deletedPanne = await existingPanne.destroy();
    //check if Panne is deleted
    if (!deletedPanne) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'une panne, veuillez réessayer.', 400));
    }
    res.status(200).json({ message: 'Panne supprimée avec succès' });
});
// get pannes by product
const GetPannesByProduct = asyncErrorHandler(async (req, res, next) => {
    console.log('*************************GetPannesByProduct*************************');
    const { code } = req.params;

    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the product exists
    const existingProduct = await ProductService.findProductByCode(code);
    if (!existingProduct) {
        return next(new CustomError('Produit non trouvé', 404));
    }

    // Get all pannes by product
    const pannes = await Panne.findAll({
        where: {
            product: existingProduct.id
        },
        include: [
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['code', 'fullname'],
            }
        ]
    })

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }

    // Respond with the pannes
    res.status(200).json(pannes);
});

module.exports = {
    firstPanneStep,
    getAllPannesByTechnician,
    getAllPannesByZone,
    secondPanneStep,
    thirdPanneStep,
    fourthPanneStep,
    DeletePanne,
    GetPannesByProduct
}
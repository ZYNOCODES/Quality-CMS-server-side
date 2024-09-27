const sequelize = require('../config/Database.js');
const { Op } = require('sequelize');
const validator = require('validator');
const Panne = require('../model/PanneModel.js');
const Product = require('../model/ProductModel.js');
const Arrival = require('../model/ArrivalModel.js');
const Workshop = require('../model/WorkshopModel.js');
const Technician = require('../model/TechnicianModel.js');
const Agent = require('../model/AccessAgentModel.js');
const Family = require('../model/FamilyModel');
const Zone = require('../model/ZoneModel');
const Lot = require('../model/LotModel');
const Fournisseur = require('../model/FournisseurModel.js');
const PanneTypeAssignment = require('../model/PanneTypeAssignmentModel.js');
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
const PanneTypeService = require('../service/PanneTypeService.js');
const UserService = require('../service/UsersService.js');
const PanneTypeAssignmentService = require('../service/PanneTypeAssignmentService.js');
const AgentUpdateActionsService = require('../service/AgentUpdateActionsService.js');
const LotService = require('../service/LotService.js');
const ArrivalService = require('../service/ArrivalService.js');
const FournisseurService = require('../service/FournisseurService.js');
const RepairtimeService = require('../service/RepairtimeService.js');
const utilMoment = require('../util/Moment.js');
const moment = require('moment');
require('moment-timezone');

// get all pannes by technician
const getAllPannesByTechnician = asyncErrorHandler(async (req, res, next) => {
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
            technician: existingTechnician.id,
            dateReparation: null
        },
        include: [
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Agent,
                as: 'agentAssociation',
                attributes: ['code', 'fullname'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            }
        ],
    })

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }
    // Fetch total repair time for each panne
    const pannesWithDetails = await Promise.all(pannes.map(async (panne) => {

        const totalRepairTime = await RepairtimeService.getAllRepairetimesByPanne(panne.id);

        return {
            ...panne.toJSON(),
            dureeDintervention: totalRepairTime
        };
    }));

    // Respond with the pannes and their associated details
    res.status(200).json(pannesWithDetails);
});
// get all archive pannes by technician
const getAllArchivePannesByTechnician = asyncErrorHandler(async (req, res, next) => {
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
            technician: existingTechnician.id,
            dateReparation: { [Op.ne]: null }
        },
        include: [
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Agent,
                as: 'agentAssociation',
                attributes: ['code', 'fullname'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            }
        ],
    })

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }
    // Fetch total repair time for each panne
    const pannesWithDetails = await Promise.all(pannes.map(async (panne) => {

        const totalRepairTime = await RepairtimeService.getAllRepairetimesByPanne(panne.id);

        return {
            ...panne.toJSON(),
            dureeDintervention: totalRepairTime
        };
    }));

    // Respond with the pannes and their associated details
    res.status(200).json(pannesWithDetails);
});
// get all pannes
const getAllPannes = asyncErrorHandler(async (req, res, next) => {
    // Get all pannes by zone
    const pannes = await Panne.findAll({
        where: {
            technician: null,
            dateReparation: null
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['marque', 'model', 'lot', 'tailleLot', 'family', 'zone', 'arrival'],
                include: [
                    {
                        model: Family,
                        as: 'familyAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Zone,
                        as: 'zoneAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Agent,
                as: 'agentAssociation',
                attributes: ['code', 'fullname'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
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
// get specific panne
const getSpecificPanne = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;

    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if panne exists
    const existingPanne = await Panne.findOne({
        where:{
            code
        },
        include: [
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['code', 'fullname']
            },
            {
                model: Agent,
                as: 'agentAssociation',
                attributes: ['code', 'fullname'],
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name']
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            },
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['code', 'marque', 'model', 'lot', 'tailleLot', 'family', 'zone', 'arrival'],
                include: [
                    {
                        model: Family,
                        as: 'familyAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Zone,
                        as: 'zoneAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            
        ]
    })
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    const totalRepairTime = await RepairtimeService.getAllRepairetimesByPanne(existingPanne.id);

    // Construct the panne response with the total repair time
    const panne = {
        ...existingPanne.toJSON(),
        dureeDintervention: totalRepairTime
    };

    // Respond with the panne and its details
    res.status(200).json(panne);
});
// get all pannes by Agent
const getAllPannesByAgent = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;

    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(code);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    // Get all pannes by Agent
    const pannes = await Panne.findAll({
        where: {
            agent: existingAgent.id,
            technician: null,
            dateReparation: null
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['marque', 'model', 'lot', 'tailleLot', 'family', 'zone', 'arrival'],
                include: [
                    {
                        model: Family,
                        as: 'familyAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Zone,
                        as: 'zoneAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
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
// get all taken pannes 
const getAllTakenPannes = asyncErrorHandler(async (req, res, next) => {
    // Get all pannes by zone
    const pannes = await Panne.findAll({
        where: {
            technician: { [Op.ne]: null },
            dateReparation: null
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['lot', 'arrival', 'model'],
                include: [
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['fullname'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            }
            
        ]
    });

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }

    // Fetch panne types for each panne
    const pannesWithDetails = await Promise.all(pannes.map(async (panne) => {

        const typePannes = await PanneTypeAssignmentService.findAllPanneTypeAssignmentByPanne(panne.id);
        const typePannesNames = typePannes.map(c => c.typepanneAssociation.name);

        return {
            ...panne.toJSON(),
            typePannesNames
        };
    }));

    // Respond with the pannes and their associated details
    res.status(200).json(pannesWithDetails);

});
// get all taken pannes by Agent
const getAllTakenPannesByAgent = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;

    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(code);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    // Get all pannes by zone
    const pannes = await Panne.findAll({
        where: {
            agent: existingAgent.id,
            technician: { [Op.ne]: null },
            dateReparation: null
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['lot', 'arrival', 'model'],
                include: [
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['fullname'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            }
            
        ]
    });

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }

    
    // Fetch panne types for each panne
    const pannesWithDetails = await Promise.all(pannes.map(async (panne) => {

        const typePannes = await PanneTypeAssignmentService.findAllPanneTypeAssignmentByPanne(panne.id);
        const typePannesNames = typePannes.map(c => c.typepanneAssociation.name);

        return {
            ...panne.toJSON(),
            typePannesNames
        };
    }));

    // Respond with the pannes and their associated details
    res.status(200).json(pannesWithDetails);
});
// get all clotured pannes
const getAllCloturedPannes = asyncErrorHandler(async (req, res, next) => {
    // Get all pannes by zone
    const pannes = await Panne.findAll({
        where: {
            technician: { [Op.ne]: null },
            dateReparation: { [Op.ne]: null },
            livraison: true
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['marque', 'model', 'lot', 'tailleLot', 'family', 'zone', 'arrival'],
                include: [
                    {
                        model: Family,
                        as: 'familyAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Zone,
                        as: 'zoneAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['fullname'],
            },
            {
                model: Agent,
                as: 'agentAssociation',
                attributes: ['code', 'fullname'],
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            }
            
        ]
    });

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }
    // Fetch corrective actions and consumed pieces for each panne
    const pannesWithDetails = await Promise.all(pannes.map(async (panne) => {
        const correctiveActions = await ActionCorrectiveService.findAllActionCorrectiveByPanne(panne.id); 
        const correctiveActionNames = correctiveActions.map(ca => ca.actionAssociation.name);

        const consommations = await ConsommationService.findAllConsommationByPanne(panne.id);
        const consommationNames = consommations.map(c => c.pieceAssociation.name);

        const typePannes = await PanneTypeAssignmentService.findAllPanneTypeAssignmentByPanne(panne.id);
        const typePannesNames = typePannes.map(c => c.typepanneAssociation.name);

        
        const totalRepairTime = await RepairtimeService.getAllRepairetimesByPanne(panne.id);

        return {
            ...panne.toJSON(),
            correctiveActionNames,
            consommationNames,
            typePannesNames,
            dureeDintervention: totalRepairTime
        };
    }));

    // Respond with the pannes and their associated details
    res.status(200).json(pannesWithDetails);
});
// get all clotured pannes by Agent
const getAllCloturedPannesByAgent = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;

    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(code);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    // Get all pannes by zone
    const pannes = await Panne.findAll({
        where: {
            agent: existingAgent.id,
            technician: { [Op.ne]: null },
            dateReparation: { [Op.ne]: null },
            livraison: true
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['marque', 'model', 'lot', 'tailleLot', 'family', 'zone', 'arrival'],
                include: [
                    {
                        model: Family,
                        as: 'familyAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Zone,
                        as: 'zoneAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['fullname'],
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            }
            
        ]
    });

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }

    // Fetch corrective actions and consumed pieces for each panne
    const pannesWithDetails = await Promise.all(pannes.map(async (panne) => {
        const correctiveActions = await ActionCorrectiveService.findAllActionCorrectiveByPanne(panne.id); 
        const correctiveActionNames = correctiveActions.map(ca => ca.actionAssociation.name);

        const consommations = await ConsommationService.findAllConsommationByPanne(panne.id);
        const consommationNames = consommations.map(c => c.pieceAssociation.name);

        const typePannes = await PanneTypeAssignmentService.findAllPanneTypeAssignmentByPanne(panne.id);
        const typePannesNames = typePannes.map(c => c.typepanneAssociation.name);

        const totalRepairTime = await RepairtimeService.getAllRepairetimesByPanne(panne.id);

        return {
            ...panne.toJSON(),
            correctiveActionNames,
            consommationNames,
            typePannesNames,
            dureeDintervention: totalRepairTime
        };
    }));

    // Respond with the pannes and their associated details
    res.status(200).json(pannesWithDetails);
});
// get all non delivred pannes by zone
const getAllNoneDelivredPannes = asyncErrorHandler(async (req, res, next) => {
    // Get all pannes by zone
    const pannes = await Panne.findAll({
        where: {
            technician: { [Op.ne]: null },
            dateReparation: { [Op.ne]: null },
            livraison: false
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['marque', 'model', 'lot', 'tailleLot', 'family', 'zone', 'arrival'],
                include: [
                    {
                        model: Family,
                        as: 'familyAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Zone,
                        as: 'zoneAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['fullname'],
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            }
            
        ]
    });

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }

    // Fetch corrective actions and consumed pieces for each panne
    const pannesWithDetails = await Promise.all(pannes.map(async (panne) => {
        const correctiveActions = await ActionCorrectiveService.findAllActionCorrectiveByPanne(panne.id); 
        const correctiveActionNames = correctiveActions.map(ca => ca.actionAssociation.name);

        const consommations = await ConsommationService.findAllConsommationByPanne(panne.id);
        const consommationNames = consommations.map(c => c.pieceAssociation.name);

        const typePannes = await PanneTypeAssignmentService.findAllPanneTypeAssignmentByPanne(panne.id);
        const typePannesNames = typePannes.map(c => c.typepanneAssociation.name);

        const totalRepairTime = await RepairtimeService.getAllRepairetimesByPanne(panne.id);

        return {
            ...panne.toJSON(),
            correctiveActionNames,
            consommationNames,
            typePannesNames,
            dureeDintervention: totalRepairTime
        };
    }));

    // Respond with the pannes and their associated details
    res.status(200).json(pannesWithDetails);
});
// get all non delivred pannes by Agent
const getAllNoneDelivredPannesByAgent = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;

    // Validate required fields
    if ([code].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(code);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    // Get all pannes by zone
    const pannes = await Panne.findAll({
        where: {
            agent: existingAgent.id,
            technician: { [Op.ne]: null },
            dateReparation: { [Op.ne]: null },
            livraison: false
        },
        include: [
            {
                model: Product,
                as: 'productAssociation',
                attributes: ['marque', 'model', 'lot', 'tailleLot', 'family', 'zone', 'arrival'],
                include: [
                    {
                        model: Family,
                        as: 'familyAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Zone,
                        as: 'zoneAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Lot,
                        as: 'lotAssociation',
                        attributes: ['name']
                    },
                    {
                        model: Arrival,
                        as: 'arrivalAssociation',
                        attributes: ['code', 'name']
                    }
                ]
            },
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['fullname'],
            },
            {
                model: Workshop,
                as: 'workshopAssociation',
                attributes: ['code', 'name'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
                attributes: ['code', 'fullname'],
            }
            
        ]
    });

    //check if the pannes were found
    if (!pannes || pannes.length <= 0) {
        return next(new CustomError('Aucune panne trouvée', 404));
    }

    // Fetch corrective actions and consumed pieces for each panne
    const pannesWithDetails = await Promise.all(pannes.map(async (panne) => {
        const correctiveActions = await ActionCorrectiveService.findAllActionCorrectiveByPanne(panne.id); 
        const correctiveActionNames = correctiveActions.map(ca => ca.actionAssociation.name);

        const consommations = await ConsommationService.findAllConsommationByPanne(panne.id);
        const consommationNames = consommations.map(c => c.pieceAssociation.name);

        const typePannes = await PanneTypeAssignmentService.findAllPanneTypeAssignmentByPanne(panne.id);
        const typePannesNames = typePannes.map(c => c.typepanneAssociation.name);

        const totalRepairTime = await RepairtimeService.getAllRepairetimesByPanne(panne.id);

        return {
            ...panne.toJSON(),
            correctiveActionNames,
            consommationNames,
            typePannesNames,
            dureeDintervention: totalRepairTime
        };
    }));

    // Respond with the pannes and their associated details
    res.status(200).json(pannesWithDetails);
});
// get pannes by product
const GetPannesByProduct = asyncErrorHandler(async (req, res, next) => {
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
            },
            
            {
                model: Agent,
                as: 'agentAssociation',
                attributes: ['code', 'fullname'],
            },
            {
                model: Fournisseur,
                as: 'fournisseurAssociation',
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
// first panne step
const firstPanneStep = asyncErrorHandler(async (req, res, next) => {
    const { agent } = req.params;
    const { marque, model, sn, lot, family, workshop, fournisseur, panne, ligne, arrival } = req.body;
    // Validate required fields
    if ([ agent, marque, model, sn, lot, family, workshop, fournisseur, ligne].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if panne is empty
    if(!panne || panne.length <= 0){
        return next(new CustomError('Veuillez sélectionner un type de panne', 400));
    }
    // Extract codes from panne array
    const panneCodes = panne.map(p => p.code);

    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Validate existence of related entities
        const [existingFamily , existingWorkshop , existingPanneType, existingAgent, existingLot, existingFournisseur] = await Promise.all([
            FamilyService.findFamilyByCode(family),
            WorkshopService.findWorkshopByCode(workshop),
            PanneTypeService.findAllPanneTypeByCode(panneCodes),
            UserService.findAgentByCode(agent),
            LotService.findLotByName(lot),
            FournisseurService.findFournisseurByCode(fournisseur)
        ]);
        if (!existingAgent) return next(new CustomError('Agent non trouvé', 404));
        if (!existingFamily) return next(new CustomError('Famille non trouvée', 404));
        if (!existingWorkshop) return next(new CustomError('Atelier non trouvé', 404));
        if (!existingPanneType || existingPanneType.length <= 0) return next(new CustomError('Type de panne non trouvé', 404));
        if (!existingLot) return next(new CustomError('Lot non trouvé', 404));
        if (!existingFournisseur) return next(new CustomError('Fournisseur non trouvé', 404));
        
        let existingArrival = null;
        if(arrival){
            existingArrival = await ArrivalService.findArrivalByCode(arrival);
            if (!existingArrival) {
                return next(new CustomError('Arrivée non trouvée', 404));
            }
        }

        // Check if the Product already exists
        let product = await ProductService.findProductByModelAndLot(model, existingLot.id);

        if (!product) {
            // Generate a unique code for the product
            const code = await generateUniqueCode("P", 6, Product);
            if (!code) return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));

            // Create a new Product
            product = await Product.create({
                code,
                marque,
                model,
                lot: existingLot.id,
                family: existingFamily.id,
                zone: existingWorkshop.zone,
                arrival: existingArrival ? existingArrival.id : null
            }, { transaction });

            if (!product) return next(new CustomError('Un problème est survenu lors de la création d\'un produit, veuillez réessayer.', 400));
        }

        // Get the current date and time
        const dateDeclaration = utilMoment.getCurrentDateTime();

        // Generate a unique code for the panne
        const code = await generateUniqueCode("PN", 6, Panne);
        if (!code) return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));

        // Create a new Panne
        const newPanne = await Panne.create({
            code,
            dateDeclaration,
            sn,
            fournisseur: existingFournisseur.id,
            agent: existingAgent.id,
            ligne,
            product: product.id,
            workshop: existingWorkshop.id
        }, { transaction });

        if (!newPanne) return next(new CustomError('Un problème est survenu lors de la création d\'une panne, veuillez réessayer.', 400));

        //create new pannetypeassignment
        for (let panne of existingPanneType) {
            const codePTP = await generateUniqueCode("PTP", 6, PanneTypeAssignment);
            if (!codePTP){ 
                await transaction.rollback();
                return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
            }

            const newPanneTypeAssignment = await PanneTypeAssignment.create({
                code: codePTP,
                panne: newPanne.id,
                typepanne: panne.id,
                date: dateDeclaration
            }, { transaction });

            if (!newPanneTypeAssignment) {
                await transaction.rollback();
                return next(new CustomError('Un problème est survenu lors de la création d\'une panne, veuillez réessayer.', 400));
            }
        }
        
        // Commit the transaction
        await transaction.commit();

        // Send the response message
        res.status(200).json({ message: 'Panne créée avec succès' });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.log(error)
        return next(new CustomError('Error: Internal Server', 500));
    }
});
// second panne step
const secondPanneStep = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { codeT, agent } = req.body;
    // Validate required fields
    if ([code, codeT, agent].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
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
    
    //check if its the same agent who create this panne
    if(existingAgent.id != existingPanne.agent){
        return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
    }

    //check if technician have current panne in progress
    const existingPanneInProgress = await PanneService.findPanneInProgressByTechnician(existingTechnician.id);
    if(existingPanneInProgress){
        return next(new CustomError('Vous avez déjà eu une panne en cours vous devez la terminer', 400));
    }

    //check if the panne is already assigned to a technician
    if(existingPanne.technician){
        return next(new CustomError('Cette panne est déjà assignée à un technicien', 400));
    }

    // Get the current date and time
    const tempInitial = utilMoment.getCurrentDateTime();
    
    //update the panne 
    existingPanne.technician = existingTechnician.id;
    existingPanne.tempInitial = tempInitial;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try{
        // Save the updated panne within the transaction
        await existingPanne.save({ transaction });

        // Create a new Repairtime entry within the transaction
        await RepairtimeService.createNewRepairtime(existingPanne.id, tempInitial, transaction);

        // Commit the transaction if everything succeeds
        await transaction.commit();

        // Respond with success message
        res.status(200).json({ message: 'Panne mise à jour avec succès' });
    }catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        return next(new CustomError('Error: Internal Server', 500));
    }
});
// third panne step
const thirdPanneStep = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { source, etat, agent } = req.body;
    // Validate required fields
    if ([code, agent].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    // Validate required fields
    if ([source, etat].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    
    //check if its the same agent who create this panne
    if(existingAgent.id != existingPanne.agent){
        return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
    }
    
    //check if the panne is submitted to second scan
    if(!existingPanne.technician && !existingPanne.tempInitial){
        return next(new CustomError('La panne n\'a pas encore été soumise au deuxième scan', 400));
    }
    
    //check if the panne in mode pause
    if(existingPanne.isPaused){
        return next(new CustomError('Vous ne pouvez pas modifier une panne qui est en mode pause', 400));
    }

    //update the panne 
    if (source) existingPanne.source = source;
    if (etat) existingPanne.etat = etat;
    
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
    const { agent } = req.body;
    // Validate required fields
    if ([code, agent].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if its the same agent who create this panne
    if(existingAgent.id != existingPanne.agent){
        return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
    }

    //check if the panne is submitted to second scan
    if(!existingPanne.technician && !existingPanne.tempInitial){
        return next(new CustomError('La panne n\'a pas encore été soumise au deuxième scan', 400));
    }

    //check if the panne in mode pause
    if(existingPanne.isPaused){
        return next(new CustomError('Vous ne pouvez pas cloturer une panne qui est en mode pause', 400));
    }

    const existingPanneType = await PanneTypeAssignmentService.findPanneTypeAssignmentByPanne(existingPanne.id);
    if(!existingPanneType){
        return next(new CustomError('Vous devez sélectionner au moins un type de panne', 400));
    }

    //check if the panne is already have action corrective and consommation
    const existingConsommation = await ConsommationService.findConsommationByPanne(existingPanne.id);
    const existingActionCorrective = await ActionCorrectiveService.findActionCorrectiveByPanne(existingPanne.id);
    if(!existingConsommation || !existingActionCorrective){
        return next(new CustomError('Vous devez ajouter au moins une action corrective et une consommation', 400));
    }

    //check if the panne is already closed
    if(existingPanne.dateReparation){
        return next(new CustomError('Cette panne est déjà clôturée', 400));
    }
    
    // Get the current date and time
    const dateReparation = utilMoment.getCurrentDateTime();
    //check if dateReparation is greater than existingPanne.tempInitial
    if(moment(dateReparation).isBefore(moment(existingPanne.tempInitial))){
        return next(new CustomError('La date de réparation doit être supérieure à la date d\'intervention', 400));
    }

    //update the panne 
    existingPanne.dateReparation = dateReparation;
    existingPanne.tempFinal = dateReparation;

    // Start a transaction
    const transaction = await sequelize.transaction();
    try{
        //save the updated panne
        await existingPanne.save({ transaction });

        //end a Repairtime entry within the transaction
        await RepairtimeService.endRepairtime(existingPanne.id, dateReparation, transaction);

        // Commit the transaction if everything succeeds
        await transaction.commit();

        // Respond with success message
        res.status(200).json({ message: 'La panne a ete clôturé avec succès' });
    }catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        return next(new CustomError('Error: Internal Server', 500));
    }
});
// make panne delivred
const MakePanneDelivred = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { agent } = req.body;
    // Validate required fields
    if ([code, agent].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if its the same agent who create this panne
    if(existingAgent.id != existingPanne.agent){
        return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
    }

    //check if this panne is clotured
    if(existingPanne.livraison){
        return next(new CustomError('Vous ne pouvez pas cloturer une panne qui est déjà cloturé', 400));
    }

    //check if this panne is clotured
    if(!existingPanne.dateReparation){
        return next(new CustomError('La panne n\'est pas encore soumis au panne non restitue par l\'agent', 400)); 
    }

    //check if its reopened panne
    if(existingPanne.reouverture){
        return next(new CustomError('Vous ne pouvez pas cloturer une panne qui est déjà réouvert', 400));
    }


    // Get the current date and time
    const date = utilMoment.getCurrentDateTime();
    
    //update the panne 
    existingPanne.livraison = true;
    existingPanne.DateLivraison = date;

    //save the updated panne
    const updatedPanne = await existingPanne.save();

    //check if the panne was updated successfully
    if (!updatedPanne) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour du panne, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Panne mis à jour avec succès' });
});
// make panne delivred
const MakeManyPannesDelivred = asyncErrorHandler(async (req, res, next) => {
    const { agent, panneCODEs } = req.body;

    // Validate required fields
    if ([agent].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    //check if the panneCODEs is not empty
    if(panneCODEs.length <= 0){
        return next(new CustomError('Vous devez sélectionner au moins une panne', 400));
    }

    // Check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if pannes exist
        const existingPannes = await Panne.findAll({
            where: {
                code: panneCODEs,
            },
            transaction,
        });

        if (!existingPannes || existingPannes.length === 0) {
            return next(new CustomError('Pannes non trouvée', 404));
        }

        const currentDate = utilMoment.getCurrentDateTime();

        for (let panne of existingPannes) {
            // Check if it's the same agent who created this panne
            if (existingAgent.id !== panne.agent) {
                await transaction.rollback();
                return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
            }

            // Check if the panne is already delivered (cloturée)
            if (panne.livraison) {
                await transaction.rollback();
                return next(new CustomError('Vous ne pouvez pas cloturer une panne qui est déjà cloturé', 400));
            }

            // Check if the panne has been repaired and duration is set
            if (!panne.dateReparation) {
                await transaction.rollback();
                return next(new CustomError('La panne n\'est pas encore soumis au panne non restitue par l\'agent', 400));
            }

            // Check if the panne has been reopened
            if (panne.reouverture) {
                await transaction.rollback();
                return next(new CustomError('Vous ne pouvez pas cloturer une panne qui est déjà réouvert', 400));
            }

            // Update panne as delivered
            panne.livraison = true;
            panne.DateLivraison = currentDate;
        }

        // Save all changes in bulk
        await Promise.all(existingPannes.map(panne => panne.save({ transaction })));

        // Commit the transaction
        await transaction.commit();

        // Respond with success message
        res.status(200).json({ message: 'Pannes mises à jour avec succès' });

    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        return next(new CustomError('Une erreur est survenue lors de la mise à jour des pannes, veuillez réessayer.', 500));
    }
});
// update panne
const updatePanne = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { agent, fournisseur, ligne, workshop, marque, model, sn, lot, family, arrival } = req.body;
    // Validate required fields
    if ([ code, agent ].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Les champs obligatoire doivent être remplis', 400));
    }
    if ([ fournisseur, ligne, workshop, marque, model, sn, lot, family, arrival].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs optionnel doivent être remplis', 400));
    }

    
    //check if the agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvé', 404));
    }

    //check if the panne exists
    const existingPanne = await PanneService.findPanneByCodeANDAgent(code, existingAgent.id);
    if (!existingPanne) {
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if the panne is already associated with a technician
    if (existingPanne.technician) {
        return next(new CustomError('Vous ne pouvez pas modifier une panne qui est déjà associée à un technicien', 400));
    }

    //get product by id
    const existingProduct = await ProductService.findProductById(existingPanne.product);
    if (!existingProduct) {
        return next(new CustomError('Produit non trouvé', 404));
    }


    // update the panne
    if (model) {
        return next(new CustomError('Vous ne pouvez pas modifier le model du produit, dans ce cas veuillez supprimer la panne et créer une nouvelle', 400));
    }

    if (workshop) {
        //check if the workshop exists
        const existingWorkshop = await WorkshopService.findWorkshopByCode(workshop);
        if (!existingWorkshop) {
            return next(new CustomError('Atelier non trouvé', 404));
        }
        existingPanne.workshop = existingWorkshop.id;
    }
    if (lot) {
        //check if the lot exists
        const existingLot = await LotService.findLotByCode(lot);
        if (!existingLot) {
            return next(new CustomError('Lot non trouvé', 404));
        }
        existingProduct.lot = existingLot.id;
    }
    if (family) {
        //check if the family exists
        const existingFamily = await FamilyService.findFamilyByCode(family);
        if (!existingFamily) {
            return next(new CustomError('Famille non trouvée', 404));
        }
        existingProduct.family = existingFamily.id;

    }
    if (arrival) {
        //check if the arrival exists
        const existingArrival = await ArrivalService.findArrivalByCode(arrival);
        if (!existingArrival) {
            return next(new CustomError('Arrivage non trouvé', 404));
        }
        existingProduct.arrival = existingArrival.id;
    }
    if (fournisseur) existingPanne.fournisseur = fournisseur;
    if (ligne) existingPanne.ligne = ligne;
    if (sn) existingPanne.sn = sn;
    if (marque) existingProduct.marque = marque;


    const currentDate = utilMoment.getCurrentDateTime();
    
    // Start a transaction
    const transaction = await sequelize.transaction();

    try{
        // save the updated panne
        await existingPanne.save( { transaction } );
        await existingProduct.save( { transaction } );

        //add this action to agent 
        await AgentUpdateActionsService.createAgentUpdateActions(existingAgent.id, existingPanne.id, currentDate, "Modification des informations de base de la panne", transaction);

        // Commit the transaction if everything succeeds
        await transaction.commit();

        //panne closed seccessfully
        res.status(200).json({ message: 'Panne mis à jour avec succès' });
    }catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        return next(new CustomError('Un problème est survenu lors de la mise à jour de la panne, veuillez réessayer.', 400));
    }
});
// re open Specific Panne
const ReOpenSpecificPanne = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { agent} = req.body;
    // Validate required fields
    if ([ code, agent ].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Les champs obligatoire doivent être remplis', 400));
    }
    //check if the agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvé', 404));
    }
    //check if the panne exists
    const existingPanne = await PanneService.findPanneByCodeANDAgent(code, existingAgent.id);
    if (!existingPanne) {
        return next(new CustomError('Panne non trouvée', 404));
    }
    //check if the panne is submitted to second scan
    if(!existingPanne.technician && !existingPanne.tempFinale){
        return next(new CustomError('La panne n\'a pas encore été soumise au dernière scan', 400));
    }
    //check if the panne is already delivred
    if (existingPanne.livraison) {
        return next(new CustomError('Vous ne pouvez pas réouvrir une panne qui est déjà restitue', 400));
    }

    // Get the current date and time
    const currentDateTime = utilMoment.getCurrentDateTime();

    // update the panne
    existingPanne.reouverture = true;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try{
        // save the updated panne
        await existingPanne.save({ transaction });

        // Create a new Repairtime entry  
        await RepairtimeService.createNewRepairtime(existingPanne.id, currentDateTime, transaction);

        //add this action to agent 
        await AgentUpdateActionsService.createAgentUpdateActions(existingAgent.id, existingPanne.id, currentDateTime, "Réouverture de la panne", transaction);

        // Commit the transaction if everything succeeds
        await transaction.commit();

        res.status(200).json({ message: 'Panne réouvert avec succès' });
    }catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        return next(new CustomError('Un problème est survenu lors de la mise à jour de la panne, veuillez réessayer.', 400));
    }
});
//re close specific panne
const ReCloseSpecificPanne = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { agent} = req.body;
    // Validate required fields
    if ([ code, agent ].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Les champs obligatoire doivent être remplis', 400));
    }
    //check if the agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvé', 404));
    }
    //check if the panne exists
    const existingPanne = await PanneService.findPanneByCodeANDAgent(code, existingAgent.id);
    if (!existingPanne) {
        return next(new CustomError('Panne non trouvée', 404));
    }
    //check if the panne is reouvert
    if(!existingPanne.reouverture){
        return next(new CustomError('La panne n\'a pas encore été réouvert', 400));
    }

    // Get the current date and time
    const currentDateTime = utilMoment.getCurrentDateTime();
    
    // update the panne
    existingPanne.reouverture = false;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try{
        // save the updated panne
        await existingPanne.save({ transaction });

        //end a Repairtime entry 
        await RepairtimeService.endRepairtime(existingPanne.id, currentDateTime, transaction);

        // Commit the transaction if everything succeeds
        await transaction.commit();

        //panne closed seccessfully
        res.status(200).json({ message: 'Panne est re-cloturé avec succès' });
    }catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        return next(new CustomError('Un problème est survenu lors de la mise à jour de la panne, veuillez réessayer.', 400));
    }
});
// delete panne
const DeletePanne = asyncErrorHandler(async (req, res, next) => {
    const { code, agent } = req.params;
    // Validate required fields
    if ([code, agent].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }

    //check if the Agent exists
    const existingAgent = await UserService.findAgentByCode(agent);
    if (!existingAgent) {
        return next(new CustomError('Agent non trouvée', 404));
    }

    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(code);
    if(!existingPanne){
        return next(new CustomError('Panne non trouvée', 404));
    }

    //check if its the same agent who create this panne
    if(existingAgent.id != existingPanne.agent){
        return next(new CustomError('Vous n\'avez pas l\'autorisation pour effectuer cette action', 400));
    }

    //check if there is consommation and actioncorrective related to this panne
    const existingConsommation = await ConsommationService.findConsommationByPanne(existingPanne.id);
    const existingActionCorrective = await ActionCorrectiveService.findActionCorrectiveByPanne(existingPanne.id);
    if(existingConsommation || existingActionCorrective){
        return next(new CustomError('Vous ne pouvez pas supprimer cette panne car elle est liée à un PDRConsome ou une action corrective existante.', 400));
    }
    
    //delete all pannetypeassignment
    const deletedPanneTypeAssignment = await PanneTypeAssignment.destroy({
        where: {
            panne: existingPanne.id
        }
    });
    //check if PanneTypeAssignment is deleted
    if (!deletedPanneTypeAssignment) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'une panne, veuillez réessayer.', 400));
    }
    //deletec Panne
    const deletedPanne = await existingPanne.destroy();
    //check if Panne is deleted
    if (!deletedPanne) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'une panne, veuillez réessayer.', 400));
    }

    res.status(200).json({ message: 'Panne supprimée avec succès' });
});

module.exports = {
    getAllPannesByTechnician,
    getAllArchivePannesByTechnician,
    getSpecificPanne,
    getAllPannes,
    getAllPannesByAgent,
    getAllTakenPannes,
    getAllTakenPannesByAgent,
    getAllCloturedPannes,
    getAllNoneDelivredPannes,
    getAllNoneDelivredPannesByAgent,
    getAllCloturedPannesByAgent,
    firstPanneStep,
    secondPanneStep,
    thirdPanneStep,
    fourthPanneStep,
    MakePanneDelivred,
    MakeManyPannesDelivred,
    updatePanne,
    DeletePanne,
    GetPannesByProduct,
    ReOpenSpecificPanne,
    ReCloseSpecificPanne
}
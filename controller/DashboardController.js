const sequelize = require('../config/Database');
const { Op } = require('sequelize');
const Panne = require('../model/PanneModel.js');
const ActionCorrective = require('../model/ActionCorrectiveModel.js');
const Consommation = require('../model/ConsommationModel.js');
const Action = require('../model/ActionModel.js');
const Piece = require('../model/PieceModel.js');
const PanneType = require('../model/PanneTypeModel.js');
const Technician = require('../model/TechnicianModel.js');
const PanneTypeAssignment = require('../model/PanneTypeAssignmentModel.js');
const ZoneService = require('../service/ZoneService.js');
const WorkshopService = require('../service/WorkshopService.js');
const RepairtimeService = require('../service/RepairtimeService.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const moment = require('moment');
require('moment-timezone');

// count pannes between start and end date
const CountAllPannes = asyncErrorHandler(async (req, res, next) => {
    // Count Pannes for each condition
    const [enAttenteCount, enReparationCount, NoneDelivredrepareCount, DelivredrepareCount] = await Promise.all([
        Panne.count({ where: { technician: null } }),
        Panne.count({
            where: {
                technician: { [Op.ne]: null },
                dateReparation: null
            }
        }),
        Panne.count({
            where: { 
                dateReparation: { [Op.ne]: null },
                livraison: false
            }
        }),
        Panne.count({
            where: { 
                dateReparation: { [Op.ne]: null },
                livraison: true
            }
        }),
    ]);
    // Check if the counts are valid
    if(!enAttenteCount === null || !enReparationCount === null || !NoneDelivredrepareCount === null || !DelivredrepareCount === null){
        return next(new CustomError('Une erreur s\'est produite lors du comptage des pannes', 500));
    }
    // Return the results
    res.status(200).json({
        EnAttente: enAttenteCount,
        EnReparation: enReparationCount,
        NoneDelivredrepare: NoneDelivredrepareCount,
        Delivredrepare: DelivredrepareCount
    });
});
// count pannes between start and end date
const CountPannesBetweenSEDate = asyncErrorHandler(async (req, res, next) => {
    const { start, end } = req.query;

    // Parse the start and end dates using moment
    const parsedStart = moment(start);
    const parsedEnd = moment(end);

    // Check if the dates are valid
    if (!parsedStart.isValid() || !parsedEnd.isValid()) {
        return next(new CustomError('Les dates de début et de fin doivent être valides', 400));
    }

    // Adjust dates to ignore the time part
    const adjustedStart = parsedStart.startOf('day').toDate();
    const adjustedEnd = parsedEnd.endOf('day').toDate();

    // Count Pannes with date range filter
    const [enAttenteCount, enReparationCount, NoneDelivredrepareCount, DelivredrepareCount] = await Promise.all([
        Panne.count({
            where: {
                technician: null,
                dateDeclaration: {
                    [Op.between]: [adjustedStart, adjustedEnd]
                }
            }
        }),
        Panne.count({
            where: {
                technician: { [Op.ne]: null },
                dateReparation: null,
                dateDeclaration: {
                    [Op.between]: [adjustedStart, adjustedEnd]
                }
            }
        }),
        Panne.count({
            where: {
                dateReparation: { [Op.ne]: null },
                dateDeclaration: {
                    [Op.between]: [adjustedStart, adjustedEnd]
                },
                livraison: false
            }
        }),
        Panne.count({
            where: {
                dateReparation: { [Op.ne]: null },
                dateDeclaration: {
                    [Op.between]: [adjustedStart, adjustedEnd]
                },
                livraison: true
            }
        })
    ]);

    // Check if the counts are valid
    if(!enAttenteCount === null || !enReparationCount === null || !NoneDelivredrepareCount === null || !DelivredrepareCount === null){
        return next(new CustomError('Une erreur s\'est produite lors du comptage des pannes', 500));
    }

    // Return the results
    res.status(200).json({
        EnAttente: enAttenteCount,
        EnReparation: enReparationCount,
        NoneDelivredrepare: NoneDelivredrepareCount,
        Delivredrepare: DelivredrepareCount
    });
});
// count pannes between start and end date
const CountAllPannesByZone = asyncErrorHandler(async (req, res, next) => {
    const { zone } = req.params;
    
    //check if zone is provided
    if (!zone || validator.isEmpty(zone)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    
    //check if zone exist
    const existingZone = await ZoneService.findZoneByCode(zone);
    if (!existingZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }

    //get all workshops of this zone
    const existingWorkshops = await WorkshopService.findAllWorkshopsByZone(existingZone.id);
    if (!existingWorkshops || existingWorkshops <= 0) {
        return res.status(200).json({
            EnAttente: 0,
            EnReparation: 0,
            NoneDelivredrepare: 0,
            Delivredrepare: 0
        });
    }
    // Extract workshop IDs
    const workshopIds = existingWorkshops.map(workshop => workshop.id);
    // Count Pannes for each condition
    const [enAttenteCount, enReparationCount, NoneDelivredrepareCount, DelivredrepareCount] = await Promise.all([
        Panne.count({ 
            where: { 
                technician: null,
                workshop: workshopIds,
            } 
        }),
        Panne.count({
            where: {
                workshop: workshopIds,
                technician: { [Op.ne]: null },
                dateReparation: null
            }
        }),
        Panne.count({
            where: { 
                workshop: workshopIds,
                dateReparation: { [Op.ne]: null },
                livraison: false
            }
        }),
        Panne.count({
            where: { 
                workshop: workshopIds,
                dateReparation: { [Op.ne]: null },
                livraison: true
            }
        }),
    ]);
    // Check if the counts are valid
    if(!enAttenteCount === null || !enReparationCount === null || !NoneDelivredrepareCount === null || !DelivredrepareCount === null){
        return next(new CustomError('Une erreur s\'est produite lors du comptage des pannes', 500));
    }
    // Return the results
    res.status(200).json({
        EnAttente: enAttenteCount,
        EnReparation: enReparationCount,
        NoneDelivredrepare: NoneDelivredrepareCount,
        Delivredrepare: DelivredrepareCount
    });
});
// count pannes between start and end date
const CountPannesTodayByZone = asyncErrorHandler(async (req, res, next) => {
    const { zone } = req.params;
    //check if zone is provided
    if (!zone || validator.isEmpty(zone)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if zone exist
    const existingZone = await ZoneService.findZoneByCode(zone);
    if (!existingZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }

    //get all workshops of this zone
    const existingWorkshops = await WorkshopService.findAllWorkshopsByZone(existingZone.id);
    if (!existingWorkshops || existingWorkshops <= 0) {
        return res.status(200).json({
            EnAttente: 0,
            EnReparation: 0,
            NoneDelivredrepare: 0,
            Delivredrepare: 0
        });
    }
    // Extract workshop IDs
    const workshopIds = existingWorkshops.map(workshop => workshop.id);

    // Parse the start and end dates using moment
    const currentDate = moment().tz('Africa/Algiers');

    // Adjust dates to ignore the time part
    const adjustedStart = currentDate.startOf('day').toDate();
    const adjustedEnd = currentDate.endOf('day').toDate();

    // Count Pannes with date range filter
    const [enAttenteCount, enReparationCount, NoneDelivredrepareCount, DelivredrepareCount] = await Promise.all([
        Panne.count({
            where: {
                workshop: workshopIds,
                technician: null,
                dateDeclaration: {
                    [Op.between]: [adjustedStart, adjustedEnd]
                }
            }
        }),
        Panne.count({
            where: {
                workshop: workshopIds,
                technician: { [Op.ne]: null },
                dateReparation: null,
                dateDeclaration: {
                    [Op.between]: [adjustedStart, adjustedEnd]
                }
            }
        }),
        Panne.count({
            where: {
                workshop: workshopIds,
                dateReparation: { [Op.ne]: null },
                dateDeclaration: {
                    [Op.between]: [adjustedStart, adjustedEnd]
                },
                livraison: false
            }
        }),
        Panne.count({
            where: {
                workshop: workshopIds,
                dateReparation: { [Op.ne]: null },
                dateDeclaration: {
                    [Op.between]: [adjustedStart, adjustedEnd]
                },
                livraison: true
            }
        })
    ]);

    // Check if the counts are valid
    if(!enAttenteCount === null || !enReparationCount === null || !NoneDelivredrepareCount === null || !DelivredrepareCount === null){
        return next(new CustomError('Une erreur s\'est produite lors du comptage des pannes', 500));
    }

    // Return the results
    res.status(200).json({
        EnAttente: enAttenteCount,
        EnReparation: enReparationCount,
        NoneDelivredrepare: NoneDelivredrepareCount,
        Delivredrepare: DelivredrepareCount
    });
});
// count pannes for every month of this year
const CountPannesByMonth = asyncErrorHandler(async (req, res, next) => {
    // Get the current year
    const currentYear = moment().year();

    // Create an array to store results for each month
    const results = [];

    // Loop through each month
    for (let month = 1; month <= 12; month++) {
        // Format month to ensure two digits
        const formattedMonth = moment(`${currentYear}-${month}-01`, 'YYYY-M-D').format('YYYY-MM-DD');

        // Calculate start and end of the month
        const startOfMonth = moment(formattedMonth).startOf('month').toDate();
        const endOfMonth = moment(startOfMonth).endOf('month').toDate();

        // Count pannes for each condition
        const [enAttenteCount, enReparationCount, repareCount] = await Promise.all([
            Panne.count({
                where: {
                    technician: null,
                    dateDeclaration: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                }
            }),
            Panne.count({
                where: {
                    technician: { [Op.ne]: null },
                    dateReparation: null,
                    dateDeclaration: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                }
            }),
            Panne.count({
                where: {
                    dateReparation: { [Op.ne]: null },
                    dateDeclaration: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                }
            })
        ]);

        // Format month name
        const monthName = moment(month, 'M').format('MMM');

        // Add result for the current month to the results array
        results.push({
            EnAttente: enAttenteCount,
            EnReparation: enReparationCount,
            Repare: repareCount,
            month: monthName
        });
    }

    // Return the results for the entire year
    return res.status(200).json(results);
});
// count top 4 pannes
const CountTopPannes = asyncErrorHandler(async (req, res, next) => {
    // Count top 4 pannes by their "panne" field
    const topPannes = await PanneTypeAssignment.findAll({
        attributes: [
            'typepanne',
            [sequelize.fn('COUNT', sequelize.col('typepanne')), 'count']
        ],
        include: [
            {
                model: PanneType,
                as: 'typepanneAssociation',
                attributes: ['name'] 
            }
        ],
        group: ['typepanne'],
        order: [[sequelize.fn('COUNT', sequelize.col('typepanne')), 'DESC']],
        limit: 4
    });

    // Check if the top pannes are valid
    if (!topPannes || topPannes.length === 0) {
        return next(new CustomError('Aucune panne trouvée.', 404));
    }
    

    // Return the results
    res.status(200).json(topPannes);
});
//count top 4 pannes between start and end date
const CountTopPannesBetweenSEDate = asyncErrorHandler(async (req, res, next) => {
    const { start, end } = req.query;

    // Parse the start and end dates using moment
    const parsedStart = moment(start);
    const parsedEnd = moment(end);

    // Check if the dates are valid
    if (!parsedStart.isValid() || !parsedEnd.isValid()) {
        return next(new CustomError('Les dates de début et de fin doivent être valides', 400));
    }

    // Adjust dates to ignore the time part
    const adjustedStart = parsedStart.startOf('day').toDate();
    const adjustedEnd = parsedEnd.endOf('day').toDate();

    // Count top 4 pannes by their "panne" field
    const topPannes = await PanneTypeAssignment.findAll({
        attributes: [
            'typepanne',
            [sequelize.fn('COUNT', sequelize.col('typepanne')), 'count']
        ],
        include: [
            {
                model: PanneType,
                as: 'typepanneAssociation',
                attributes: ['name'] 
            },
            {
                model: Panne,
                as: 'panneAssociation',
                attributes: [],
                where: {
                    dateDeclaration: {
                        [Op.between]: [adjustedStart, adjustedEnd]
                    }
                }
            }
        ],
        group: ['typepanne'],
        order: [[sequelize.fn('COUNT', sequelize.col('typepanne')), 'DESC']],
        limit: 4
    });

    // Check if the top pannes are valid
    if (!topPannes || topPannes.length === 0) {
        return next(new CustomError('Aucune panne trouvée.', 404));
    }

    // Return the results
    res.status(200).json(topPannes);
});
// count top 4 actions correctives
const CountTopActionsCorrectives = asyncErrorHandler(async (req, res, next) => {
    // Count top 4 actions correctives by their "action" field and include the action name
    const topActionsCorrectives = await ActionCorrective.findAll({
        attributes: [
            'action',
            [sequelize.fn('COUNT', sequelize.col('action')), 'count']
        ],
        include: [
            {
                model: Action,
                as: 'actionAssociation',
                attributes: ['name', 'duree'] 
            }
        ],
        group: ['action', 'actionAssociation.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('action')), 'DESC']],
        limit: 4
    });

    // Check if the top actions correctives are valid
    if (!topActionsCorrectives || topActionsCorrectives.length === 0) {
        return next(new CustomError('Aucune action corrective trouvée.', 404));
    }

    // Return the results
    res.status(200).json(topActionsCorrectives);
});
//count top 4 actions correctives between start and end date 
const CountTopActionsCorrectivesBetweenSEDate = asyncErrorHandler(async (req, res, next) => {
    const { start, end } = req.query;

    // Parse the start and end dates using moment
    const parsedStart = moment(start);
    const parsedEnd = moment(end);

    // Check if the dates are valid
    if (!parsedStart.isValid() || !parsedEnd.isValid()) {
        return next(new CustomError('Les dates de début et de fin doivent être valides', 400));
    }

    // Adjust dates to ignore the time part
    const adjustedStart = parsedStart.startOf('day').toDate();
    const adjustedEnd = parsedEnd.endOf('day').toDate();

    // Count top 4 actions correctives by their "action" field based on panne.dateDeclaration
    const topActionsCorrectives = await ActionCorrective.findAll({
        attributes: [
            'action',
            [sequelize.fn('COUNT', sequelize.col('action')), 'count']
        ],
        include: [
            {
                model: Action,
                as: 'actionAssociation',
                attributes: ['name', 'duree'] 
            },
            {
                model: Panne,
                as: 'panneAssociation',
                attributes: [],
                where: {
                    dateDeclaration: {
                        [Op.between]: [adjustedStart, adjustedEnd]
                    }
                }
            }
        ],
        group: ['action', 'actionAssociation.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('action')), 'DESC']],
        limit: 4
    });

    // Check if the top actions correctives are valid
    if (!topActionsCorrectives || topActionsCorrectives.length === 0) {
        return next(new CustomError('Aucune action corrective trouvée.', 404));
    }

    // Return the results
    res.status(200).json(topActionsCorrectives);
});
// count top 4 consommations
const CountTopConsommations = asyncErrorHandler(async (req, res, next) => {
    // Count top 4 consommations by their "piece" field
    const topConsommations = await Consommation.findAll({
        attributes: [
            'piece',
            [sequelize.fn('COUNT', sequelize.col('piece')), 'count']
        ],
        include: [
            {
                model: Piece,
                as: 'pieceAssociation',
                attributes: ['name']
            }
        ],
        group: ['piece', 'pieceAssociation.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('piece')), 'DESC']],
        limit: 4
    });

    // Check if the top consommations are valid
    if (!topConsommations || topConsommations.length === 0) {
        return next(new CustomError('Aucune consommation trouvée.', 404));
    }

    // Return the results
    res.status(200).json(topConsommations);
});
// count top 4 consommations between start and end date
const CountTopConsommationsBetweenSEDate = asyncErrorHandler(async (req, res, next) => {
    const { start, end } = req.query;

    // Parse the start and end dates using moment
    const parsedStart = moment(start);
    const parsedEnd = moment(end);

    // Check if the dates are valid
    if (!parsedStart.isValid() || !parsedEnd.isValid()) {
        return next(new CustomError('Les dates de début et de fin doivent être valides', 400));
    }

    // Adjust dates to ignore the time part
    const adjustedStart = parsedStart.startOf('day').toDate();
    const adjustedEnd = parsedEnd.endOf('day').toDate();

    // Count top 4 consommations by their "piece" field based on panne.dateDeclaration
    const topConsommations = await Consommation.findAll({
        attributes: [
            'piece',
            [sequelize.fn('COUNT', sequelize.col('piece')), 'count']
        ],
        include: [
            {
                model: Piece,
                as: 'pieceAssociation',
                attributes: ['name']
            },
            {
                model: Panne,
                as: 'panneAssociation',
                attributes: [],
                where: {
                    dateDeclaration: {
                        [Op.between]: [adjustedStart, adjustedEnd]
                    }
                }
            }
        ],
        group: ['piece', 'pieceAssociation.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('piece')), 'DESC']],
        limit: 4
    });

    // Check if the top consommations are valid
    if (!topConsommations || topConsommations.length === 0) {
        return next(new CustomError('Aucune consommation trouvée.', 404));
    }

    // Return the results
    res.status(200).json(topConsommations);
});
// count top 5 technicians
const CountTopTechnicians = asyncErrorHandler(async (req, res, next) => {
    // Fetch the total number of pannes and group by technician
    const techniciansData = await Panne.findAll({
        attributes: [
            'technician',
            [sequelize.fn('COUNT', sequelize.col('panne.id')), 'panneCount'], // Count of pannes for each technician
        ],
        where: {
            dateReparation: { [Op.ne]: null }
        },
        include: [
            {
                model: Technician,
                as: 'technicianAssociation',
                attributes: ['code', 'fullname']
            }
        ],
        group: ['technician', 'technicianAssociation.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('panne.id')), 'DESC']],
        limit: 5
    });

    // Check if we found technicians
    if (!techniciansData || techniciansData.length === 0) {
        return next(new CustomError('Aucun technicien trouvé.', 404));
    }

    // Calculate the total and average repair time for each technician
    const formattedTechnicians = await Promise.all(techniciansData.map(async technician => {
        // Fetch all pannes for the technician
        const technicianPannes = await Panne.findAll({
            where: { 
                technician: technician.technician,
                dateReparation: { [Op.ne]: null }
            }
        });

        // Calculate the total repair time for all pannes
        let totalRepairTime = 0;
        for (const panne of technicianPannes) {
            const repairTimeForPanne = await RepairtimeService.getAllRepairetimesByPanne(panne.id);
            totalRepairTime += repairTimeForPanne;
        }

        // Calculate the average repair time
        const averageRepairTime = totalRepairTime / technician.dataValues.panneCount;

        // Format the average repair time into a human-readable string
        const duration = moment.duration(averageRepairTime);
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        // Build the formatted duration string
        let formattedDuration = '';
        if (days > 0) {
            formattedDuration += `${days} jour${days > 1 ? 's' : ''}, `;
        }
        if (hours > 0) {
            formattedDuration += `${hours} heure${hours > 1 ? 's' : ''}, `;
        }
        if (minutes > 0) {
            formattedDuration += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
        }
        if (seconds > 0 || formattedDuration === '') { // Include seconds if no other units are present
            formattedDuration += `${seconds} seconde${seconds > 1 ? 's' : ''}`;
        }

        return {
            ...technician.dataValues,
            averageRepairTime: formattedDuration || '0 secondes'
        };
    }));

    // Return the result with formatted data
    res.status(200).json(formattedTechnicians);
});
//count top 5 sources
const CountTopSources = asyncErrorHandler(async (req, res, next) => {
    // Count top 5 sources by their "source" field
    const topSources = await Panne.findAll({
        attributes: [
            'source',
            [sequelize.fn('COUNT', sequelize.col('source')), 'count']
        ],
        where: {
            source: { [Op.ne]: null }
        },
        group: ['source'],
        order: [[sequelize.fn('COUNT', sequelize.col('source')), 'DESC']],
        limit: 5
    });

    // Check if the top sources are valid
    if (!topSources || topSources.length === 0) {
        return next(new CustomError('Aucune source trouvée.', 404));
    }
    // Return the results
    res.status(200).json(topSources);
});
//count top 5 origine
const CountTopOrigines = asyncErrorHandler(async (req, res, next) => {
    // Count top 5 origines by their "origine" field
    const topOrigines = await Panne.findAll({
        attributes: [
            'origine',
            [sequelize.fn('COUNT', sequelize.col('origine')), 'count']
        ],
        where: {
            origine: { [Op.ne]: null }
        },
        group: ['origine'],
        order: [[sequelize.fn('COUNT', sequelize.col('origine')), 'DESC']],
        limit: 5
    });

    // Check if the top origines are valid
    if (!topOrigines || topOrigines.length === 0) {
        return next(new CustomError('Aucune origine trouvée.', 404));
    }

    // Return the results
    res.status(200).json(topOrigines);
});

module.exports = {
    CountAllPannes,
    CountPannesBetweenSEDate,
    CountAllPannesByZone,
    CountPannesTodayByZone,
    CountPannesByMonth,
    CountTopPannes,
    CountTopActionsCorrectives,
    CountTopConsommations,
    CountTopTechnicians,
    CountTopSources,
    CountTopOrigines,
    CountTopPannesBetweenSEDate,
    CountTopActionsCorrectivesBetweenSEDate,
    CountTopConsommationsBetweenSEDate
};

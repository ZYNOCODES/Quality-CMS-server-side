const sequelize = require('../config/Database');
const { Op, fn, col } = require('sequelize');
const Panne = require('../model/PanneModel.js');
const ActionCorrective = require('../model/ActionCorrectiveModel.js');
const Consommation = require('../model/ConsommationModel.js');
const Action = require('../model/ActionModel.js');
const Piece = require('../model/PieceModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const moment = require('moment');
require('moment-timezone');

// count pannes between start and end date
const CountAllPannes = asyncErrorHandler(async (req, res, next) => {
    // Count Pannes for each condition
    const [enAttenteCount, enReparationCount, repareCount] = await Promise.all([
        Panne.count({ where: { technician: null } }),
        Panne.count({
            where: {
                technician: { [Op.ne]: null },
                dateReparation: null
            }
        }),
        Panne.count({
            where: { dateReparation: { [Op.ne]: null } }
        })
    ]);
    // Check if the counts are valid
    if(!enAttenteCount || !enReparationCount || !repareCount){
        return next(new CustomError('Une erreur s\'est produite lors du comptage des pannes', 500));
    }
    // Return the results
    res.status(200).json({
        EnAttente: enAttenteCount,
        EnReparation: enReparationCount,
        Repare: repareCount
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
    const [enAttenteCount, enReparationCount, repareCount] = await Promise.all([
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
                }
            }
        })
    ]);

    // Check if the counts are valid
    if (enAttenteCount === null || enReparationCount === null || repareCount === null) {
        return next(new CustomError('Une erreur s\'est produite lors du comptage des pannes', 500));
    }

    // Return the results
    res.status(200).json({
        EnAttente: enAttenteCount,
        EnReparation: enReparationCount,
        Repare: repareCount
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
    const topPannes = await Panne.findAll({
        attributes: [
            'panne',
            [sequelize.fn('COUNT', sequelize.col('panne')), 'count']
        ],
        group: ['panne'],
        order: [[sequelize.fn('COUNT', sequelize.col('panne')), 'DESC']],
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
                attributes: ['name'] 
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

module.exports = {
    CountAllPannes,
    CountPannesBetweenSEDate,
    CountPannesByMonth,
    CountTopPannes,
    CountTopActionsCorrectives,
    CountTopConsommations
};

const sequelize = require('../config/Database.js');
const { Op } = require('sequelize');
const Repairtime = require('../model/RepairtimeModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const PanneService = require('../service/PanneService.js');
const moment = require('moment');
const UtilMoment = require('../util/Moment.js');

//get all repairtimes by panne
const GetRepairtimesByPanne = asyncErrorHandler(async (req, res, next) => {
    const { panne } = req.params;
    //check if panne is provided
    if (!panne || validator.isEmpty(panne)) {
        return next(new CustomError('Panne non fournie', 400));
    }
    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(panne);
    if (!existingPanne) {
        return next(new CustomError('Panne non trouvée', 404));
    }
    //get all repairtimes by panne where end is not null
    const repairtimes = await Repairtime.findAll({
        where: {
            panne: existingPanne.id,
            end: {
                [Op.not]: null
            }
        }
    });
    //check if there are repairtimes
    if (!repairtimes || repairtimes.length < 1) {
        return next(new CustomError('Aucun temps de réparation trouvé', 404));
    }

    // Calculate the difference in milliseconds
    const dureeInMilliseconds = moment(repairtimes.start).diff(moment(repairtimes.end));

    res.status(200).json(dureeInMilliseconds);
});
//pause a a panne repairtime
const PauseRepairtime = asyncErrorHandler(async (req, res, next) => {
    const { panne } = req.params;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if panne is provided
        if (!panne || validator.isEmpty(panne)) {
            return next(new CustomError('Panne non fournie', 400));
        }

        // Check if panne exists
        const existingPanne = await PanneService.findPanneByCode(panne);
        if (!existingPanne) {
            return next(new CustomError('Panne non trouvée', 404));
        }

        // Find the ongoing repairtime
        const repairtime = await Repairtime.findOne({
            where: { 
                panne: existingPanne.id, 
                end: null 
            },
        });

        // Check if repairtime exists
        if (!repairtime) {
            return next(new CustomError('Temps de réparation non trouvé', 404));
        }

        // Update the repairtime and panne status
        repairtime.end = UtilMoment.getCurrentDateTime();
        existingPanne.isPaused = true;

        // Save both repairtime and panne in the transaction
        await repairtime.save({ transaction });
        await existingPanne.save({ transaction });

        // Commit the transaction
        await transaction.commit();

        // Return the updated repairtime
        res.status(200).json(repairtime);

    } catch (error) {
        // Rollback the transaction if any error occurs
        await transaction.rollback();
        return next(new CustomError('Erreur lors de la mise à jour du temps de réparation, veuillez réessayer', 500));
    }
});
//resume a panne repairtime
const ResumeRepairtime = asyncErrorHandler(async (req, res, next) => {
    const { panne } = req.params;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Check if panne is provided
        if (!panne || validator.isEmpty(panne)) {
            return next(new CustomError('Panne non fournie', 400));
        }

        // Check if panne exists
        const existingPanne = await PanneService.findPanneByCode(panne);
        if (!existingPanne) {
            return next(new CustomError('Panne non trouvée', 404));
        }

        //check if technician have current panne in progress
        const existingPanneInProgress = await PanneService.findPanneInProgressByTechnician(existingPanne.technician);
        if(existingPanneInProgress){
            return next(new CustomError('Vous avez déjà eu une panne en cours vous devez la terminer', 400));
        }

        // get the current date and time
        const currentDateTime = UtilMoment.getCurrentDateTime();

        // Create a new repairtime entry
        await Repairtime.create({
            start: currentDateTime,
            end: null,
            panne: existingPanne.id
        }, { transaction });

        // Update the panne status
        existingPanne.isPaused = false;
        await existingPanne.save({ transaction });

        // Commit the transaction
        await transaction.commit();

        // Format the start time to only show the time part
        const startTime = moment(currentDateTime).format('HH:mm:ss');

        // Return the success response
        res.status(200).json({ message: `Le temps de réparation pour cette panne a recommencé avec succès à ${startTime}.`});

    } catch (error) {
        // Rollback the transaction if any error occurs
        await transaction.rollback();
        return next(new CustomError('Erreur lors de la reprise du temps de réparation, veuillez réessayer', 500));
    }
});
//get the last repairtime by panne
const GetLastRepairtimeByPanne = asyncErrorHandler(async (req, res, next) => {
    const { panne } = req.params;
    //check if panne is provided
    if (!panne || validator.isEmpty(panne)) {
        return next(new CustomError('Panne non fournie', 400));
    }
    //check if panne exists
    const existingPanne = await PanneService.findPanneByCode(panne);
    if (!existingPanne) {
        return next(new CustomError('Panne non trouvée', 404));
    }
    const repairtime = await Repairtime.findOne({
        where: {
            panne: existingPanne.id
        },
        order: [
            ['start', 'DESC']
        ]
    });
    //check if there are repairtimes
    if (!repairtime) {
        return next(new CustomError('Aucun temps de réparation trouvé', 404));
    }
    
    res.status(200).json(repairtime);
});

module.exports = {
    GetRepairtimesByPanne,
    GetLastRepairtimeByPanne,
    PauseRepairtime,
    ResumeRepairtime
};
const sequelize = require('../config/Database.js');
const { Op } = require('sequelize');
const Agent = require('../model/AccessAgentModel.js');
const Technician = require('../model/TechnicianModel.js');
const Manager = require('../model/ManagerModel.js');
const Zone = require('../model/ZoneModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const ZoneService = require('../service/ZoneService.js');
const PanneService = require('../service/PanneService.js');
const {
    hashPassword,
} = require('../util/bcrypt.js');

//get specific user by code
const GetAllUserByCode = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;

    // Check if code is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    let user;
    if (code.startsWith('AA')) {
        user = await Agent.findOne({
            where: {
                code
            },
            include: [
                {
                    model: Zone,
                    as: 'zoneAssociation'
                }
            ]
        });
    } else if (code.startsWith('T')) {
        user = await Technician.findOne({
            where: {
                code
            },
            include: [
                {
                    model: Zone,
                    as: 'zoneAssociation'
                }
            ]
        });
    } else if (code.startsWith('M')) {
        user = await Manager.findOne({
            where: {
                code
            },
            include: [
                {
                    model: Zone,
                    as: 'zoneAssociation'
                }
            ]
        });
    }

    if (!user) {
        return next(new CustomError('Utilisateur non trouvé', 404));
    }

    return res.status(200).json(user);
});
//get all technician by zone
const GetAllTechnicianByZone = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    // Check if code is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    //check if zone exist
    const existingZone = await ZoneService.findZoneByCode(code);
    if(!existingZone){
        return next(new CustomError('Zone non trouvé', 404));
    }

    const user = await Technician.findAll({
        where: {
            zone: existingZone.id
        },
    });

    if (!user || user.length < 1) {
        return next(new CustomError('Aucun technicians trouvé', 404));
    }

    return res.status(200).json(user);
});

module.exports = {
    GetAllUserByCode,
}
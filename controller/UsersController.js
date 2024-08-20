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

//get all users agents and  tichnicians
const GetAllUsers = asyncErrorHandler(async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const [Agents, Technicians] = await Promise.all([
            Agent.findAll({
                include: [
                    {
                        model: Zone,
                        as: 'zoneAssociation'
                    }
                ]
            },{ transaction }),
            Technician.findAll({
                include: [
                    {
                        model: Zone,
                        as: 'zoneAssociation'
                    }
                ]
            },{ transaction })
        ]);

        // Commit the transaction if both queries are successful
        await transaction.commit();

        // Add a type property to each agent and technician
        const formattedAgents = Agents.map(agent => ({
            ...agent.dataValues,
            type: 'agent'
        }));

        const formattedTechnicians = Technicians.map(technician => ({
            ...technician.dataValues,
            type: 'technician'
        }));

        // Combine agents and technicians into a single array
        const users = [...formattedAgents, ...formattedTechnicians];

        // Check if there are users
        if (users.length < 1) {
            return next(new CustomError('Aucun utilisateur trouvé', 404));
        }

        res.status(200).json(users);
    } catch (error) {
        // Rollback the transaction in case of any error
        await transaction.rollback();
        return next(error);
    }
});
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

//update specific user
const UpdateUser = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { fullname, username, password, zone, phone } = req.body;
    //check if name is provided
    if(!code || validator.isEmpty(code)){
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }
    if ([fullname, username, password, zone, phone].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }

    // Find the user by code if its start with AA its an agent
    // otherwise its a technician if start with T 
    let existinguser;
    if(code.startsWith('AA')){
        existinguser = await Agent.findOne({
            where:{
                code
            }
        })
    }else if(code.startsWith('T')){
        existinguser = await Technician.findOne({
            where:{
                code
            }
        })
    }else{
        return next(new CustomError('Quelque chose s\'est mal passé, veuillez réessayez', 400));
    }

    // Check if the user exists
    if (!existinguser) {
        return next(new CustomError('Utilisateur non trouvé', 404));
    }

    // Update the user
    if(fullname) existinguser.fullname = fullname;
    if(username) {
        //check if username exists
        let usernameCheck = await _findUser(username);
        if (usernameCheck) {
            return next(new CustomError('Nom d\'utilisateur déjà utilisé', 400));
        }  
        existinguser.username = username;
    }
    if(phone) {
        //check if phone number exists
        let phoneNumberCheck = await _findUser(phone);  
        if (phoneNumberCheck) {
            return next(new CustomError('Numéro de téléphone déjà utilisé', 400));
        }  
        existinguser.phoneNumber = phone;
    }
    if(password) {
       //hash password
        const hashedPassword = await hashPassword(password);
        existinguser.password = hashedPassword;
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
        return next(new CustomError('Un problème est survenu lors de la mise à jour de l\'utilisateur, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
});
//delete specific user
const DeleteUser = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if(!code || validator.isEmpty(code)){
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }

    // Find the user by code if its start with AA its an agent
    // otherwise its a technician if start with T 
    let existinguser;
    if(code.startsWith('AA')){
        existinguser = await Agent.findOne({
            where:{
                code
            }
        });
        // Check if the user exists
        if (!existinguser) {
            return next(new CustomError('Utilisateur non trouvé', 404));
        }
    }else if(code.startsWith('T')){
        existinguser = await Technician.findOne({
            where:{
                code
            }
        });
        // Check if the user exists
        if (!existinguser) {
            return next(new CustomError('Utilisateur non trouvé', 404));
        }
        //check if there is no panne related to this Technician
        const Panne = await PanneService.findPanneByTechnician(existinguser.id);
        if(Panne){
            return next(new CustomError('Vous ne pouvez pas supprimer ce technician car il est liée à une panne existante.', 400));
        }
    }else{
        return next(new CustomError('Quelque chose s\'est mal passé, veuillez réessayez', 400));
    }

    //delete
    const deletedUser = await existinguser.destroy();

    // Check if the user was deleted successfully
    if (!deletedUser) {
        return next(new CustomError('Un problème est survenu lors de la suppression de l\'utilisateur, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'L\'utilisateur a été supprimé avec succès' });
});
//find user by username or phone
const _findUser = async (identifier) => {
    let user = await Agent.findOne({
        where: {
            [Op.or]: [
                { username: identifier },
                { phoneNumber: identifier }
            ]
        },
        raw: true
    });

    if (user) {
        return user;
    }

    user = await Technician.findOne({
        where: {
            [Op.or]: [
                { username: identifier },
                { phoneNumber: identifier }
            ]
        },
        raw: true
    });

    if (user) {
        return user;
    }

    return null; // Return null if no user found
};
module.exports = {
    GetAllUsers,
    GetAllUserByCode,
    UpdateUser,
    DeleteUser,
}
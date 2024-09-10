const { Op } = require('sequelize');
const Agent = require('../model/AccessAgentModel.js');
const Displayer = require('../model/DisplayerModel.js');
const Manager = require('../model/ManagerModel.js');
const Zone = require('../model/ZoneModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const ZoneService = require('../service/ZoneService.js');
const PanneService = require('../service/PanneService.js');
const { generateUniqueCode } = require('../util/Codification.js');
const {
    hashPassword,
} = require('../util/bcrypt.js');

//create new agent
const CreateAgent = asyncErrorHandler(async (req, res, next) => {
    const { fullname, username, password, phoneNumber, zone } = req.body;
    // Check if username, password, and phoneNumber are provided
    if (validator.isEmpty(username) || validator.isEmpty(password) || 
        validator.isEmpty(phoneNumber) || validator.isEmpty(zone) 
    ) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Validate username: only alphanumeric characters are allowed
    if (!username || !validator.isAlphanumeric(username)) {
        return next(new CustomError('Nom d\'utilisateur invalide : seuls les caractères alphanumériques sont autorisés', 400));
    }

    // Validate password: ensure it's at least 8 characters long, contains one letter, one number, and one special character
    if (!password || !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        return next(new CustomError('Mot de passe invalide : le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial', 400));
    }

    // Validate phone number: ensure it's a valid phone number for algerian numbers

    if (!phoneNumber || !validator.isMobilePhone(phoneNumber, 'ar-DZ')
    ) {
        return next(new CustomError('Numéro de téléphone invalide : veuillez fournir un numéro de téléphone valide', 400));
    }

    //check if username or phone number exists
    const usernameCheck = await _findUser(username);
    const phoneNumberCheck = await _findUser(phoneNumber);
    if (usernameCheck || phoneNumberCheck) {
        return next(new CustomError('Nom d\'utilisateur ou numéro de téléphone déjà utilisé', 400));
    }
    //hash password
    const hashedPassword = await hashPassword(password);

    //check if zone is exists
    const existingZone = await ZoneService.findZoneByCode(zone);
    if (!existingZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }
    // Generate a unique code for the product
    const codeAA = await generateUniqueCode("AA", 6, Agent);
    if (!codeAA) {
        return next(new CustomError('Erreur lors de la création d\'un utilisateur, veuillez réessayer.', 400));
    }
    
    //create new user
    const newAgent = await Agent.create({
        code: codeAA,
        fullname,
        username,
        password: hashedPassword,
        phoneNumber,
        zone: existingZone.id
    });

    //check if user is created
    if (!newAgent) {
        return next(new CustomError('Erreur lors de la création d\'un agent. veuillez réessayer', 400));
    }
    //return success message
    res.status(200).json({ message: 'Agent créé avec succès' });
});
//get all Agents agents and  tichnicians
const GetAllAgents = asyncErrorHandler(async (req, res, next) => {
    const Agents = await Agent.findAll({
        include: [
            {
                model: Zone,
                as: 'zoneAssociation'
            }
        ]
    });
    // Check if there are Agents
    if (!Agents || Agents.length < 1) {
        return next(new CustomError('Aucun agent trouvé', 404));
    }
    res.status(200).json(Agents);
});
//update specific user
const UpdateAgent = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { fullname, username, password, zone, phone } = req.body;
    //check if name is provided
    if(!code || validator.isEmpty(code)){
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }
    if ([fullname, username, password, zone, phone].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }
    // Validate username: only alphanumeric characters are allowed
    if (username && !validator.isAlphanumeric(username)) {
        return next(new CustomError('Nom d\'utilisateur invalide : seuls les caractères alphanumériques sont autorisés', 400));
    }

    // Validate password: ensure it's at least 8 characters long, contains one letter, one number, and one special character
    if (password && !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        return next(new CustomError('Mot de passe invalide : le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial', 400));
    }

    // Validate phone number: ensure it's a valid phone number for algerian numbers

    if (phone && !validator.isMobilePhone(phone, 'ar-DZ')
    ) {
        return next(new CustomError('Numéro de téléphone invalide : veuillez fournir un numéro de téléphone valide', 400));
    }

    // Find the agent
    const existinguser = await Agent.findOne({
        where:{
            code
        }
    })

    // Check if the user exists
    if (!existinguser) {
        return next(new CustomError('Agent non trouvé', 404));
    }

    // Update the user
    if(fullname) existinguser.fullname = fullname;
    if(username) {
        //check if username exists
        const usernameCheck = await Agent.findOne({
            where:{
                username
            }
        });
    
        if (usernameCheck) {
            return next(new CustomError('Nom d\'utilisateur déjà utilisé', 400));
        }  
        existinguser.username = username;
    }
    if(phone) {
        //check if phone number exists
        let phoneNumberCheck = await Agent.findOne({
            where:{
                phoneNumber: phone
            }
        });
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
const DeleteAgent = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if(!code || validator.isEmpty(code)){
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }

    // Find the user by code if its start with AA its an agent
    // otherwise its a technician if start with T 
    const existinguser = await Agent.findOne({
        where:{
            code
        }
    });
    // Check if the user exists
    if (!existinguser) {
        return next(new CustomError('Agent non trouvé', 404));
    }
    //check if there is no panne related to this Technician
    const Panne = await PanneService.findPanneByAgent(existinguser.id);
    if(Panne){
        return next(new CustomError('Vous ne pouvez pas supprimer ce agent car il est liée à une panne existante.', 400));
    }

    //delete
    const deletedUser = await existinguser.destroy();

    // Check if the user was deleted successfully
    if (!deletedUser) {
        return next(new CustomError('Un problème est survenu lors de la suppression de l\'agent, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Agent a été supprimé avec succès' });
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

    user = await Manager.findOne({
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

    user = await Displayer.findOne({
        where: {
            username: identifier
        },
        raw: true
    });

    if (user) {
        return user;
    }

    return null; // Return null if no user found
};

module.exports = {
    CreateAgent,
    GetAllAgents,
    UpdateAgent,
    DeleteAgent
}
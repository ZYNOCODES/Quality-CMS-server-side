const { Op } = require('sequelize');
const Displayer = require('../model/DisplayerModel.js');
const Agent = require('../model/AccessAgentModel.js');
const Manager = require('../model/ManagerModel.js');
const Zone = require('../model/ZoneModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const ZoneService = require('../service/ZoneService.js');
const DisplayerService = require('../service/DisplayerService.js');
const { generateUniqueCode } = require('../util/Codification.js');
const {
    hashPassword,
} = require('../util/bcrypt.js');

//create new displayer
const CreateDisplayer = asyncErrorHandler(async (req, res, next) => {
    const { username, password, zone } = req.body;
    // Check if username, password, and zone are provided
    if (validator.isEmpty(username) || validator.isEmpty(password) || validator.isEmpty(zone) ) {
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
    //check if username or phone number exists
    const usernameCheck = await _findUser(username);
    if (usernameCheck) {
        return next(new CustomError('Nom d\'utilisateur est déjà utilisé', 400));
    }
    //hash password
    const hashedPassword = await hashPassword(password);
    //check if zone exists
    const existingzone = await ZoneService.findZoneByCode(zone);
    if (!existingzone) {
        throw new CustomError("Zone existingzone", 404);
    }
    // Generate a unique code for the displayer
    const codeD = await generateUniqueCode("D", 6, Displayer);
    if (!codeD) {
        return next(new CustomError('Erreur lors de la création d\'un displayer, veuillez réessayer.', 400));
    }
    //create displayer
    const newDisplayer = await Displayer.create({
        code: codeD,
        username,
        password: hashedPassword,
        zone: existingzone.id
    });
    //check if displayer is created
    if (!newDisplayer) {
        return next(new CustomError('Erreur lors de la création du displayer. veuillez réessayer', 500));
    }
    
    //return response
    res.status(200).json({ message: 'Displayer créé avec succès' });
});
//get all displayers
const GetAllDisplayers = asyncErrorHandler(async (req, res, next) => {
    const displayers = await Displayer.findAll({
        include: [
            {
                model: Zone,
                as: 'zoneAssociation',
            }
        ],
    });
    //check if displayers are found
    if (!displayers || displayers.length <= 0) {
        return next(new CustomError('Aucun displayer trouvé', 404));
    }
    //return response
    res.status(200).json(displayers);
});
//update specific displayer
const UpdateDisplayer = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { username, password, zone } = req.body;
    //check if code is provided
    if (!code || validator.isEmpty(code)) {
        return next(new CustomError('Tout les champs doit être rempli', 400));
    }
    //check if password or zone is provided
    if ([username, password, zone].every(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Un des champs doit être rempli', 400));
    }

    //check if displayer exists
    const existingDisplayer = await DisplayerService.findDisplayerByCode(code);
    if(!existingDisplayer){
        return next(new CustomError("Displayer non trouvée", 404));
    }

    //update displayer
    if(username){
        // Validate username: only alphanumeric characters are allowed
        if (username && !validator.isAlphanumeric(username)) {
            return next(new CustomError('Nom d\'utilisateur invalide : seuls les caractères alphanumériques sont autorisés', 400));
        }
        //check if username exist
        const usernameCheck = await _findUser(username);
        if (usernameCheck) {
            return next(new CustomError('Nom d\'utilisateur est déjà utilisé', 400));
        }
        existingDisplayer.username = username;
    }
    if(password){
        // Validate password: ensure it's at least 8 characters long, contains one letter, one number, and one special character
        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return next(new CustomError('Mot de passe invalide : le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial', 400));
        }
        
        const hashedPassword = await hashPassword(password);
        existingDisplayer.password = hashedPassword;
    }
    if(zone){
        //check if zone exists
        const existingZone = await ZoneService.findZoneByCode(zone);
        if (!existingZone) {
            return next(new CustomError("Zone non trouvée", 404));
        }
        existingDisplayer.zone = existingZone.id;
    }
    //update displayer
    const updatedDisplayer = await existingDisplayer.save();
    //check if displayer is updated
    if (!updatedDisplayer) {
        return next(new CustomError('Erreur lors de la mise à jour du displayer. veuillez réessayer', 500));
    }
    //return response
    res.status(200).json({ message: 'Displayer mis à jour avec succès' });
});
//delete specific displayer
const DeleteDisplayer = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if name is provided
    if(!code || validator.isEmpty(code)){
        return next(new CustomError('Tout les champs doivent être remplis', 400));
    }

    // check if displayer exists
    const existingDisplayer = await DisplayerService.findDisplayerByCode(code);
    // Check if the user exists
    if (!existingDisplayer) {
        return next(new CustomError('Displayer non trouvé', 404));
    }

    //delete
    const deletedUser = await existingDisplayer.destroy();

    // Check if the user was deleted successfully
    if (!deletedUser) {
        return next(new CustomError('Un problème est survenu lors de la suppression d\'un displayer, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Displayer a été supprimé avec succès' });
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
    CreateDisplayer,
    GetAllDisplayers,
    UpdateDisplayer,
    DeleteDisplayer
}
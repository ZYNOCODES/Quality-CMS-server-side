const Displayer = require('../model/DisplayerModel.js');
const Agent = require('../model/AccessAgentModel.js');
const Manager = require('../model/ManagerModel.js');
const Zone = require('../model/ZoneModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const ZoneService = require('../service/ZoneService.js');
const {
    hashPassword,
} = require('../util/bcrypt.js');

//create new displayer
const CreateAgent = asyncErrorHandler(async (req, res, next) => {
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
    //check if zone exists
    const existingzone = await ZoneService.findZoneByCode(zone);
    if (!existingzone) {
        throw new CustomError("Zone existingzone", 404);
    }
    //check if username or phone number exists
    const usernameCheck = await _findUser(username);
    if (usernameCheck) {
        return next(new CustomError('Nom d\'utilisateur est déjà utilisé', 400));
    }
    //hash password
    const hashedPassword = await hashPassword(password);
    //create displayer
    const newDisplayer = await Displayer.create({
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
const GetAllAgents = asyncErrorHandler(async (req, res, next) => {
    const displayers = await Displayer.findAll({
        include: [
            {
                model: Zone,
                as: 'zoneAssociation',
            }
        ],
        raw: true
    });
    //check if displayers are found
    if (!displayers || displayers.length <= 0) {
        return next(new CustomError('Aucun displayer trouvé', 404));
    }
    //return response
    res.status(200).json(displayers);
});

//find user by username or phone
const _findUser = async (identifier) => {
    let user = await AccessAgent.findOne({
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
const { Op } = require('sequelize');
const validator = require('validator');
const AccessAgent = require('../model/AccessAgentModel.js');
const Technician = require('../model/TechnicianModel.js');
const Manager = require('../model/ManagerModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const ZoneService = require('../service/ZoneService.js');
const { generateUniqueCode } = require('../util/Codification.js');
const {
    createToken
} = require('../util/JWT.js');
const {
    hashPassword,
    comparePassword
} = require('../util/bcrypt.js');

//login
const SignIn = asyncErrorHandler(async (req, res, next) => {
    const { identifier, password } = req.body;

    // Check if identifier and password are provided
    if (validator.isEmpty(identifier) || validator.isEmpty(password)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Validate identifier and password format
    if (!validator.isAlphanumeric(identifier)) {
        return next(new CustomError('Identifiant ou mot de passe invalide', 400));
    }

    // Find the user by identifier in the appropriate table
    let user = await _findUser(identifier);

    // Check if user exists
    if (!user) {
        return next(new CustomError('Identifiant ou mot de passe invalide', 400));
    }

    // Compare the provided password with the stored hash
    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
        return next(new CustomError('Identifiant ou mot de passe invalide', 400));
    }

    //check if zone is exists
    const zone = await ZoneService.findZoneById(user.zone);
    if (!zone) {
        return next(new CustomError('Zone invalide', 400));
    }

    // Generate JWT token
    const token = createToken(user.id, user.role, user.code, zone.code);

    // Return token
    res.status(200).json({ token });
});
//SignUp
const SignUp = asyncErrorHandler(async (req, res, next) => {
    const { fullname, username, password, phoneNumber, role, zone } = req.body;
    //check if username or phone number exists
    let usernameCheck = await _findUser(username);
    let phoneNumberCheck = await _findUser(phoneNumber);
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
    //create user by role
    let user;
    switch (role) {
        case process.env.AGENT_TYPE:
            // Generate a unique code for the product
            const codeAA = await generateUniqueCode("AA", 6, AccessAgent);
            if (!codeAA) {
                return next(new CustomError('Erreur lors de la création d\'un utilisateur, veuillez réessayer.', 400));
            }

            user = await AccessAgent.create({
                code: codeAA,
                fullname,
                username,
                password: hashedPassword,
                phoneNumber,
                zone: existingZone.id
            });
            break;
        case process.env.TECHNICIAN_TYPE:
            // Generate a unique code for the product
            const codeT = await generateUniqueCode("T", 6, Technician);
            if (!codeT) {
                return next(new CustomError('Erreur lors de la création d\'un utilisateur, veuillez réessayer.', 400));
            }
            user = await Technician.create({
                code: codeT,
                fullname,
                username,
                password: hashedPassword,
                phoneNumber,
                zone: existingZone.id
            });
            break;
        case process.env.MANAGER_TYPE:
            // Generate a unique code for the product
            const codeM = await generateUniqueCode("M", 6, Manager);
            if (!codeM) {
                return next(new CustomError('Erreur lors de la création d\'un utilisateur, veuillez réessayer.', 400));
            }
            user = await Manager.create({
                code: codeM,
                fullname,
                username,
                password: hashedPassword,
                phoneNumber,
                zone: existingZone.id
            });
            break;
        default:
            return next(new CustomError('Rôle invalide', 400));
    }
    //check if user is created
    if (!user) {
        return next(new CustomError('Erreur lors de la création d\'un utilisateur', 400));
    }
    //return success message
    res.status(200).json({ message: 'Utilisateur créé avec succès' });
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
        user.role = process.env.AGENT_TYPE; // Set role for AccessAgent
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
        user.role = process.env.TECHNICIAN_TYPE; // Set role for Technician
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
        user.role = process.env.MANAGER_TYPE; // Set role for Manager
        return user;
    }

    return null; // Return null if no user found
};

module.exports = {
    SignIn,
    SignUp
}
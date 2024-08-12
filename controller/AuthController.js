const AccessAgent = require('../model/AccessAgentModel.js');
const Technician = require('../model/TechnicianModel.js');
const Manager = require('../model/ManagerModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { Op } = require('sequelize');
const {
    createToken
} = require('../util/JWT.js');
const {
    hashPassword,
    comparePassword
} = require('../util/bcrypt.js');
const moment = require('moment');
require('moment-timezone');

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
    // Generate JWT token
    const token = createToken(user.id, user.role);

    // Return token
    res.status(200).json({ token });
});
//SignUp
const SignUp = asyncErrorHandler(async (req, res, next) => {
    const { username, password, phoneNumber, role } = req.body;
    //check if username or phone number exists
    let usernameCheck = await _findUser(username);
    let phoneNumberCheck = await _findUser(phoneNumber);
    if (usernameCheck || phoneNumberCheck) {
        return next(new CustomError('Nom d\'utilisateur ou numéro de téléphone déjà utilisé', 400));
    }
    //hash password
    const hashedPassword = await hashPassword(password);
    //create user by role
    let user;
    switch (role) {
        case 'agent':
            user = await AccessAgent.create({
                username,
                password: hashedPassword,
                phoneNumber
            });
            break;
        case 'technician':
            user = await Technician.create({
                username,
                password: hashedPassword,
                phoneNumber
            });
            break;
        case 'manager':
            user = await Manager.create({
                username,
                password: hashedPassword,
                phoneNumber
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
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');

// Middleware to validate signup inputs
const validateSignup = asyncErrorHandler(async (req, res, next) => {
    const { username, password, phoneNumber, zone } = req.body;
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

    // If all inputs are valid, proceed to the next middleware
    next();
});
module.exports = {
    validateSignup
};
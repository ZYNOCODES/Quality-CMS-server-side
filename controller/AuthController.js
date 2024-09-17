const validator = require('validator');
const Agent = require('../model/AccessAgentModel.js');
const Manager = require('../model/ManagerModel.js');
const Displayer = require('../model/DisplayerModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const ZoneService = require('../service/ZoneService.js');
const {
    createToken
} = require('../util/JWT.js');
const {
    comparePassword
} = require('../util/bcrypt.js');

//login
const SignIn = asyncErrorHandler(async (req, res, next) => {
    const { identifier, password } = req.body;

    // Check if identifier and password are provided
    if (validator.isEmpty(identifier) || validator.isEmpty(password)) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Find the user by identifier in the appropriate table
    let user;
    if (validator.isMobilePhone(identifier, 'ar-DZ')) {
        user = await _findUserByPhone(identifier);
    }else if(validator.isAlphanumeric(identifier)){
        user = await _findUserByUsername(identifier);
    }else{
        return next(new CustomError('Identifiant ou mot de passe invalide', 400));
    }

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
    if(!user.code.startsWith('M')){
        const zone = await ZoneService.findZoneById(user.zone);
        if (!zone) {
            return next(new CustomError('Zone invalide', 400));
        }
        // Generate JWT token
        const token = createToken(user.id, user.role, user.code, zone.code);

        // Return token
        return res.status(200).json({ token });
    }

    // Generate JWT token
    const token = createToken(user.id, user.role, user.code, null);

    // Return token
    res.status(200).json({ token });
});

//find user by username
const _findUserByUsername = async (identifier) => {
    let user = await Agent.findOne({
        where: {
            username: identifier
        },
        raw: true
    });

    if (user) {
        user.role = process.env.AGENT_TYPE; // Set role for Agent
        return user;
    }

    user = await Manager.findOne({
        where: {
            username: identifier
        },
        raw: true
    });

    if (user) {
        user.role = process.env.MANAGER_TYPE; // Set role for Manager
        return user;
    }

    user = await Displayer.findOne({
        where: {
            username: identifier
        },
        raw: true
    });

    if (user) {
        user.role = process.env.DISPLAYER_TYPE; // Set role for displayer
        return user;
    }

    return null; // Return null if no user found
};
//find user by phone
const _findUserByPhone = async (identifier) => {
    let user = await Agent.findOne({
        where: {
            phoneNumber: identifier
        },
        raw: true
    });

    if (user) {
        user.role = process.env.AGENT_TYPE; // Set role for Agent
        return user;
    }

    user = await Manager.findOne({
        where: {
            phoneNumber: identifier
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
}
const jwt = require('jsonwebtoken');
const AccessAgent = require('../model/AccessAgentModel.js');
const Technician = require('../model/TechnicianModel.js');
const Manager = require('../model/ManagerModel.js');
const CustomError = require('../util/CustomError');
const asyncErrorHandler = require('../util/asyncErrorHandler');
const moment = require('moment');
require('moment-timezone');

const requireAuth = asyncErrorHandler(async (req, res, next) => {
    const {authorization} = req.headers;
    
    if(!authorization || !authorization.startsWith('Bearer ')){
        // If User is not logged in, return error
        const err = new CustomError('authorization token is required', 401);
        return next(err);
    }
    // Get token from header
    const token = authorization.split(' ')[1];

    // Verify token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        const error = new CustomError('Invalid or expired token. Please log in again.', 401);
        return next(error);
    }

    const { id, type, exp } = decodedToken;
    // Check if the token has expired
    const timezone = 'Africa/Algiers';
    const currentTime = moment.tz(timezone);
    if (currentTime.isSameOrAfter(exp * 1000)) {
        const err = new CustomError('Token has expired. Please log in again.', 401);
        return next(err);
    }
    // Retrieve user based on type in a single call
    let user;
    switch (type) {
        case process.env.MANAGER_TYPE:
            user = await Manager.findByPk(id);
            break;
        case process.env.AGENT_TYPE:
            user = await AccessAgent.findByPk(id);
            break;
        case process.env.TECHNICIAN_TYPE:
            user = await Technician.findByPk(id);
            break;
        default:
            return next(new CustomError('Authentication rejected', 401));
    }
    // Check if user exists
    if (!user) {
        return next(new CustomError('Authentication rejected', 401));
    }

    // Add user to request
    req.user = user;

    // Continue to next middleware
    next();
});
module.exports = requireAuth;
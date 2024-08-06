const User = require('../model/UserModel.js');
const UserService = require('../service/UserService.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const {
    createToken
} = require('../util/JWT.js');
const moment = require('moment');
require('moment-timezone');

//login
const SignIn = asyncErrorHandler(async (req, res, next) => {
    
});

//SignUp
const SignUp = asyncErrorHandler(async (req, res, next) => {
    
});

module.exports = {
    SignIn,
    SignUp
}
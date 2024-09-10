const express = require('express');
const router = express.Router();
const {
    SignIn,
} = require('../controller/AuthController.js');
const limiter = require('../middleware/RateLimiting.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//remove spaces from request
router.use(removeSpacesMiddleware);

//SHEARED ROUTES
router.post('/signin', limiter, SignIn);

module.exports = router;
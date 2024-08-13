const express = require('express');
const router = express.Router();
const {
    SignIn,
    SignUp
} = require('../controller/AuthController.js');
const {
    validateSignup
} = require('../middleware/Validation.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');

//SHEARED ROUTES
router.post('/signin', SignIn);
//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
router.post('/signup', checkAuthorization([process.env.MANAGER_TYPE]), validateSignup, SignUp);


module.exports = router;
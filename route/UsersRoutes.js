const express = require('express');
const router = express.Router();
const {
    GetAllUserByCode,
} = require('../controller/UsersController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const LimiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHEARCH ROUTES
//get specific technician by code
router.get('/:code', LimiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE, process.env.TECHNICIAN_TYPE]), GetAllUserByCode);

module.exports = router;
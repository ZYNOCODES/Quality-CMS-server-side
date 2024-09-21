const express = require('express');
const router = express.Router();
const {
    GetAllAgentUpdateActions
} = require('../controller/AgentUpdateActionsController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//MANAGER ROUTES
//get all agent update actions
router.get('/:code', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), GetAllAgentUpdateActions);

module.exports = router;
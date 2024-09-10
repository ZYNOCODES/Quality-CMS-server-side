const express = require('express');
const router = express.Router();
const {
    CreateAgent,
    GetAllAgents,
    UpdateAgent,
    DeleteAgent
} = require('../controller/AgentController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const {
    validateSignup
} = require('../middleware/Validation.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//MANAGER ROUTES
//Create a new agent
router.post('/create', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateAgent);
//GET all agents
router.get('/all', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), GetAllAgents);
//UPDATE an agent
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateAgent);
//DELETE an agent
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteAgent);


module.exports = router;
const express = require('express');
const router = express.Router();
const {
    GetRepairtimesByPanne,
    GetLastRepairtimeByPanne,
    PauseRepairtime,
    ResumeRepairtime
} = require('../controller/RepairtimeController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//SHEARED ROUTES
//Get Repairtimes by panne
router.get('/panne/:panne', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetRepairtimesByPanne);

//AGENT ROUTES
//Pause a repairtime
router.patch('/pause/:panne', limiter, checkAuthorization([process.env.AGENT_TYPE]), PauseRepairtime);
//Resume a repairtime
router.patch('/resume/:panne', limiter, checkAuthorization([process.env.AGENT_TYPE]), ResumeRepairtime);
//Get last repairtime by panne
router.get('/last/:panne', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), GetLastRepairtimeByPanne);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
    GetAllZones,
    CreateZone,
    UpdateZone,
    DeleteZone
} = require('../controller/ZoneController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all zones
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllZones);
//create a new zone
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateZone);
//update zone
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateZone);
//delete zone
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteZone);

module.exports = router;
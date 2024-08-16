const express = require('express');
const router = express.Router();
const {
    GetAllWorkshops,
    GetAllWorkshopsByZone,
    CreateWorkshop,
    UpdateWorkshop,
    DeleteWorkshop
} = require('../controller/WorkshopController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all workshops
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), GetAllWorkshops);
//get all workshops by zone
router.get('/:zone', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE, process.env.TECHNICIAN_TYPE]), GetAllWorkshopsByZone);
//create a new workshop
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateWorkshop);
//update workshop
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateWorkshop);
//delete workshop
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteWorkshop);

module.exports = router;
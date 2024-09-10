const express = require('express');
const router = express.Router();
const {
    GetAllWorkshops,
    GetAllWorkshopsByZone,
    GetAllWorkshopsByIDZone,
    CreateWorkshop,
    UpdateWorkshop,
    DeleteWorkshop
} = require('../controller/WorkshopController.js');
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
//get all workshops by zone
router.get('/:zone', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllWorkshopsByZone);
router.get('/byID/:id', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllWorkshopsByIDZone);

//MANAGER ROUTES
//get all workshops
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), GetAllWorkshops);
//create a new workshop
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateWorkshop);
//update workshop
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateWorkshop);
//delete workshop
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteWorkshop);

module.exports = router;
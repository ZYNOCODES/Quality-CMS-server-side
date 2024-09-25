const express = require('express');
const router = express.Router();
const {
    GetAllArrivals,
    CreateArrival,
    UpdateArrival,
    DeleteArrival
} = require('../controller/ArrivalController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//SHARED ROUTES
//get all Arrivals
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllArrivals);

//MANAGER ROUTES
//create a new Arrival
router.post('/create', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateArrival);
//update Arrival
router.patch('/update/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateArrival);
//delete Arrival
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteArrival);

module.exports = router;
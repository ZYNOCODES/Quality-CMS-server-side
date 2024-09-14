const express = require('express');
const router = express.Router();
const {
    GetAllLots,
    CreateLot,
    UpdateLot,
    DeleteLot
} = require('../controller/LotController.js');
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
//get all Lots
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllLots);

//MANAGER ROUTES
//create a new Lot
router.post('/create', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateLot);
//update Lot
router.patch('/update/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateLot);
//delete Lot
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteLot);

module.exports = router;
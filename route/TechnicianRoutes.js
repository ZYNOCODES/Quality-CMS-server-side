const express = require('express');
const router = express.Router();
const {
    CreateTechnician,
    GetAllTechnicians,
    GetTechnicianByZone,
    UpdateTechnician,
    DeleteTechnician
} = require('../controller/TechniciqnController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//AGENT ROUTES
//Get Technicians by zone
router.get('/zone/:zone', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), GetTechnicianByZone);

//MANAGER ROUTES
//Create a new Technician
router.post('/create', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateTechnician);
//Get all Technicians
router.get('/all', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), GetAllTechnicians);
//Update a Technician
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateTechnician);
//Delete a Technician
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteTechnician);


module.exports = router;
const express = require('express');
const router = express.Router();
const {
    getAllPannesByTechnician,
    getAllPannes,
    getSpecificPanne,
    getAllPannesByZone,
    getAllTakenPannes,
    getAllTakenPannesByZone,
    getAllCloturedPannes,
    getAllCloturedPannesByZone,
    firstPanneStep,
    secondPanneStep,
    thirdPanneStep,
    fourthPanneStep,
    DeletePanne,
    GetPannesByProduct
} = require('../controller/PanneController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHARED ROUTES
// get all pannes by zone
router.get('/byzone/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE, process.env.TECHNICIAN_TYPE]), getAllPannesByZone);
// get all taken pannes by zone
router.get('/linked/byzone/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllTakenPannesByZone);
// get all pannes by product
router.get('/byproduct/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE, process.env.MANAGER_TYPE, process.env.TECHNICIAN_TYPE]), GetPannesByProduct);
//get all clotured pannes by zone
router.get('/archive/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllCloturedPannesByZone); 
//get specific panne by code
router.get('/one/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE, process.env.MANAGER_TYPE, process.env.TECHNICIAN_TYPE]), getSpecificPanne);

//MANAGER ROUTES
//get all pannes
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), getAllPannes);
//get all taken pannes
router.get('/linked', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), getAllTakenPannes);
//get all clotured pannes
router.get('/archive', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), getAllCloturedPannes);

//AGENT ROUTES
//create a new panne
router.post('/first', limiter, checkAuthorization([process.env.AGENT_TYPE]), firstPanneStep);
//delete panne
router.delete('/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), DeletePanne);

//TECHNICIAN ROUTES
//get all pannes by technician
router.get('/technician/:code', limiterForGet, checkAuthorization([process.env.TECHNICIAN_TYPE]), getAllPannesByTechnician);
// second update panne 
router.patch('/second/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), secondPanneStep);
// third update panne
router.patch('/third/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), thirdPanneStep);
// fourth update panne
router.patch('/fourth/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), fourthPanneStep);

module.exports = router;
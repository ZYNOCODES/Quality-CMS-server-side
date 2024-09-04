const express = require('express');
const router = express.Router();
const {
    getAllPannesByTechnician,
    getAllArchivePannesByTechnician,
    getAllPannes,
    getSpecificPanne,
    getAllPannesByZone,
    getAllTakenPannes,
    getAllTakenPannesByZone,
    getAllCloturedPannes,
    getAllNoneDelivredPannes,
    getAllNoneDelivredPannesByZone,
    getAllCloturedPannesByZone,
    GetPannesByProduct,
    firstPanneStep,
    secondPanneStep,
    thirdPanneStep,
    fourthPanneStep,
    MakePanneDelivred,
    DeletePanne,
} = require('../controller/PanneController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHARED ROUTES
// get all pannes by product
router.get('/byproduct/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE, process.env.MANAGER_TYPE]), GetPannesByProduct);
//get specific panne by code
router.get('/one/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE, process.env.MANAGER_TYPE]), getSpecificPanne);
//get all archive pannes by technician
router.get('/technician/archive/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE, process.env.MANAGER_TYPE]), getAllArchivePannesByTechnician);

//MANAGER ROUTES
//get all pannes
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), getAllPannes);
//get all taken pannes
router.get('/linked', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), getAllTakenPannes);
//get all clotured pannes
router.get('/archive', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), getAllCloturedPannes);
//get all clotured pannes by zone
router.get('/nonedelivred', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), getAllNoneDelivredPannes);

//AGENT ROUTES
// get all pannes by zone
router.get('/byzone/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllPannesByZone);
// get all taken pannes by zone
router.get('/linked/byzone/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllTakenPannesByZone);
//get all clotured pannes by zone
router.get('/nonedelivred/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllNoneDelivredPannesByZone);
//get all clotured pannes by zone
router.get('/archive/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllCloturedPannesByZone); 
//create a new panne
router.post('/first', limiter, checkAuthorization([process.env.AGENT_TYPE]), firstPanneStep);
//delete panne
router.delete('/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), DeletePanne);
//get all pannes by technician
router.get('/technician/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllPannesByTechnician);
// second update panne 
router.patch('/second/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), secondPanneStep);
// third update panne
router.patch('/third/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), thirdPanneStep);
// fourth update panne
router.patch('/fourth/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), fourthPanneStep);
// make panne delivred
router.patch('/delivred/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), MakePanneDelivred);

module.exports = router;
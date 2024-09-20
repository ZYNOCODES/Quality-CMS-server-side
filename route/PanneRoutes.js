const express = require('express');
const router = express.Router();
const {
    getAllPannesByTechnician,
    getAllArchivePannesByTechnician,
    getAllPannes,
    getSpecificPanne,
    getAllPannesByAgent,
    getAllTakenPannes,
    getAllTakenPannesByAgent,
    getAllCloturedPannes,
    getAllNoneDelivredPannes,
    getAllNoneDelivredPannesByAgent,
    getAllCloturedPannesByAgent,
    GetPannesByProduct,
    firstPanneStep,
    secondPanneStep,
    thirdPanneStep,
    fourthPanneStep,
    MakePanneDelivred,
    MakeManyPannesDelivred,
    DeletePanne,
    updatePanne,
    ReOpenSpecificPanne,
    ReCloseSpecificPanne
} = require('../controller/PanneController.js');
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
router.get('/byagent/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllPannesByAgent);
// get all taken pannes by zone
router.get('/linked/byagent/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllTakenPannesByAgent);
//get all clotured pannes by zone
router.get('/nonedelivred/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllNoneDelivredPannesByAgent);
//get all clotured pannes by zone
router.get('/archive/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllCloturedPannesByAgent); 
//delete panne
router.delete('/:code/:agent', limiter, checkAuthorization([process.env.AGENT_TYPE]), DeletePanne);
//get all pannes by technician
router.get('/technician/:code', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), getAllPannesByTechnician);
//create a new panne
router.post('/first/:agent', limiter, checkAuthorization([process.env.AGENT_TYPE]), firstPanneStep);
// second update panne 
router.patch('/second/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), secondPanneStep);
// third update panne
router.patch('/third/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), thirdPanneStep);
// fourth update panne
router.patch('/fourth/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), fourthPanneStep);
// make panne delivred
router.patch('/delivred/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), MakePanneDelivred);
// make many pannes delivred
router.patch('/many/delivred', limiter, checkAuthorization([process.env.AGENT_TYPE]), MakeManyPannesDelivred);
// update panne
router.patch('/update/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), updatePanne);
// reopen specific panne
router.patch('/reopen/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), ReOpenSpecificPanne);
// reclose specific panne
router.patch('/reclose/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), ReCloseSpecificPanne);

module.exports = router;
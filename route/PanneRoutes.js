const express = require('express');
const router = express.Router();
const {
    firstPanneStep,
    getAllPannesByTechnician,
    getAllPannesByZone,
    secondPanneStep,
    thirdPanneStep,
    fourthPanneStep,
    DeletePanne
} = require('../controller/PanneController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHARED ROUTES
// get all pannes by zone
router.get('/byzone/:code', checkAuthorization([process.env.AGENT_TYPE, process.env.TECHNICIAN_TYPE]), getAllPannesByZone);

//AGENT ROUTES
//create a new panne
router.post('/first', checkAuthorization([process.env.AGENT_TYPE]), firstPanneStep);
//delete panne
router.delete('/:code', checkAuthorization([process.env.AGENT_TYPE]), DeletePanne);

//TECHNICIAN ROUTES
//get all pannes by technician
router.get('/technician/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), getAllPannesByTechnician);
// second update panne 
router.patch('/second/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), secondPanneStep);
// third update panne
router.patch('/third/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), thirdPanneStep);
// fourth update panne
router.patch('/fourth/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), fourthPanneStep);

module.exports = router;
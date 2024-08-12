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

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all zones
router.get('/', checkAuthorization(process.env.MANAGER_TYPE), GetAllZones);
//create a new zone
router.post('/', checkAuthorization(process.env.MANAGER_TYPE), CreateZone);
//update zone
router.patch('/:code', checkAuthorization(process.env.MANAGER_TYPE), UpdateZone);
//delete zone
router.delete('/:code', checkAuthorization(process.env.MANAGER_TYPE), DeleteZone);

module.exports = router;
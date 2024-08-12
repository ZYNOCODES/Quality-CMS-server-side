const express = require('express');
const router = express.Router();
const {
    GetAllWorkshops,
    CreateWorkshop,
    UpdateWorkshop,
    DeleteWorkshop
} = require('../controller/WorkshopController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all workshops
router.get('/', checkAuthorization(process.env.MANAGER_TYPE), GetAllWorkshops);
//create a new workshop
router.post('/', checkAuthorization(process.env.MANAGER_TYPE), CreateWorkshop);
//update workshop
router.patch('/:code', checkAuthorization(process.env.MANAGER_TYPE), UpdateWorkshop);
//delete workshop
router.delete('/:code', checkAuthorization(process.env.MANAGER_TYPE), DeleteWorkshop);

module.exports = router;
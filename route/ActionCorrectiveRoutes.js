const express = require('express');
const router = express.Router();
const {
    GetAllActionsCorrectiveByPanne,
    CreateActionCorrective,
    UpdateActionCorrective,
    DeleteActionCorrective
} = require('../controller/ActionCorrectiveController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHEARED ROUTES
//get all action corrective by panne
router.get('/:code', limiterForGet, checkAuthorization([process.env.TECHNICIAN_TYPE, process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllActionsCorrectiveByPanne);

//TECHNICIAN ROUTES
//update action corrective
router.patch('/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), UpdateActionCorrective);
//delete action corrective
router.delete('/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), DeleteActionCorrective);
//create a new action corrective
router.post('/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), CreateActionCorrective);

module.exports = router;
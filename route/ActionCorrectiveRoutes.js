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

//secure all routes below with requireAuth
router.use(requireAuth);
//TECHNICIAN ROUTES
//get all action corrective by panne
router.get('/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), GetAllActionsCorrectiveByPanne);
//create a new action corrective
router.post('/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), CreateActionCorrective);
//update action corrective
router.patch('/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), UpdateActionCorrective);
//delete action corrective
router.delete('/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), DeleteActionCorrective);

module.exports = router;
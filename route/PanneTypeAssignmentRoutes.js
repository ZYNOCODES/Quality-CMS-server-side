const express = require('express');
const router = express.Router();
const {
    GetAllPanneTypeAssignmentByPanne,
    CreatePanneTypeAssignment,
    UpdatePanneTypeAssignment,
    DeletePanneTypeAssignment
} = require('../controller/PanneTypeAssignmentController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//SHEARED ROUTES
//get all type panne assignments by panne
router.get('/:code', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllPanneTypeAssignmentByPanne);

//TECHNICIAN ROUTES
//update type panne assignment
router.patch('/update/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), UpdatePanneTypeAssignment);
//delete type panne assignment
router.delete('/:code/:agent', limiter, checkAuthorization([process.env.AGENT_TYPE]), DeletePanneTypeAssignment);
//create a new type panne assignment
router.post('/create/:code', limiter, checkAuthorization([process.env.AGENT_TYPE]), CreatePanneTypeAssignment);

module.exports = router;
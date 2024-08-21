const express = require('express');
const router = express.Router();
const {
    GetAllPanneTypes,
    CreatePanneType,
    UpdatePanneType,
    DeletePanneType
} = require('../controller/PanneTypeController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHARED ROUTES
//get all PanneTypes
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllPanneTypes);

//MANAGER ROUTES
//create a new PanneType
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreatePanneType);
//update PanneType
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdatePanneType);
//delete PanneType
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeletePanneType);

module.exports = router;
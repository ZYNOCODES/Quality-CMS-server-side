const express = require('express');
const router = express.Router();
const {
    GetAllFamilies,
    CreateFamily,
    UpdateFamily,
    DeleteFamily
} = require('../controller/FamilyController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all familys
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllFamilies);
//create a new family
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateFamily);
//update family
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateFamily);
//delete family
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteFamily);

module.exports = router;
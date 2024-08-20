const express = require('express');
const router = express.Router();
const {
    GetAllConsommationsByPanne,
    CreateConsommation,
    UpdateConsommation,
    DeleteConsommation
} = require('../controller/ConsommationController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHEARED ROUTES
//get all consommation PDR by panne
router.get('/:code', limiterForGet, checkAuthorization([process.env.TECHNICIAN_TYPE, process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllConsommationsByPanne);

//TECHNICIAN ROUTES
//create a new consommation PDR
router.post('/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), CreateConsommation);
//update consommation PDR
router.patch('/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), UpdateConsommation);
//delete consommation PDR
router.delete('/:code', limiter, checkAuthorization([process.env.TECHNICIAN_TYPE]), DeleteConsommation);

module.exports = router;
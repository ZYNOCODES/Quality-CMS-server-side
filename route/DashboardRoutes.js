const express = require('express');
const router = express.Router();
const {
    CountAllPannes,
    CountPannesBetweenSEDate,
    CountPannesByMonth,
    CountTopPannes,
    CountTopActionsCorrectives,
    CountTopConsommations
} = require('../controller/DashboardController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHEARED ROUTES
//MANAGER ROUTES
// count all pannes
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountAllPannes);
//count pannes between start and end date
router.get('/count', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountPannesBetweenSEDate);
//count pannes by month
router.get('/month', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountPannesByMonth);
//top 4 pannes
router.get('/top/panne', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopPannes);
//top 4 actions correctives
router.get('/top/action', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopActionsCorrectives);
//top 4 consommations
router.get('/top/consommation', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopConsommations);

module.exports = router;
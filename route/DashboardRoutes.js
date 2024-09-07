const express = require('express');
const router = express.Router();
const {
    CountAllPannes,
    CountPannesBetweenSEDate,
    CountPannesToday,
    CountPannesByMonth,
    CountTopPannes,
    CountTopActionsCorrectives,
    CountTopConsommations,
    CountTopTechnicians
} = require('../controller/DashboardController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);

//SHEARED ROUTES
// count all pannes
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.TECHNICIAN_TYPE]), CountAllPannes);
//count pannes of today
router.get('/count/today', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.TECHNICIAN_TYPE]), CountPannesToday);

//MANAGER ROUTES
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
//top 5 technicians
router.get('/top/technician', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopTechnicians);

module.exports = router;
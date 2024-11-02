const express = require('express');
const router = express.Router();
const {
    CountAllPannes,
    CountPannesBetweenSEDate,
    CountAllPannesByZone,
    CountPannesTodayByZone,
    CountPannesByMonth,
    CountTopPannes,
    CountTopActionsCorrectives,
    CountTopConsommations,
    CountTopTechnicians,
    CountTopSources,
    CountTopOrigines,
    CountTopPannesBetweenSEDate,
    CountTopActionsCorrectivesBetweenSEDate,
    CountTopConsommationsBetweenSEDate,
} = require('../controller/DashboardController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//DISPLAYER ROUTES
//count pannes of today by zone
router.get('/count/today/:zone', limiterForGet, checkAuthorization([process.env.DISPLAYER_TYPE]), CountPannesTodayByZone);
// count all pannes by zone
router.get('/byzone/:zone', limiterForGet, checkAuthorization([process.env.DISPLAYER_TYPE]), CountAllPannesByZone);

//MANAGER ROUTES
// count all pannes
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountAllPannes);
//count pannes between start and end date
router.get('/count', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountPannesBetweenSEDate);
//count pannes by month
router.get('/month', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountPannesByMonth);
//top 4 pannes
router.get('/top/panne', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopPannes);
//top 4 panne between start and end date
router.get('/top/panne/count', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopPannesBetweenSEDate);
//top 4 actions correctives
router.get('/top/action', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopActionsCorrectives);
//top 4 actions correctives between start and end date
router.get('/top/action/count', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopActionsCorrectivesBetweenSEDate);
//top 4 consommations
router.get('/top/consommation', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopConsommations);
//top 4 consommations between start and end date
router.get('/top/consommation/count', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopConsommationsBetweenSEDate);
//top 5 technicians
router.get('/top/technician', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopTechnicians);
//top 5 sources
router.get('/top/source', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopSources);
//top 5 origines
router.get('/top/origine', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), CountTopOrigines);

module.exports = router;
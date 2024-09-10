const express = require('express');
const router = express.Router();
const {
    CreateDisplayer,
    GetAllDisplayers,
    UpdateDisplayer,
    DeleteDisplayer
} = require('../controller/DisplayerController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//MANAGER ROUTES
//create a new family
router.post('/create', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateDisplayer);
//get all displayers
router.get('/all', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), GetAllDisplayers);
//update family
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateDisplayer);
//delete family
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteDisplayer);

module.exports = router;
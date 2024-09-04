const express = require('express');
const router = express.Router();
const {
    GetAllActions,
    CreateAction,
    UpdateAction,
    DeleteAction
} = require('../controller/ActionController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all actions
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllActions);
//create an action
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateAction);
//update an action
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateAction);
//delete an action
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteAction);

module.exports = router;
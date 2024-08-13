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

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all actions
router.get('/', checkAuthorization([process.env.MANAGER_TYPE]), GetAllActions);
//create an action
router.post('/', checkAuthorization([process.env.MANAGER_TYPE]), CreateAction);
//update an action
router.patch('/:code', checkAuthorization([process.env.MANAGER_TYPE]), UpdateAction);
//delete an action
router.delete('/:code', checkAuthorization([process.env.MANAGER_TYPE]), DeleteAction);

module.exports = router;
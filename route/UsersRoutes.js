const express = require('express');
const router = express.Router();
const {
    GetAllUsers,
    UpdateUser,
    DeleteUser
} = require('../controller/UsersController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const LimiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
router.get('/', LimiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), GetAllUsers);
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateUser);
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteUser);


module.exports = router;
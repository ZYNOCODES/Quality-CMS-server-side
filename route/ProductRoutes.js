const express = require('express');
const router = express.Router();
const {
    GetAllProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct
} = require('../controller/ProductController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all workshops
router.get('/:zone', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllProducts);
//create a new workshop
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateProduct);
//update workshop
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateProduct);
//delete workshop
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteProduct);

module.exports = router;
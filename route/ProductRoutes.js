const express = require('express');
const router = express.Router();
const {
    GetAllProducts,
    GetProduct,
    CreateProduct,
    UpdateProduct,
    DeleteProduct
} = require('../controller/ProductController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

//SHARED ROUTES
//get all workshops
router.get('/:zone', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllProducts);
//get specific product by code
router.get('/one/:code', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetProduct);

//MANAGER ROUTES
//create a new workshop
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateProduct);
//update workshop
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateProduct);
//delete workshop
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteProduct);

module.exports = router;
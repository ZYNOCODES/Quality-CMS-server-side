const express = require('express');
const router = express.Router();
const {
    GetAllProducts,
    GetAllProductsByZone,
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
//get specific product by code
router.get('/one/:code', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetProduct);

//AGENT ROUTES
//get all products by zone
router.get('/:zone', limiterForGet, checkAuthorization([process.env.AGENT_TYPE]), GetAllProductsByZone);

//MANAGER ROUTES
//get all products
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE]), GetAllProducts);
//create a new workshop
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreateProduct);
//update workshop
router.patch('/update/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdateProduct);
//delete workshop
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeleteProduct);

module.exports = router;
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

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all workshops
router.get('/:zone', checkAuthorization([process.env.MANAGER_TYPE]), GetAllProducts);
//create a new workshop
router.post('/', checkAuthorization([process.env.MANAGER_TYPE]), CreateProduct);
//update workshop
router.patch('/:code', checkAuthorization([process.env.MANAGER_TYPE]), UpdateProduct);
//delete workshop
router.delete('/:code', checkAuthorization([process.env.MANAGER_TYPE]), DeleteProduct);

module.exports = router;
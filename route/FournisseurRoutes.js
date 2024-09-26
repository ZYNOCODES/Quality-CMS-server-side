const express = require('express');
const router = express.Router();
const {
    createFournisseur,
    getAllFournisseurs,
    updateFournisseur,
    deleteFournisseur
} = require('../controller/FournisseurController.js');
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
//get all fournisseurs
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), getAllFournisseurs);

//MANAGER ROUTES
//create a new fournisseur
router.post('/create', limiter, checkAuthorization([process.env.MANAGER_TYPE]), createFournisseur);
//update fournisseur
router.patch('/update/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), updateFournisseur);
//delete fournisseur
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), deleteFournisseur);

module.exports = router;
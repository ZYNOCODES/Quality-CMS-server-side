const express = require('express');
const router = express.Router();
const {
    GetAllConsommationsByPanne,
    CreateConsommation,
    UpdateConsommation,
    DeleteConsommation
} = require('../controller/ConsommationController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//TECHNICIAN ROUTES
//get all consommation PDR by panne
router.get('/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), GetAllConsommationsByPanne);
//create a new consommation PDR
router.post('/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), CreateConsommation);
//update consommation PDR
router.patch('/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), UpdateConsommation);
//delete consommation PDR
router.delete('/:code', checkAuthorization([process.env.TECHNICIAN_TYPE]), DeleteConsommation);

module.exports = router;
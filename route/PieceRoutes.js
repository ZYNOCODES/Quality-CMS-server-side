const express = require('express');
const router = express.Router();
const {
    GetAllPieces,
    CreatePiece,
    UpdatePiece,
    DeletePiece
} = require('../controller/PieceController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const limiterForGet = require('../middleware/RateLimiterForGet.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all pieces
router.get('/', limiterForGet, checkAuthorization([process.env.MANAGER_TYPE, process.env.AGENT_TYPE]), GetAllPieces);
//create a new piece
router.post('/', limiter, checkAuthorization([process.env.MANAGER_TYPE]), CreatePiece);
//update piece
router.patch('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), UpdatePiece);
//delete piece
router.delete('/:code', limiter, checkAuthorization([process.env.MANAGER_TYPE]), DeletePiece);

module.exports = router;
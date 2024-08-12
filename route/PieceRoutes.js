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

//secure all routes below with requireAuth
router.use(requireAuth);
//MANAGER ROUTES
//get all pieces
router.get('/', checkAuthorization(process.env.MANAGER_TYPE), GetAllPieces);
//create a new piece
router.post('/', checkAuthorization(process.env.MANAGER_TYPE), CreatePiece);
//update piece
router.patch('/:code', checkAuthorization(process.env.MANAGER_TYPE), UpdatePiece);
//delete piece
router.delete('/:code', checkAuthorization(process.env.MANAGER_TYPE), DeletePiece);

module.exports = router;
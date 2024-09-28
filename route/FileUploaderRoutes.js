const express = require('express');
const router = express.Router();
const {
    UploadProductXLSXFile,
    UploadFamilyXLSXFile,
    UploadZoneXLSXFile,
    UploadLotXLSXFile,
    UploadWorkshopXLSXFile,
    UploadPanneTypeXLSXFile,
    UploadActionXLSXFile,
    UploadPieceXLSXFile,
    UploadArrivalXLSXFile,
    UploadFournisseurXLSXFile
} = require('../controller/FileUploaderController.js');
const requireAuth = require('../middleware/RequireAuth.js');
const fileUploader = require('express-fileupload');
const checkAuthorization = require('../middleware/Authorization.js');
const limiter = require('../middleware/RateLimiting.js');
const removeSpacesMiddleware = require('../middleware/RemoveSpacesMiddleware.js');

//secure all routes below with requireAuth
router.use(requireAuth);
//remove spaces from request
router.use(removeSpacesMiddleware);

const UploadOPTs = {
    useTempFiles: true,
    tempFileDir: '/tmp/'
}

//MANAGER ROUTES
//upload products xlsx file
router.post('/upload/product', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadProductXLSXFile);
//upload families xlsx file
router.post('/upload/family', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadFamilyXLSXFile);
//upload zones xlsx file
router.post('/upload/zone', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadZoneXLSXFile);
//upload lots xlsx file
router.post('/upload/lot', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadLotXLSXFile);
//upload workshops xlsx file
router.post('/upload/workshop', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadWorkshopXLSXFile);
//upload pannes types xlsx file
router.post('/upload/pannetype', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadPanneTypeXLSXFile);
//upload actions xlsx file
router.post('/upload/action', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadActionXLSXFile);
//upload pieces xlsx file
router.post('/upload/piece', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadPieceXLSXFile);
//upload arrivals xlsx file
router.post('/upload/arrival', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadArrivalXLSXFile);
//upload fournisseurs xlsx file
router.post('/upload/fournisseur', limiter, checkAuthorization([process.env.MANAGER_TYPE]), fileUploader(UploadOPTs), UploadFournisseurXLSXFile);

module.exports = router;
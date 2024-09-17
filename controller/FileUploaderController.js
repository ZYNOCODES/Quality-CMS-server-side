const XLSX = require('xlsx');
const fs = require('fs');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const Product = require('../model/ProductModel');
const ProductService = require('../service/ProductService.js');
const Lot = require('../model/LotModel');
const LotService = require('../service/LotService.js');
const Family = require('../model/FamilyModel');
const FamilyService = require('../service/FamilyService.js');
const Zone = require('../model/ZoneModel');
const ZoneService = require('../service/ZoneService.js');
const Workshop = require('../model/WorkshopModel');
const WorkshopService = require('../service/WorkshopService.js');
const PanneType = require('../model/PanneTypeModel');
const PanneTypeService = require('../service/PanneTypeService.js');
const Action = require('../model/ActionModel');
const ActionService = require('../service/ActionService.js');
const Piece = require('../model/PieceModel');
const PieceService = require('../service/PieceService.js');
const { generateUniqueCode } = require('../util/Codification.js');

const UploadProductXLSXFile = asyncErrorHandler(async (req, res, next) => {
    const { excel } = req.files;
    if (!excel) {
        const err = new CustomError('Aucun fichier téléchargé', 400);
        return next(err);
    }

    if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const err = new CustomError('Type de fichier invalide', 400);
        fs.unlinkSync(excel.tempFilePath);
        return next(err);
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const SheetName = workbook.SheetNames[0];
    const Data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

    const errorData = [];

    for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
        if(!item.Modele || !item.Marque || !item.Lot || !item.Family || !item.Zone){
            const err = new CustomError('Format de fichier invalide', 400);
            fs.unlinkSync(excel.tempFilePath);
            return next(err);
        }
        // récupérer l'ID du lot à partir du nom du lot
        const existinglot = await LotService.findLotByName(item.Lot);
        if(!existinglot){
            errorData.push({item, msg: 'Nom de lot invalide'});
            continue;
        }

        // récupérer l'ID de la famille à partir du nom de la famille
        const existingfamily = await FamilyService.findFamilyByName(item.Family);
        if(!existingfamily){
            errorData.push({item, msg: 'Nom de famille invalide'});
            continue;
        }

        // récupérer l'ID de la zone à partir du nom de la zone
        const existingzone = await ZoneService.findZoneByName(item.Zone);
        if(!existingzone){
            errorData.push({item, msg: 'Nom de zone invalide'});
            continue;
        }

        // vérifier si le produit existe
        const product = await ProductService.findProductByModelAndLot(item.Modele, existinglot.id);
        if(product){
            errorData.push({item, msg: 'Le produit existe déjà'});
            continue;
        }

        // Générer un code unique pour le produit
        const code = await generateUniqueCode(`P${i}`, 6, Product);
        if (!code) {
            errorData.push({item, msg: 'Échec de la génération du code produit, veuillez réessayer.'});
            continue;
        }

        // sinon, créer un nouveau produit
        const newProduct = await Product.create({
            code: code,
            marque: item.Marque,
            model: item.Modele,
            lot: existinglot.id,
            family: existingfamily.id,
            zone: existingzone.id
        });
        if(!newProduct){
            errorData.push({item, msg: 'Échec de la création du produit, veuillez réessayer.'});
            continue;
        }

    }

    fs.unlinkSync(excel.tempFilePath);
    res.status(200).json({
        success: errorData.length === 0 ? true : false,
        message: errorData.length === 0 ? 'Produits téléchargés avec succès' : 'Certains produits n\'ont pas pu être téléchargés',
        errorData: errorData
    });
});

const UploadFamilyXLSXFile = asyncErrorHandler(async (req, res, next) => {
    const { excel } = req.files;
    if (!excel) {
        const err = new CustomError('Aucun fichier téléchargé', 400);
        return next(err);
    }

    if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const err = new CustomError('Type de fichier invalide', 400);
        fs.unlinkSync(excel.tempFilePath);
        return next(err);
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const SheetName = workbook.SheetNames[0];
    const Data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

    const errorData = [];

    for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
        if(!item.Nom){
            const err = new CustomError('Format de fichier invalide', 400);
            fs.unlinkSync(excel.tempFilePath);
            return next(err);
        }

        // vérifier si la famille existe
        const family = await FamilyService.findFamilyByName(item.Nom);
        if(family){
            errorData.push({item, msg: 'La famille existe déjà'});
            continue;
        }

        // Générer un code unique pour la famille
        const code = await generateUniqueCode(`F${i}`, 6, Family);
        if (!code) {
            errorData.push({item, msg: 'Échec de la génération du code famille, veuillez réessayer.'});
            continue;
        }

        // sinon, créer une nouvelle famille
        const newFamily = await Family.create({
            code: code,
            name: item.Nom
        });
        if(!newFamily){
            errorData.push({item, msg: 'Échec de la création de la famille, veuillez réessayer.'});
            continue;
        }

    }

    fs.unlinkSync(excel.tempFilePath);
    res.status(200).json({
        success: errorData.length === 0 ? true : false,
        message: errorData.length === 0 ? 'Familles téléchargées avec succès' : 'Certaines familles n\'ont pas pu être téléchargées',
        errorData: errorData
    });
});

const UploadZoneXLSXFile = asyncErrorHandler(async (req, res, next) => {
    const { excel } = req.files;
    if (!excel) {
        const err = new CustomError('Aucun fichier téléchargé', 400);
        return next(err);
    }

    if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const err = new CustomError('Type de fichier invalide', 400);
        fs.unlinkSync(excel.tempFilePath);
        return next(err);
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const SheetName = workbook.SheetNames[0];
    const Data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

    const errorData = [];

    for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
        if(!item.Nom){
            const err = new CustomError('Format de fichier invalide', 400);
            fs.unlinkSync(excel.tempFilePath);
            return next(err);
        }

        // vérifier si la zone existe
        const zone = await ZoneService.findZoneByName(item.Nom);
        if(zone){
            errorData.push({item, msg: 'La zone existe déjà'});
            continue;
        }

        // Générer un code unique pour la zone
        const code = await generateUniqueCode(`Z${i}`, 6, Zone);
        if (!code) {
            errorData.push({item, msg: 'Échec de la génération du code zone, veuillez réessayer.'});
            continue;
        }

        // sinon, créer une nouvelle zone
        const newZone = await Zone.create({
            code: code,
            name: item.Nom
        });
        if(!newZone){
            errorData.push({item, msg: 'Échec de la création de la zone, veuillez réessayer.'});
            continue;
        }

    }

    fs.unlinkSync(excel.tempFilePath);
    res.status(200).json({
        success: errorData.length === 0 ? true : false,
        message: errorData.length === 0 ? 'Zones téléchargées avec succès' : 'Certaines zones n\'ont pas pu être téléchargées',
        errorData: errorData
    });
});

const UploadLotXLSXFile = asyncErrorHandler(async (req, res, next) => {
    const { excel } = req.files;
    if (!excel) {
        const err = new CustomError('Aucun fichier téléchargé', 400);
        return next(err);
    }

    if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const err = new CustomError('Type de fichier invalide', 400);
        fs.unlinkSync(excel.tempFilePath);
        return next(err);
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const SheetName = workbook.SheetNames[0];
    const Data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

    const errorData = [];

    for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
        if(!item.Nom){
            const err = new CustomError('Format de fichier invalide', 400);
            fs.unlinkSync(excel.tempFilePath);
            return next(err);
        }

        // vérifier si le lot existe
        const lot = await LotService.findLotByName(item.Nom);
        if(lot){
            errorData.push({item, msg: 'Le lot existe déjà'});
            continue;
        }

        // Générer un code unique pour le lot
        const code = await generateUniqueCode(`L${i}`, 6, Lot);
        if (!code) {
            errorData.push({item, msg: 'Échec de la génération du code lot, veuillez réessayer.'});
            continue;
        }

        // sinon, créer un nouveau lot
        const newLot = await Lot.create({
            code: code,
            name: item.Nom
        });
        if(!newLot){
            errorData.push({item, msg: 'Échec de la création du lot, veuillez réessayer.'});
            continue;
        }

    }

    fs.unlinkSync(excel.tempFilePath);
    res.status(200).json({
        success: errorData.length === 0 ? true : false,
        message: errorData.length === 0 ? 'Lots téléchargés avec succès' : 'Certains lots n\'ont pas pu être téléchargés',
        errorData: errorData
    });
});

const UploadWorkshopXLSXFile = asyncErrorHandler(async (req, res, next) => {
    const { excel } = req.files;
    if (!excel) {
        const err = new CustomError('Aucun fichier téléchargé', 400);
        return next(err);
    }

    if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const err = new CustomError('Type de fichier invalide', 400);
        fs.unlinkSync(excel.tempFilePath);
        return next(err);
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const SheetName = workbook.SheetNames[0];
    const Data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

    const errorData = [];

    for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
        if(!item.Nom || !item.Zone){
            const err = new CustomError('Format de fichier invalide', 400);
            fs.unlinkSync(excel.tempFilePath);
            return next(err);
        }

        // vérifier si la zone existe
        const zone = await ZoneService.findZoneByName(item.Zone);
        if(!zone){
            errorData.push({item, msg: 'Nom de zone invalide'});
            continue;
        }

        // vérifier si l'atelier existe
        const workshop = await WorkshopService.findWorkshopByZoneANDName(zone.id, item.Nom);
        if(workshop){
            errorData.push({item, msg: `L'atelier existe déjà dans cette zone ${zone.name}`});
            continue;
        }

        // Générer un code unique pour l'atelier
        const code = await generateUniqueCode(`W${i}`, 6, Workshop);
        if (!code) {
            errorData.push({item, msg: 'Échec de la génération du code atelier, veuillez réessayer.'});
            continue;
        }

        // si non, créer un nouvel atelier
        const newWorkshop = await Workshop.create({
            code: code,
            name: item.Nom,
            zone: zone.id
        });
        if(!newWorkshop){
            errorData.push({item, msg: 'Échec de la création de l\'atelier, veuillez réessayer.'});
            continue;
        }

    }

    fs.unlinkSync(excel.tempFilePath);
    res.status(200).json({
        success: errorData.length === 0 ? true : false,
        message: errorData.length === 0 ? 'Ateliers téléchargés avec succès' : 'Certains ateliers n\'ont pas pu être téléchargés',
        errorData: errorData
    });
});

const UploadPanneTypeXLSXFile = asyncErrorHandler(async (req, res, next) => {
    const { excel } = req.files;
    if (!excel) {
        const err = new CustomError('Aucun fichier téléchargé', 400);
        return next(err);
    }

    if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const err = new CustomError('Type de fichier invalide', 400);
        fs.unlinkSync(excel.tempFilePath);
        return next(err);
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const SheetName = workbook.SheetNames[0];
    const Data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

    const errorData = [];

    for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
        if(!item.Nom){
            const err = new CustomError('Format de fichier invalide', 400);
            fs.unlinkSync(excel.tempFilePath);
            return next(err);
        }

        // vérifier si le type de panne existe
        const panneType = await PanneTypeService.findPanneTypeByName(item.Nom);
        if(panneType){
            errorData.push({item, msg: 'Le type de panne existe déjà'});
            continue;
        }

        // Générer un code unique pour le type de panne
        const code = await generateUniqueCode(`PT${i}`, 6, PanneType);
        if (!code) {
            errorData.push({item, msg: 'Échec de la génération du code type de panne, veuillez réessayer.'});
            continue;
        }

        // sinon, créer un nouveau type de panne
        const newPanneType = await PanneType.create({
            code: code,
            name: item.Nom
        });
        if(!newPanneType){
            errorData.push({item, msg: 'Échec de la création du type de panne, veuillez réessayer.'});
            continue;
        }

    }

    fs.unlinkSync(excel.tempFilePath);
    res.status(200).json({
        success: errorData.length === 0 ? true : false,
        message: errorData.length === 0 ? 'Types de pannes téléchargés avec succès' : 'Certains types de pannes n\'ont pas pu être téléchargés',
        errorData: errorData
    });
});

const UploadActionXLSXFile = asyncErrorHandler(async (req, res, next) => {
    const { excel } = req.files;
    if (!excel) {
        const err = new CustomError('Aucun fichier téléchargé', 400);
        return next(err);
    }

    if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const err = new CustomError('Type de fichier invalide', 400);
        fs.unlinkSync(excel.tempFilePath);
        return next(err);
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const SheetName = workbook.SheetNames[0];
    const Data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

    const errorData = [];

    for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
        if(!item.Nom){
            const err = new CustomError('Format de fichier invalide', 400);
            fs.unlinkSync(excel.tempFilePath);
            return next(err);
        }

        // vérifier si l'action existe
        const action = await ActionService.findActionByName(item.Nom);
        if(action){
            errorData.push({item, msg: 'L\'action existe déjà'});
            continue;
        }

        // Générer un code unique pour l'action
        const code = await generateUniqueCode(`AC${i}`, 6, Action);
        if (!code) {
            errorData.push({item, msg: 'Échec de la génération du code action, veuillez réessayer.'});
            continue;
        }

        // sinon, créer une nouvelle action
        const newAction = await Action.create({
            code: code,
            name: item.Nom,
            duree: item.Duree || 0
        });
        if(!newAction){
            errorData.push({item, msg: 'Échec de la création de l\'action, veuillez réessayer.'});
            continue;
        }

    }

    fs.unlinkSync(excel.tempFilePath);
    res.status(200).json({
        success: errorData.length === 0 ? true : false,
        message: errorData.length === 0 ? 'Actions téléchargées avec succès' : 'Certaines actions n\'ont pas pu être téléchargées',
        errorData: errorData
    });
});

const UploadPieceXLSXFile = asyncErrorHandler(async (req, res, next) => {
    const { excel } = req.files;
    if (!excel) {
        const err = new CustomError('Aucun fichier téléchargé', 400);
        return next(err);
    }

    if(excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const err = new CustomError('Type de fichier invalide', 400);
        fs.unlinkSync(excel.tempFilePath);
        return next(err);
    }

    const workbook = XLSX.readFile(excel.tempFilePath);
    const SheetName = workbook.SheetNames[0];
    const Data = XLSX.utils.sheet_to_json(workbook.Sheets[SheetName]);

    const errorData = [];

    for (let i = 0; i < Data.length; i++) {
        const item = Data[i];
        if(!item.Nom){
            const err = new CustomError('Format de fichier invalide', 400);
            fs.unlinkSync(excel.tempFilePath);
            return next(err);
        }

        // vérifier si la pièce existe
        const piece = await PieceService.findPieceByName(item.Nom);
        if(piece){
            errorData.push({item, msg: 'La pièce existe déjà'});
            continue;
        }

        // Générer un code unique pour la pièce
        const code = await generateUniqueCode(`PC${i}`, 6, Piece);
        if (!code) {
            errorData.push({item, msg: 'Échec de la génération du code pièce, veuillez réessayer.'});
            continue;
        }

        // sinon, créer une nouvelle pièce
        const newPiece = await Piece.create({
            code: code,
            name: item.Nom,
        });
        if(!newPiece){
            errorData.push({item, msg: 'Échec de la création de la pièce, veuillez réessayer.'});
            continue;
        }

    }

    fs.unlinkSync(excel.tempFilePath);
    res.status(200).json({
        success: errorData.length === 0 ? true : false,
        message: errorData.length === 0 ? 'Pièces téléchargées avec succès' : 'Certaines pièces n\'ont pas pu être téléchargées',
        errorData: errorData
    });
});


module.exports = {
    UploadProductXLSXFile,
    UploadFamilyXLSXFile,
    UploadZoneXLSXFile,
    UploadLotXLSXFile,
    UploadWorkshopXLSXFile,
    UploadPanneTypeXLSXFile,
    UploadActionXLSXFile,
    UploadPieceXLSXFile
}

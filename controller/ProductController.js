const Product = require('../model/ProductModel.js');
const Zone = require('../model/ZoneModel.js');
const Family = require('../model/FamilyModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const { generateUniqueCode } = require('../util/Codification.js');
const FamilyService = require('../service/FamilyService.js');
const ZoneService = require('../service/ZoneService.js');
const ProductService = require('../service/ProductService.js');
const PanneService = require('../service/PanneService.js');

//get all Products
const GetAllProducts = asyncErrorHandler(async (req, res, next) => {
    console.log('*************************GetAllProducts*************************');
    const { zone } = req.params;
    //check if the zone is provided
    if ([zone].some(field => !field || validator.isEmpty(field))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    
    //check if the zone exists
    const existingZone = await ZoneService.findZoneByCode(zone);
    if (!existingZone) {
        return next(new CustomError('Zone non trouvée', 404));
    }

    //get all Products
    //check if req.user.code start with 'M' to get all Products
    let Products = null;
    if(req.user.code.startsWith('M'))
        Products = await Product.findAll({
            include: [
                {
                    model: Family,
                    as: 'familyAssociation',
                    attributes: ['code', 'name']
                },
                {
                    model: Zone,
                    as: 'zoneAssociation',
                    attributes: ['code', 'name']
                }
            ]
        });
    else
        Products = await Product.findAll({
            where: {
                zone: existingZone.id
            },
            include: [
                {
                    model: Family,
                    as: 'familyAssociation',
                    attributes: ['code', 'name']
                },
                {
                    model: Zone,
                    as: 'zoneAssociation',
                    attributes: ['code', 'name']
                }
            ]
        });
    
    //check if there are Products
    if (!Products || Products.length < 1) {
        return next(new CustomError('Aucun produit trouvé', 404));
    }
    res.status(200).json(Products);
});
//create a new Product
const CreateProduct = asyncErrorHandler(async (req, res, next) => {
    const { marque, model, lot, family, zone } = req.body;
    // Check if the required fields are provided
    if ([marque, model, lot].some(field => !field || validator.isEmpty(field.toString()))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Check if the family exists
    if(family && !validator.isEmpty(family.toString())){
        const existingFamily = await FamilyService.findFamilyById(family);
        if (!existingFamily) {
            return next(new CustomError('Famille non trouvée', 404));
        }
    }
    // Check if the zone exists
    if(zone && !validator.isEmpty(zone.toString())){
        const existingZone = await ZoneService.findZoneById(zone);
        if (!existingZone) {
            return next(new CustomError('Zone non trouvée', 404));
        }
    }
    //check if the Product already exists
    const existingProduct = await ProductService.findProductByModel(model);
    if (existingProduct) {
        return next(new CustomError('Ce produit existe déjà', 400));
    }
    // Generate a unique code for the product
    const code = await generateUniqueCode("P", 6, Product);
    if (!code) {
        return next(new CustomError('Un problème est survenu, veuillez réessayer.', 400));
    }
    // Create a new Product
    const newProduct = await Product.create({
        code,
        marque,
        model,
        lot,
        family: !validator.isEmpty(family.toString()) ? family : null,
        zone: !validator.isEmpty(zone.toString()) ? zone : null
    });
    //check if the new Product was created successfully
    if (!newProduct) {
        return next(new CustomError('Un problème est survenu lors de la création d\'un produit, veuillez réessayer.', 400));
    }
    // Respond with success message
    res.status(200).json({ message: 'Produit créé avec succès' });
});
//update a Product
const UpdateProduct = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    const { marque, model, lot, family, zone } = req.body;
    // Check if ONE OF the required fields are provided
    if ([marque, model, lot, family, zone].every(
        field => !field || validator.isEmpty(field.toString()))
    ) {
        return next(new CustomError('Un des champs doivent être remplis', 400));
    }

    // Check if the Product exists
    const existingProduct = await ProductService.findProductByCode(code);
    if (!existingProduct) {
        return next(new CustomError('Produit non trouvé', 404));
    }
    
    // Check if the Product already exists
    const existingProductModel = await ProductService.findProductByModel(model);
    if (existingProductModel && existingProductModel.id !== existingProduct.id) {
        return next(new CustomError('Ce produit existe déjà', 400));
    }

    // Check if the family exists
    if(family){
        const existingFamily = await FamilyService.findFamilyById(family);
        if (!existingFamily) {
            return next(new CustomError('Famille non trouvée', 404));
        }
    }

    // Check if the zone exists
    if(zone){
        const existingZone = await ZoneService.findZoneById(zone);
        if (!existingZone) {
            return next(new CustomError('Zone non trouvée', 404));
        }
    }

    // Update the Product
    if(marque) existingProduct.marque = marque;
    if(model) existingProduct.model = model;
    if(lot) existingProduct.lot = lot;
    if(family) existingProduct.family = family;
    if(zone) existingProduct.zone = zone;
    //save the updated Product
    const updatedProduct = await existingProduct.save();

    //check if the Product was updated successfully
    if (!updatedProduct) {
        return next(new CustomError('Un problème est survenu lors de la mise à jour du produit, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Produit mis à jour avec succès' });
});
//delete a Product
const DeleteProduct = asyncErrorHandler(async (req, res, next) => {
    const { code } = req.params;
    //check if the code is provided
    if ([code].some(field => !field || validator.isEmpty(field))) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }

    // Check if the Product exists
    const existingProduct = await ProductService.findProductByCode(code);
    if (!existingProduct) {
        return next(new CustomError('Produit non trouvé', 404));
    }
    //check if there is no panne related to this Product
    const Panne = await PanneService.findPanneByProduct(existingProduct.id);
    if(Panne){
        return next(new CustomError('Vous ne pouvez pas supprimer ce produit car elle est liée à une panne existante.', 400));
    }

    // Delete the Product
    const deletedProduct = await existingProduct.destroy();

    //check if the Product was deleted successfully
    if (!deletedProduct) {
        return next(new CustomError('Un problème est survenu lors de la suppression du produit, veuillez réessayer.', 400));
    }

    // Respond with success message
    res.status(200).json({ message: 'Produit supprimé avec succès' });
});

module.exports = {
    GetAllProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct
}
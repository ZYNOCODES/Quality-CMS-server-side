const Product = require('../model/ProductModel');

const findProductById = async (id) => {
    return await Product.findByPk(id);
};
const findProductByCode = async (code) => {
    return await Product.findOne({
        where: {
            code
        },
    })
};
const findProductByFamily = async (family) => {
    return await Product.findOne({
        where: {
            family
        },
        raw: true
    })
};
const findProductByZone = async (zone) => {
    return await Product.findOne({
        where: {
            zone
        },
        raw: true
    })
};
const findProductByModel = async (model) => {
    return await Product.findOne({
        where: {
            model
        },
        raw: true
    })
};
module.exports = {
    findProductById,
    findProductByFamily,
    findProductByZone,
    findProductByCode,
    findProductByModel
}
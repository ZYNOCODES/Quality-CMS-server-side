const Product = require('../model/ProductModel');

const findProductById = async (id) => {
    return await Product.findByPk(id);
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
module.exports = {
    findProductById,
    findProductByFamily,
    findProductByZone
}
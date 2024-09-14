const Product = require('../model/ProductModel');
const Lot = require('../model/LotModel');

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
const findProductByModelAndLot = async (model, lot) => {
    return await Product.findOne({
        where: {
            model,
            lot
        },
        include: [
            {
                model: Lot,
                as: 'lotAssociation',
                attributes: ['code', 'name']
            }
        ],
    })
};
const findProductByLot = async (lot) => {
    return await Product.findOne({
        where: {
            lot
        },
        raw: true
    })
};
module.exports = {
    findProductById,
    findProductByFamily,
    findProductByZone,
    findProductByCode,
    findProductByModelAndLot,
    findProductByLot
}
const Lot = require('../model/LotModel');

const findLotById = async (id) => {
    return await Lot.findByPk(id);
};
const findLotByCode = async (code) => {
    return await Lot.findOne({
        where: {
            code
        },
    })
};
const findLotByName = async (name) => {
    return await Lot.findOne({
        where: {
            name
        },
        raw: true
    })
};
module.exports = {
    findLotById,
    findLotByCode,
    findLotByName
}
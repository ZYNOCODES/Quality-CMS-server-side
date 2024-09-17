const Zone = require('../model/ZoneModel');

const findZoneById = async (id) => {
    return await Zone.findByPk(id);
};
const findZoneByCode = async (code) => {
    return await Zone.findOne({
        where: {
            code
        },
        raw: true
    })
};
const findZoneByName = async (name) => {
    return await Zone.findOne({
        where: {
            name
        },
        raw: true
    })
};
module.exports = {
    findZoneById,
    findZoneByCode,
    findZoneByName
}
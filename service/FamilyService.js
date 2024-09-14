const Family = require('../model/FamilyModel');

const findFamilyById = async (id) => {
    return await Family.findByPk(id);
};
const findFamilyByCode = async (code) => {
    return await Family.findOne({
        where: {
            code
        },
    })
};
const findFamilyByName = async (name) => {
    return await Family.findOne({
        where: {
            name
        },
        raw: true
    })
};
module.exports = {
    findFamilyById,
    findFamilyByCode,
    findFamilyByName
}
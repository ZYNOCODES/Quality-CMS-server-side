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
module.exports = {
    findFamilyById,
    findFamilyByCode
}
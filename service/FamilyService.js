const Family = require('../model/FamilyModel');

const findFamilyById = async (id) => {
    return await Family.findByPk(id);
};

module.exports = {
    findFamilyById,
}
const PanneType = require('../model/PanneTypeModel');

const findPanneTypeById = async (id) => {
    return await PanneType.findByPk(id);
};
const findPanneTypeByCode = async (code) => {
    return await PanneType.findOne({
        where: {
            code
        }
    });
};
const findPanneTypeByName = async (name) => {
    return await PanneType.findOne({
        where: {
            name
        }
    });
};

module.exports = {
    findPanneTypeById,
    findPanneTypeByCode,
    findPanneTypeByName
}
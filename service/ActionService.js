const Action = require('../model/ActionModel');

const findActionById = async (id) => {
    return await Action.findByPk(id);
};
const findActionByCode = async (code) => {
    return await Action.findOne({
        where: {
            code
        }
    });
};
const findActionByName = async (name) => {
    return await Action.findOne({
        where: {
            name
        }
    });
};

module.exports = {
    findActionById,
    findActionByCode,
    findActionByName
}
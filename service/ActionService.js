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

module.exports = {
    findActionById,
    findActionByCode
}
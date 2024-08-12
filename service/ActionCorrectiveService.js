const ActionCorrective = require('../model/ActionCorrectiveModel');

const findActionCorrectiveById = async (id) => {
    return await ActionCorrective.findByPk(id);
};
const findActionCorrectiveByAction = async (action) => {
    return await ActionCorrective.findOne({
        where: {
            action
        },
        raw: true
    })
};
module.exports = {
    findActionCorrectiveById,
    findActionCorrectiveByAction
}
const ActionCorrective = require('../model/ActionCorrectiveModel');

const findActionCorrectiveById = async (id) => {
    return await ActionCorrective.findByPk(id);
};
const findActionCorrectiveByCode = async (code) => {
    return await ActionCorrective.findOne({
        where: {
            code
        }
    })
};
const findActionCorrectiveByAction = async (action) => {
    return await ActionCorrective.findOne({
        where: {
            action
        },
        raw: true
    })
};
const findActionCorrectiveByPanne = async (panne) => {
    return await ActionCorrective.findOne({
        where: {
            panne
        },
        raw: true
    })
};
const findActionCorrectiveByPanneAndAction = async (panne, action) => {
    return await ActionCorrective.findOne({
        where: {
            panne,
            action
        },
        raw: true
    })
};
module.exports = {
    findActionCorrectiveById,
    findActionCorrectiveByAction,
    findActionCorrectiveByPanne,
    findActionCorrectiveByCode,
    findActionCorrectiveByPanneAndAction
}
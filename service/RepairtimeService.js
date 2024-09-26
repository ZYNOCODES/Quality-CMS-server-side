const Repairtime = require('../model/RepairtimeModel');

const findRepairtimeById = async (id) => {
    return await Repairtime.findByPk(id);
};
const findRepairtimeByCode = async (code) => {
    return await Repairtime.findOne({
        where: {
            code
        }
    });
}
const createNewRepairtime = async (panne, start, transaction) => {
    return await Repairtime.create({
        start,
        end: null,
        panne
    }, { transaction });
};
const endRepairtime = async (panne, end, transaction) => {
    return await Repairtime.update({
        end
    }, {
        where: {
            panne,
            end: null
        },
        transaction
    });
};
module.exports = {
    findRepairtimeById,
    findRepairtimeByCode,
    createNewRepairtime,
    endRepairtime
}
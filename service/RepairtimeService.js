const Repairtime = require('../model/RepairtimeModel');
const moment = require('moment');
const { Op } = require('sequelize');

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
const getAllRepairetimesByPanne = async (panne) => {
    //get all repairtimes by panne where end is not null
    const repairtimes = await Repairtime.findAll({
        where: {
            panne: panne,
            end: {
                [Op.not]: null
            }
        }
    });
    //check if there are repairtimes
    if (!repairtimes || repairtimes.length < 1) {
        return 0;
    }

    // Calculate the difference in milliseconds
    let totalDurationInMilliseconds = 0;

    repairtimes.forEach(repairtime => {
        const start = moment(repairtime.start);
        const end = moment(repairtime.end);
        totalDurationInMilliseconds += end.diff(start);
    });

    return totalDurationInMilliseconds;
}

module.exports = {
    findRepairtimeById,
    findRepairtimeByCode,
    createNewRepairtime,
    endRepairtime,
    getAllRepairetimesByPanne
}
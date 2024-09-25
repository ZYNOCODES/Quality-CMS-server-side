const Arrival = require('../model/ArrivalModel');

const findArrivalById = async (id) => {
    return await Arrival.findByPk(id);
};
const findArrivalByCode = async (code) => {
    return await Arrival.findOne({
        where: {
            code
        },
    })
};
const findArrivalByName = async (name) => {
    return await Arrival.findOne({
        where: {
            name
        },
        raw: true
    })
};
module.exports = {
    findArrivalById,
    findArrivalByCode,
    findArrivalByName
}
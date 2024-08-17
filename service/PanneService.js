const Panne = require('../model/PanneModel');

const findPanneById = async (id) => {
    return await Panne.findByPk(id);
};
const findPanneByCode = async (code) => {
    return await Panne.findOne({
        where: {
            code
        }
    });
};
const findPanneByWorkshop = async (workshop) => {
    return await Panne.findOne({
        where: {
            workshop
        },
        raw: true
    })
};
const findPanneByProduct = async (product) => {
    return await Panne.findOne({
        where: {
            product
        },
        raw: true
    })
};
const findPanneByTechnician = async (Technician) => {
    return await Panne.findOne({
        where: {
            technician: Technician
        },
    })
};
module.exports = {
    findPanneById,
    findPanneByWorkshop,
    findPanneByProduct,
    findPanneByCode,
    findPanneByTechnician
}
const Panne = require('../model/PanneModel');

const findPanneById = async (id) => {
    return await Panne.findByPk(id);
};
const findPanneByWorkshop = async (workshop) => {
    return await Panne.findOne({
        where: {
            workshop
        },
        raw: true
    })
};
module.exports = {
    findPanneById,
    findPanneByWorkshop
}
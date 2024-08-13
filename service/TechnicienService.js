const Technician = require('../model/TechnicianModel');

const findTechnicianById = async (id) => {
    return await Technician.findByPk(id);
};
const findTechnicianByCode = async (code) => {
    return await Technician.findOne({
        where: {
            code
        }
    });
}
module.exports = {
    findTechnicianById,
    findTechnicianByCode
}
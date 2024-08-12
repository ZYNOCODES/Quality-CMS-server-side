const Workshop = require('../model/WorkshopModel');

const findWorkshopById = async (id) => {
    return await Workshop.findByPk(id);
};
const findWorkshopByZone = async (zone) => {
    return await Workshop.findOne({
        where: {
            zone
        },
        raw: true
    })
};
module.exports = {
    findWorkshopById,
    findWorkshopByZone
}
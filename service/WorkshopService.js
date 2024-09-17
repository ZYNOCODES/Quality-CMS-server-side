const Workshop = require('../model/WorkshopModel');

const findWorkshopById = async (id) => {
    return await Workshop.findByPk(id);
};
const findWorkshopByCode = async (code) => {
    return await Workshop.findOne({
        where: {
            code
        },
    })
};
const findWorkshopByZone = async (zone) => {
    return await Workshop.findOne({
        where: {
            zone
        },
        raw: true
    })
};
const findWorkshopByZoneANDName = async (zone, name) => {
    return await Workshop.findOne({
        where: {
            zone,
            name
        },
        raw: true
    })
};
const findAllWorkshopsByZone = async (zone) => {
    return await Workshop.findAll({
        where: {
            zone
        },
        raw: true
    })
};
module.exports = {
    findWorkshopById,
    findWorkshopByCode,
    findWorkshopByZone,
    findWorkshopByZoneANDName,
    findAllWorkshopsByZone
}
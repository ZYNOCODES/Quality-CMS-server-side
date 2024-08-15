const Technician = require('../model/TechnicianModel');
const Manager = require('../model/ManagerModel');
const Agent = require('../model/AccessAgentModel');

//find user by id
const findUserByZone = async (zone) => {
    return (
        await Technician.findOne(
            {
                where: {
                    zone
                },
                raw: true
            }
        ) ||
        await Manager.findOne(
            {
                where: {
                    zone
                },
                raw: true
            }
        ) ||
        await Agent.findOne(
            {
                where: {
                    zone
                },
                raw: true
            }
        )
    );
}

module.exports = {
    findUserByZone
}
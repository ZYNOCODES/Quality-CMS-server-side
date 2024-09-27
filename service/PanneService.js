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
const findPanneByAgent = async (Agent) => {
    return await Panne.findOne({
        where: {
            agent: Agent
        },
    })
};
const findPanneByFournisseur = async (Fournisseur) => {
    return await Panne.findOne({
        where: {
            fournisseur: Fournisseur
        },
    })
};
const findPanneByCodeANDAgent = async (Code, Agent) => {
    return await Panne.findOne({
        where: {
            code: Code,
            agent: Agent
        },
    })
};
const findPanneByPanneType = async (type) => {
    return await Panne.findOne({
        where: {
            panne: type
        },
        raw: true
    })
}
const findPanneInProgressByTechnician = async (Technician) => {
    return await Panne.findOne({
        where: {
            technician: Technician,
            dateReparation: null,
            isPaused: false
        },
        raw: true
    })
}

module.exports = {
    findPanneById,
    findPanneByCodeANDAgent,
    findPanneByWorkshop,
    findPanneByProduct,
    findPanneByCode,
    findPanneByTechnician,
    findPanneByAgent,
    findPanneByFournisseur,
    findPanneByPanneType,
    findPanneInProgressByTechnician
}
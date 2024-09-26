const Fournisseur = require('../model/FournisseurModel');

const findFournisseurById = async (id) => {
    return await Fournisseur.findByPk(id);
};
const findFournisseurByCode = async (code) => {
    return await Fournisseur.findOne({
        where: {
            code
        },
    })
};
const findFournisseurByName = async (fullname) => {
    return await Fournisseur.findOne({
        where: {
            fullname
        },
        raw: true
    })
};
module.exports = {
    findFournisseurById,
    findFournisseurByCode,
    findFournisseurByName
}
const Consommation = require('../model/ConsommationModel');

const findConsommationById = async (id) => {
    return await Consommation.findByPk(id);
};
const findConsommationByPiece = async (piece) => {
    return await Consommation.findOne({
        where: {
            piece
        },
        raw: true
    })
};
const findConsommationByPanne = async (panne) => {
    return await Consommation.findOne({
        where: {
            panne
        },
        raw: true
    })
};
module.exports = {
    findConsommationById,
    findConsommationByPiece,
    findConsommationByPanne
}
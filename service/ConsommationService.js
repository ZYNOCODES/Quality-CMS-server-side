const Consommation = require('../model/ConsommationModel');

const findConsommationById = async (id) => {
    return await Consommation.findByPk(id);
};
const findConsommationByCode = async (code) => {
    return await Consommation.findOne({
        where: {
            code
        }
    })
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
const findConsommationByPanneAndPiece = async (panne, piece) => {
    return await Consommation.findOne({
        where: {
            panne,
            piece
        },
        raw: true
    })
};
module.exports = {
    findConsommationById,
    findConsommationByPiece,
    findConsommationByPanne,
    findConsommationByCode,
    findConsommationByPanneAndPiece
}
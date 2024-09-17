const Piece = require('../model/PieceModel');

const findPieceById = async (id) => {
    return await Piece.findByPk(id);
};
const findPieceByCode = async (code) => {
    return await Piece.findOne({
        where: {
            code
        }
    });
};
const findPieceByName = async (name) => {
    return await Piece.findOne({
        where: {
            name
        }
    });
}

module.exports = {
    findPieceById,
    findPieceByCode,
    findPieceByName
}
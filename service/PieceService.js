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

module.exports = {
    findPieceById,
    findPieceByCode
}
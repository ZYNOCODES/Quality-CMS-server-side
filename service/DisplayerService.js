const Displayer = require('../model/DisplayerModel');

const findDisplayerById = async (id) => {
    return await Displayer.findByPk(id);
};
const findDisplayerByCode = async (code) => {
    return await Displayer.findOne({
        where: {
            code
        }
    });
};

module.exports = {
    findDisplayerById,
    findDisplayerByCode
}
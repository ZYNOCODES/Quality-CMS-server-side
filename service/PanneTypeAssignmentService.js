const PanneTypeAssignment = require('../model/PanneTypeAssignmentModel');
const PanneType = require('../model/PanneTypeModel');

const findPanneTypeAssignmentById = async (id) => {
    return await PanneTypeAssignment.findByPk(id);
};
const findPanneTypeAssignmentByCode = async (code) => {
    return await PanneTypeAssignment.findOne({
        where: {
            code
        }
    })
};
const findPanneTypeAssignmentByType = async (panneType) => {
    return await PanneTypeAssignment.findOne({
        where: {
            typepanne: panneType
        },
        raw: true
    })
};
const findPanneTypeAssignmentByPanne = async (panne) => {
    return await PanneTypeAssignment.findOne({
        where: {
            panne
        },
        raw: true
    })
};
const findAllPanneTypeAssignmentByPanne = async (panne) => {
    return await PanneTypeAssignment.findAll({
        where: {
            panne
        },
        include: [
            {
                model: PanneType,
                as: 'typepanneAssociation',
                attributes: ['name'],
            }
        ]
    })
};
const findPanneTypeAssignmentByPanneAndType = async (panne, panneType) => {
    return await PanneTypeAssignment.findOne({
        where: {
            panne,
            typepanne: panneType
        },
        raw: true
    })
};
module.exports = {
    findPanneTypeAssignmentById,
    findPanneTypeAssignmentByType,
    findPanneTypeAssignmentByPanne,
    findAllPanneTypeAssignmentByPanne,
    findPanneTypeAssignmentByCode,
    findPanneTypeAssignmentByPanneAndType
}
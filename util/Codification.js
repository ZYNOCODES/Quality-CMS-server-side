const Product = require('../model/ProductModel');
const Panne = require('../model/PanneModel');
const Action = require('../model/ActionModel.js');
const Piece = require('../model/PieceModel.js');
const Family = require('../model/FamilyModel.js');
const AccessAgent = require('../model/AccessAgentModel.js');
const ActionCorrective = require('../model/ActionCorrectiveModel.js');
const Consommation = require('../model/ConsommationModel.js');
const Manager = require('../model/ManagerModel.js');
const Technician = require('../model/TechnicianModel.js');
const Workshop = require('../model/WorkshopModel.js');
const Zone = require('../model/ZoneModel.js');
const { getCurrentDateTime } = require('../util/DateTime.js');
const moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Africa/Algiers");

// Function to generate a unique code for a given model
const generateUniqueCode = async (prefix, digits, model) => {
    const randomDigits = Math.floor(Math.pow(10, digits - 1) + Math.random() * 9 * Math.pow(10, digits - 1));
    const dateTime = getCurrentDateTime();
    const code = prefix + dateTime + randomDigits;

    const exists = await model.findOne({
        where: { code },
        raw: true
    });

    if (exists) {
        return await generateUniqueCode(prefix, digits, model);
    }
    return code;
};

// Product codification
const ProductCode = async () => {
    return await generateUniqueCode("P", 6, Product);
};

// Panne codification
const PanneCode = async () => {
    return await generateUniqueCode("PN", 6, Panne);
};

// Action codification
const ActionCode = async () => {
    return await generateUniqueCode("AC", 4, Action);
};

// Piece codification
const PieceCode = async () => {
    return await generateUniqueCode("PC", 6, Piece);
};

// Family codification
const FamilyCode = async () => {
    return await generateUniqueCode("F", 4, Family);
};

// AccessAgent codification
const AccessAgentCode = async () => {
    return await generateUniqueCode("AA", 6, AccessAgent);
};

// ActionCorrective codification
const ActionCorrectiveCode = async () => {
    return await generateUniqueCode("ACC", 6, ActionCorrective);
};

// Consommation codification
const ConsommationCode = async () => {
    return await generateUniqueCode("CS", 6, Consommation);
};

// Manager codification
const ManagerCode = async () => {
    return await generateUniqueCode("M", 6, Manager);
};

// Technician codification
const TechnicianCode = async () => {
    return await generateUniqueCode("T", 6, Technician);
};

// Workshop codification
const WorkshopCode = async () => {
    return await generateUniqueCode("W", 6, Workshop);
};

// Zone codification
const ZoneCode = async () => {
    return await generateUniqueCode("Z", 6, Zone);
};

module.exports = {
    generateUniqueCode
};

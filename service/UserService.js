const User = require('../model/UserModel');

const findUserById = async (id) => {
    return await User.findById(id);
};

const findUserByUserName = async (username) => {
    return await User.findOne({            
        userName: username
    });
};

const findUserByPhone = async (Phone) => {
    return await User.findOne({            
        phoneNumber: Phone
    });
};

module.exports = {
    findUserById,
    findUserByUserName,
    findUserByPhone,
}
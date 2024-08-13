const JWT = require('jsonwebtoken');

//jwt secret
const createToken = (id, type, code) => {
    return JWT.sign({id: id, type: type, code: code}, process.env.SECRET_KEY, {expiresIn: '1d'});
}

module.exports = {
    createToken
};
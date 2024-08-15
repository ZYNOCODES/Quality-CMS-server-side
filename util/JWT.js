const JWT = require('jsonwebtoken');

//jwt secret
const createToken = (id, type, code, zone) => {
    return JWT.sign({id: id, type: type, code: code, zone: zone}, process.env.SECRET_KEY, {expiresIn: '1d'});
}

module.exports = {
    createToken
};
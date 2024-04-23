const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d",
        //Sets the expiration time for the JWT to 30 days. After this period, the token will expire and require reauthentication.
    });
};

module.exports = generateToken;
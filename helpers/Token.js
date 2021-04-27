const jwt = require("jsonwebtoken");
const {JWT_SECRET, JWT_EXPIRES_IN} = process.env
const Response = require('./Response');
/** Token Helper Class */
let expires = JWT_EXPIRES_IN;
module.exports = class Token {
    /**
   * @description - this method encodes a token
   * @param {object} payload
   * @param {string} secret
   * @param {string} expires
   * @return {string} token
   */

async generateToken(payload, JWT_EXPIRES_IN = expires ){
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
   * Verfify Token Method
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} returns the token object payload
   * @memberof Token
  */
 verifyToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      if (!token) {
        const response = new Response(
          false,
          401,
          'Access Denied, You did not provide a token'
        );
        return res.status(response.code).json(response);
      }
      
      const payload = jwt.verify(token,JWT_SECRET);
      req.payload = payload;

      return next();

    } catch (err) {
      const response = new Response(
        false,
        401,
        'Access Denied, Your token is invalid or expired'
      );
      return res.status(response.code).json(response);
    }
  }


}
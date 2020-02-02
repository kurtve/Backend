const bcrypt = require('bcryptjs');
const authModel = require('./auth-model.js');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let decoded;
    if (token) {
      decoded = authModel.decodeToken(token);
    }
    if (!decoded) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      // store user info on the request object
      req.tokenData = decoded;
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;

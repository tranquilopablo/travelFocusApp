const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // in case "OPTIONS" error in browser
    if (req.method === 'OPTIONS') { 
      return next();
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'important_key_value');
    next();
  } catch (err) {
    const error = new Error('Authentication failed!');
    error.code = 403;
    return next(error);
  }

 
};

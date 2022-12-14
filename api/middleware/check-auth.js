const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') { 
      return next();
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Bład autentykacji!');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    next();
  } catch (err) {
    const error = new Error('Bład autentykacji!');
    error.code = 403;
    return next(error);
  }

 
};

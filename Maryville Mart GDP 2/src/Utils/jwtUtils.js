const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'thisissecretkey', {
    expiresIn: '1h',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'thisissecretkey');
};

module.exports = { generateToken, verifyToken };
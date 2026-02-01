const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    req.user = jwt.verify(token, 'your_jwt_secret_key');
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

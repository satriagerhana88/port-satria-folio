const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer token"

  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); // pakai .env
    req.user = decoded; // simpan info admin
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token tidak valid' });
  }
};

module.exports = verifyToken;

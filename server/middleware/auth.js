const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ecom_super_secret_jwt_key_2026';

/**
 * AUTH MIDDLEWARE
 * Verifies the JWT token passed in the Authorization header.
 * Attaches the user payload to the request object (req.user).
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Expecting format: "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * ADMIN ONLY MIDDLEWARE
 * Assumes verifyToken has run first.
 * Ensures the logged-in user is an Admin.
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized. Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Administrators only.' });
  }

  next();
};

module.exports = {
  verifyToken,
  adminOnly,
  JWT_SECRET,
};

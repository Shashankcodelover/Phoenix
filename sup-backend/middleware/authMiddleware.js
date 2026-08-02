/**
 * Phoenix v3.0: Google-Standard JWT Authentication Middleware
 * 
 * Enforces Zero-Trust security on private API endpoints.
 * Verifies Bearer tokens in Authorization header against JWT_SECRET.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const secret = process.env.JWT_SECRET || 'phoenix_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);

      // Attach user object to request context
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        req.userId = decoded.id; // fallback if User model is decoupled
      } else {
        req.userId = req.user._id.toString();
      }

      return next();
    } catch (error) {
      console.warn(`[AuthMiddleware] Unauthorized token attempt from IP ${req.ip}: ${error.message}`);
      return res.status(401).json({
        error: 'NOT_AUTHORIZED',
        message: 'Not authorized, invalid token'
      });
    }
  }

  // Token missing
  return res.status(401).json({
    error: 'NOT_AUTHORIZED',
    message: 'Not authorized, no token provided'
  });
};

module.exports = { protect };

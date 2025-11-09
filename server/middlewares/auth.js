const jwt = require("jsonwebtoken");
const { UserService } = require("../models/User");
const config = require("../config/config");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required",
      });
    }

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: "Invalid or expired token",
        });
      }

      // Add user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const user = UserService.findById(req.user.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    res.status(500).json({
      success: false,
      error: "Authorization failed",
    });
  }
};

// Middleware to verify user exists and is active
const requireActiveUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const user = UserService.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: "Account not verified",
      });
    }

    // Add user object to request
    req.userData = user;
    next();
  } catch (error) {
    console.error("User verification error:", error);
    res.status(500).json({
      success: false,
      error: "User verification failed",
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
      });
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Rate limiting middleware for sensitive operations
const sensitiveOperationLimit = (req, res, next) => {
  // In a real app, you'd implement rate limiting here
  // For now, we'll just pass through
  next();
};

// KYC verification middleware
const requireKYC = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const user = UserService.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (user.kycStatus !== "verified") {
      return res.status(403).json({
        success: false,
        error: "KYC verification required for this operation",
      });
    }

    next();
  } catch (error) {
    console.error("KYC verification error:", error);
    res.status(500).json({
      success: false,
      error: "KYC verification failed",
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireActiveUser,
  optionalAuth,
  sensitiveOperationLimit,
  requireKYC
};

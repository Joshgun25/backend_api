const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserService } = require('../models/User');
const setCookie = require('../utils/setCookie');
const config = require('../config/config');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = UserService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'User already exists with this email' 
        });
      }

      // Create new user
      const newUser = UserService.create({
        email,
        password: await bcrypt.hash(password, 10),
        name
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: newUser.toJSON()
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: error.message || 'Internal server error' 
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = UserService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'Invalid email or password' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login successful',
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }

  // Verify JWT token
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          error: 'No token provided' 
        });
      }

      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = UserService.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid token' 
        });
      }

      res.json({
        valid: true,
        user: user.toJSON()
      });
    } catch (error) {
      res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success message
      res.json({ 
        message: 'Logout successful' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }

  // Refresh token
  static async refreshToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          error: 'No token provided' 
        });
      }

      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = UserService.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid token' 
        });
      }

      // Generate new token
      const newToken = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Token refreshed successfully',
        token: newToken,
        user: user.toJSON()
      });
    } catch (error) {
      res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ 
          error: 'User not authenticated' 
        });
      }

      const user = UserService.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ 
          error: 'Current password is incorrect' 
        });
      }

      // Update password
      UserService.update(userId, {
        password: await bcrypt.hash(newPassword, 10)
      });

      res.json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ 
        error: 'Internal server error' 
      });
    }
  }
}

module.exports = { AuthController };

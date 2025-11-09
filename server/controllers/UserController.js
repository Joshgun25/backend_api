const { UserService } = require('../models/User');
const axios = require("axios");

class UserController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user?.userId || req.query.userId || 'demo-user';
      
      const user = UserService.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }
      
      res.json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch user profile' 
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { name, email } = req.body;
      const userId = req.user?.userId || 'demo-user';
      
      // Check if user exists
      const existingUser = UserService.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }
      
      // Check if email is already taken by another user
      if (email && email !== existingUser.email) {
        const emailExists = UserService.findByEmail(email);
        if (emailExists && emailExists.id !== userId) {
          return res.status(400).json({ 
            success: false,
            error: 'Email is already taken' 
          });
        }
      }
      
      // Update user profile
      const updatedUser = UserService.update(userId, {
        name: name || existingUser.name,
        email: email || existingUser.email
      });
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser.toJSON()
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to update profile' 
      });
    }
  }

  // Get user statistics
  static async getUserStats(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      
      // In a real app, you'd fetch these from the database
      const stats = {
        totalTrades: 45,
        totalVolume: 125000,
        winRate: 68.5,
        totalProfit: 12500,
        accountAge: 30, // days
        lastLogin: new Date().toISOString(),
        kycStatus: 'pending',
        twoFactorEnabled: false
      };
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch user statistics' 
      });
    }
  }

  // Update user preferences
  static async updatePreferences(req, res) {
    try {
      const { preferences } = req.body;
      const userId = req.user?.userId || 'demo-user';
      
      // In a real app, you'd have a preferences model
      const userPreferences = {
        theme: preferences.theme || 'dark',
        language: preferences.language || 'en',
        notifications: preferences.notifications || {
          email: true,
          push: true,
          sms: false
        },
        trading: preferences.trading || {
          defaultOrderType: 'limit',
          confirmOrders: true,
          showAdvancedCharts: false
        }
      };
      
      res.json({
        success: true,
        message: 'Preferences updated successfully',
        data: userPreferences
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to update preferences' 
      });
    }
  }

  // Get user activity log
  static async getActivityLog(req, res) {
    try {
      const { limit = 50 } = req.query;
      const userId = req.user?.userId || 'demo-user';
      
      // Mock activity log
      const activities = [
        {
          id: 1,
          type: 'login',
          description: 'User logged in',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0...'
        },
        {
          id: 2,
          type: 'trade',
          description: 'Placed buy order for BTC/USDT',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: { pair: 'BTC/USDT', amount: 0.1, price: 65000 }
        },
        {
          id: 3,
          type: 'withdraw',
          description: 'Withdrawal request created',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: { coin: 'ETH', amount: 2.5 }
        }
      ];
      
      res.json({
        success: true,
        data: {
          activities: activities.slice(0, parseInt(limit)),
          total: activities.length
        }
      });
    } catch (error) {
      console.error('Error fetching activity log:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch activity log' 
      });
    }
  }

  // Delete user account
  static async deleteAccount(req, res) {
    try {
      const { password } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          error: 'User not authenticated' 
        });
      }
      
      // In a real app, you'd verify the password before deletion
      // and handle data anonymization
      
      res.json({
        success: true,
        message: 'Account deletion request submitted. You will receive an email confirmation.'
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to delete account' 
      });
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req, res) {
    try {
      // In a real app, you'd check if user is admin
      const users = UserService.getAll();
      
      res.json({
        success: true,
        data: {
          users,
          total: users.length
        }
      });
    } catch (error) {
      console.error('Error fetching all users:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch users' 
      });
    }
  }

  // Update user status (admin only)
  static async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { status, reason } = req.body;
      
      // In a real app, you'd check if requester is admin
      const user = UserService.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }
      
      // Update user status
      const updatedUser = UserService.update(userId, {
        status,
        statusReason: reason,
        statusUpdatedAt: new Date()
      });
      
      res.json({
        success: true,
        message: 'User status updated successfully',
        data: updatedUser.toJSON()
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to update user status' 
      });
    }
  }
}

module.exports = { UserController };

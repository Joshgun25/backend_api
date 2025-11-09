const { UserService } = require('../models/User');

class NotificationController {
  // Get user notifications
  static async getUserNotifications(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { page = 1, limit = 20, type, read } = req.query;

      // Mock notifications data
      const notifications = [
        {
          id: '1',
          userId,
          type: 'trade_executed',
          title: 'Order Executed',
          message: 'Your BTC/USDT buy order has been executed at $45,230',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          data: { pair: 'BTC/USDT', side: 'buy', amount: 0.1, price: 45230 }
        },
        {
          id: '2',
          userId,
          type: 'price_alert',
          title: 'Price Alert',
          message: 'BTC has reached your target price of $45,000',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          data: { pair: 'BTC/USDT', targetPrice: 45000, currentPrice: 45230 }
        },
        {
          id: '3',
          userId,
          type: 'deposit_received',
          title: 'Deposit Received',
          message: 'You have received 1000 USDT in your wallet',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          data: { currency: 'USDT', amount: 1000, txHash: '0x123...' }
        },
        {
          id: '4',
          userId,
          type: 'security_alert',
          title: 'Security Alert',
          message: 'New login detected from a new device',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          data: { ip: '192.168.1.100', location: 'New York, US' }
        }
      ];

      // Filter notifications
      let filteredNotifications = notifications;
      
      if (type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === type);
      }
      
      if (read !== undefined) {
        const isRead = read === 'true';
        filteredNotifications = filteredNotifications.filter(n => n.read === isRead);
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          notifications: paginatedNotifications,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredNotifications.length,
            pages: Math.ceil(filteredNotifications.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get notifications'
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.userId || 'demo-user';

      // Mock marking as read
      console.log(`Marking notification ${notificationId} as read for user ${userId}`);

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to mark notification as read'
      });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock marking all as read
      console.log(`Marking all notifications as read for user ${userId}`);

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to mark all notifications as read'
      });
    }
  }

  // Delete notification
  static async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.userId || 'demo-user';

      // Mock deletion
      console.log(`Deleting notification ${notificationId} for user ${userId}`);

      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete notification'
      });
    }
  }

  // Get notification settings
  static async getNotificationSettings(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock notification settings
      const settings = {
        email: {
          tradeExecuted: true,
          priceAlerts: true,
          deposits: true,
          withdrawals: true,
          securityAlerts: true,
          news: false
        },
        push: {
          tradeExecuted: true,
          priceAlerts: true,
          deposits: false,
          withdrawals: true,
          securityAlerts: true,
          news: false
        },
        sms: {
          securityAlerts: true,
          withdrawals: true
        }
      };

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error getting notification settings:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get notification settings'
      });
    }
  }

  // Update notification settings
  static async updateNotificationSettings(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const settings = req.body;

      // Mock updating settings
      console.log(`Updating notification settings for user ${userId}:`, settings);

      res.json({
        success: true,
        message: 'Notification settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update notification settings'
      });
    }
  }

  // Create price alert
  static async createPriceAlert(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { pair, condition, targetPrice, message } = req.body;

      // Mock creating price alert
      const alert = {
        id: Date.now().toString(),
        userId,
        pair: pair.toUpperCase(),
        condition, // 'above' or 'below'
        targetPrice: parseFloat(targetPrice),
        message: message || `${pair} price ${condition} ${targetPrice}`,
        active: true,
        createdAt: new Date()
      };

      console.log('Created price alert:', alert);

      res.status(201).json({
        success: true,
        message: 'Price alert created successfully',
        data: alert
      });
    } catch (error) {
      console.error('Error creating price alert:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create price alert'
      });
    }
  }

  // Get price alerts
  static async getPriceAlerts(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock price alerts
      const alerts = [
        {
          id: '1',
          userId,
          pair: 'BTC/USDT',
          condition: 'above',
          targetPrice: 50000,
          message: 'BTC price above $50,000',
          active: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
        },
        {
          id: '2',
          userId,
          pair: 'ETH/USDT',
          condition: 'below',
          targetPrice: 3000,
          message: 'ETH price below $3,000',
          active: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
        }
      ];

      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      console.error('Error getting price alerts:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get price alerts'
      });
    }
  }

  // Delete price alert
  static async deletePriceAlert(req, res) {
    try {
      const { alertId } = req.params;
      const userId = req.user?.userId || 'demo-user';

      // Mock deletion
      console.log(`Deleting price alert ${alertId} for user ${userId}`);

      res.json({
        success: true,
        message: 'Price alert deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting price alert:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete price alert'
      });
    }
  }
}

module.exports = { NotificationController };

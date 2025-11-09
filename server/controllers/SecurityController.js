const { UserService } = require('../models/User');

class SecurityController {
  // Get security settings
  static async getSecuritySettings(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock security settings
      const settings = {
        userId,
        twoFactor: {
          enabled: true,
          method: 'totp', // 'totp', 'sms', 'email'
          backupCodes: 8,
          lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24)
        },
        login: {
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
          lastLoginIp: '192.168.1.100',
          lastLoginLocation: 'New York, US',
          failedAttempts: 0,
          lockedUntil: null
        },
        ipWhitelist: {
          enabled: false,
          ips: [
            '192.168.1.100',
            '192.168.1.101'
          ]
        },
        session: {
          maxSessions: 5,
          currentSessions: 2,
          sessionTimeout: 30 // minutes
        },
        notifications: {
          loginAlerts: true,
          withdrawalAlerts: true,
          securityAlerts: true,
          email: true,
          sms: false
        },
        api: {
          enabled: false,
          keys: []
        }
      };

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error getting security settings:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get security settings'
      });
    }
  }

  // Enable two-factor authentication
  static async enable2FA(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { method = 'totp' } = req.body;

      // Mock enabling 2FA
      const twoFactorData = {
        userId,
        method,
        secret: 'JBSWY3DPEHPK3PXP', // Mock secret key
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        backupCodes: [
          '12345678',
          '87654321',
          '11223344',
          '44332211',
          '55667788',
          '88776655',
          '99887766',
          '66778899'
        ],
        enabled: false, // Will be enabled after verification
        createdAt: new Date()
      };

      console.log('2FA setup initiated for user:', userId);

      res.status(201).json({
        success: true,
        message: '2FA setup initiated. Please verify with the code from your authenticator app.',
        data: twoFactorData
      });
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to enable 2FA'
      });
    }
  }

  // Verify two-factor authentication
  static async verify2FA(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { code } = req.body;

      // Mock 2FA verification
      const verification = {
        userId,
        code,
        verified: true,
        enabled: true,
        verifiedAt: new Date()
      };

      console.log('2FA verified for user:', userId);

      res.json({
        success: true,
        message: '2FA enabled successfully',
        data: verification
      });
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to verify 2FA'
      });
    }
  }

  // Disable two-factor authentication
  static async disable2FA(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { password, code } = req.body;

      // Mock disabling 2FA
      console.log(`2FA disabled for user ${userId}`);

      res.json({
        success: true,
        message: '2FA disabled successfully'
      });
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to disable 2FA'
      });
    }
  }

  // Get login history
  static async getLoginHistory(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { page = 1, limit = 20 } = req.query;

      // Mock login history
      const loginHistory = [
        {
          id: '1',
          userId,
          ip: '192.168.1.100',
          location: 'New York, US',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          device: 'Desktop',
          browser: 'Chrome',
          os: 'Windows 10',
          success: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          twoFactorUsed: true
        },
        {
          id: '2',
          userId,
          ip: '192.168.1.101',
          location: 'New York, US',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
          device: 'Mobile',
          browser: 'Safari',
          os: 'iOS 15.0',
          success: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          twoFactorUsed: true
        },
        {
          id: '3',
          userId,
          ip: '192.168.1.102',
          location: 'Unknown',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          device: 'Desktop',
          browser: 'Firefox',
          os: 'Linux',
          success: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          twoFactorUsed: false,
          failureReason: 'Invalid password'
        }
      ];

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedHistory = loginHistory.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          history: paginatedHistory,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: loginHistory.length,
            pages: Math.ceil(loginHistory.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting login history:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get login history'
      });
    }
  }

  // Update IP whitelist
  static async updateIPWhitelist(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { enabled, ips } = req.body;

      // Mock updating IP whitelist
      const whitelist = {
        userId,
        enabled,
        ips: ips || [],
        updatedAt: new Date()
      };

      console.log('IP whitelist updated for user:', userId, whitelist);

      res.json({
        success: true,
        message: 'IP whitelist updated successfully',
        data: whitelist
      });
    } catch (error) {
      console.error('Error updating IP whitelist:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update IP whitelist'
      });
    }
  }

  // Get active sessions
  static async getActiveSessions(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock active sessions
      const sessions = [
        {
          id: 'session1',
          userId,
          ip: '192.168.1.100',
          location: 'New York, US',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          device: 'Desktop',
          browser: 'Chrome',
          os: 'Windows 10',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          lastActivity: new Date(Date.now() - 1000 * 60 * 5),
          current: true
        },
        {
          id: 'session2',
          userId,
          ip: '192.168.1.101',
          location: 'New York, US',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
          device: 'Mobile',
          browser: 'Safari',
          os: 'iOS 15.0',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 12),
          current: false
        }
      ];

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Error getting active sessions:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get active sessions'
      });
    }
  }

  // Terminate session
  static async terminateSession(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.user?.userId || 'demo-user';

      // Mock terminating session
      console.log(`Session ${sessionId} terminated for user ${userId}`);

      res.json({
        success: true,
        message: 'Session terminated successfully'
      });
    } catch (error) {
      console.error('Error terminating session:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to terminate session'
      });
    }
  }

  // Terminate all other sessions
  static async terminateAllOtherSessions(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock terminating all other sessions
      console.log(`All other sessions terminated for user ${userId}`);

      res.json({
        success: true,
        message: 'All other sessions terminated successfully'
      });
    } catch (error) {
      console.error('Error terminating all other sessions:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to terminate all other sessions'
      });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { currentPassword, newPassword, confirmPassword } = req.body;

      // Mock password change
      const passwordChange = {
        userId,
        changedAt: new Date(),
        ip: req.ip || '192.168.1.100',
        userAgent: req.get('User-Agent') || 'Unknown'
      };

      console.log('Password changed for user:', userId);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to change password'
      });
    }
  }

  // Get security alerts
  static async getSecurityAlerts(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { page = 1, limit = 20 } = req.query;

      // Mock security alerts
      const alerts = [
        {
          id: '1',
          userId,
          type: 'login_from_new_device',
          severity: 'medium',
          title: 'Login from new device',
          description: 'Your account was accessed from a new device',
          ip: '192.168.1.200',
          location: 'Los Angeles, US',
          device: 'Mobile',
          browser: 'Chrome',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: false,
          action: 'review'
        },
        {
          id: '2',
          userId,
          type: 'failed_login_attempts',
          severity: 'high',
          title: 'Multiple failed login attempts',
          description: '5 failed login attempts detected from IP 192.168.1.300',
          ip: '192.168.1.300',
          location: 'Unknown',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          read: true,
          action: 'blocked'
        },
        {
          id: '3',
          userId,
          type: 'password_changed',
          severity: 'low',
          title: 'Password changed',
          description: 'Your password was successfully changed',
          ip: '192.168.1.100',
          location: 'New York, US',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          read: true,
          action: 'completed'
        }
      ];

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedAlerts = alerts.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          alerts: paginatedAlerts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: alerts.length,
            pages: Math.ceil(alerts.length / limit)
          },
          unreadCount: alerts.filter(alert => !alert.read).length
        }
      });
    } catch (error) {
      console.error('Error getting security alerts:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get security alerts'
      });
    }
  }

  // Mark security alert as read
  static async markSecurityAlertAsRead(req, res) {
    try {
      const { alertId } = req.params;
      const userId = req.user?.userId || 'demo-user';

      // Mock marking alert as read
      console.log(`Security alert ${alertId} marked as read for user ${userId}`);

      res.json({
        success: true,
        message: 'Security alert marked as read'
      });
    } catch (error) {
      console.error('Error marking security alert as read:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to mark security alert as read'
      });
    }
  }

  // Update security notifications
  static async updateSecurityNotifications(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const notifications = req.body;

      // Mock updating security notifications
      const updatedNotifications = {
        userId,
        ...notifications,
        updatedAt: new Date()
      };

      console.log('Security notifications updated for user:', userId, updatedNotifications);

      res.json({
        success: true,
        message: 'Security notifications updated successfully',
        data: updatedNotifications
      });
    } catch (error) {
      console.error('Error updating security notifications:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update security notifications'
      });
    }
  }

  // Generate backup codes
  static async generateBackupCodes(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock generating backup codes
      const backupCodes = [
        '12345678',
        '87654321',
        '11223344',
        '44332211',
        '55667788',
        '88776655',
        '99887766',
        '66778899'
      ];

      console.log('New backup codes generated for user:', userId);

      res.json({
        success: true,
        message: 'New backup codes generated successfully',
        data: {
          codes: backupCodes,
          generatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error generating backup codes:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate backup codes'
      });
    }
  }

  // Verify backup code
  static async verifyBackupCode(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { code } = req.body;

      // Mock verifying backup code
      const verification = {
        userId,
        code,
        verified: true,
        usedAt: new Date()
      };

      console.log('Backup code verified for user:', userId);

      res.json({
        success: true,
        message: 'Backup code verified successfully',
        data: verification
      });
    } catch (error) {
      console.error('Error verifying backup code:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to verify backup code'
      });
    }
  }
}

module.exports = { SecurityController };

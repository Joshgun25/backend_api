const { UserService } = require("../models/User");
const { MarketService } = require("../models/Market");
const { OrderService } = require("../models/Order");
const { WalletService } = require("../models/Wallet");

class AdminController {
  // Get dashboard statistics
  static async getDashboardStats(req, res) {
    try {
      // Mock admin dashboard stats
      const stats = {
        users: {
          total: 15420,
          active: 12350,
          newToday: 45,
          verified: 11800,
        },
        trading: {
          totalVolume24h: 125000000,
          totalTrades24h: 45600,
          activePairs: 150,
          averageTradeSize: 2741,
        },
        revenue: {
          totalFees24h: 125000,
          totalFees30d: 3750000,
          averageFeeRate: 0.001,
        },
        system: {
          uptime: "99.9%",
          activeConnections: 1250,
          serverLoad: "45%",
          lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 6),
        },
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get dashboard stats",
      });
    }
  }

  // Get all users with pagination and filters
  static async getUsers(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        status,
        verified,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // Mock users data
      const users = [
        {
          id: "1",
          email: "john.doe@example.com",
          username: "johndoe",
          firstName: "John",
          lastName: "Doe",
          status: "active",
          verified: true,
          kycStatus: "verified",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
          totalVolume: 125000,
          totalTrades: 45,
        },
        {
          id: "2",
          email: "jane.smith@example.com",
          username: "janesmith",
          firstName: "Jane",
          lastName: "Smith",
          status: "active",
          verified: true,
          kycStatus: "pending",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24),
          totalVolume: 85000,
          totalTrades: 32,
        },
      ];

      // Apply filters
      let filteredUsers = users;

      if (search) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (status) {
        filteredUsers = filteredUsers.filter((user) => user.status === status);
      }

      if (verified !== undefined) {
        const isVerified = verified === "true";
        filteredUsers = filteredUsers.filter(
          (user) => user.verified === isVerified
        );
      }

      // Apply sorting
      filteredUsers.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          users: paginatedUsers,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredUsers.length,
            pages: Math.ceil(filteredUsers.length / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get users",
      });
    }
  }

  // Get user details
  static async getUserDetails(req, res) {
    try {
      const { userId } = req.params;

      // Mock user details
      const userDetails = {
        id: userId,
        email: "john.doe@example.com",
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        status: "active",
        verified: true,
        kycStatus: "verified",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
        profile: {
          phone: "+1234567890",
          country: "US",
          city: "New York",
          address: "123 Main St",
          postalCode: "10001",
        },
        trading: {
          totalVolume: 125000,
          totalTrades: 45,
          totalFees: 125,
          averageTradeSize: 2777,
        },
        wallet: {
          balances: [
            { currency: "BTC", available: 0.5, locked: 0.1 },
            { currency: "ETH", available: 2.0, locked: 0.5 },
            { currency: "USDT", available: 10000, locked: 1000 },
          ],
        },
        security: {
          twoFactorEnabled: true,
          lastPasswordChange: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          loginHistory: [
            {
              ip: "192.168.1.100",
              location: "New York, US",
              timestamp: new Date(),
            },
            {
              ip: "192.168.1.101",
              location: "New York, US",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
            },
          ],
        },
      };

      res.json({
        success: true,
        data: userDetails,
      });
    } catch (error) {
      console.error("Error getting user details:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get user details",
      });
    }
  }

  // Update user status
  static async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { status, reason } = req.body;

      // Mock updating user status
      console.log(
        `Updating user ${userId} status to ${status}, reason: ${reason}`
      );

      res.json({
        success: true,
        message: `User status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to update user status",
      });
    }
  }

  // Get trading pairs management
  static async getTradingPairs(req, res) {
    try {
      // Mock trading pairs
      const pairs = [
        {
          id: "1",
          symbol: "BTC/USDT",
          baseCurrency: "BTC",
          quoteCurrency: "USDT",
          status: "active",
          minOrderSize: 0.001,
          maxOrderSize: 100,
          pricePrecision: 2,
          quantityPrecision: 6,
          makerFee: 0.001,
          takerFee: 0.001,
          volume24h: 50000000,
          trades24h: 15000,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
        },
        {
          id: "2",
          symbol: "ETH/USDT",
          baseCurrency: "ETH",
          quoteCurrency: "USDT",
          status: "active",
          minOrderSize: 0.01,
          maxOrderSize: 1000,
          pricePrecision: 2,
          quantityPrecision: 4,
          makerFee: 0.001,
          takerFee: 0.001,
          volume24h: 30000000,
          trades24h: 12000,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300),
        },
      ];

      res.json({
        success: true,
        data: pairs,
      });
    } catch (error) {
      console.error("Error getting trading pairs:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get trading pairs",
      });
    }
  }

  // Update trading pair
  static async updateTradingPair(req, res) {
    try {
      const { pairId } = req.params;
      const updates = req.body;

      // Mock updating trading pair
      console.log(`Updating trading pair ${pairId}:`, updates);

      res.json({
        success: true,
        message: "Trading pair updated successfully",
      });
    } catch (error) {
      console.error("Error updating trading pair:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to update trading pair",
      });
    }
  }

  // Get system logs
  static async getSystemLogs(req, res) {
    try {
      const { page = 1, limit = 50, level, startDate, endDate } = req.query;

      // Mock system logs
      const logs = [
        {
          id: "1",
          level: "info",
          message: "User login successful",
          userId: "user123",
          ip: "192.168.1.100",
          timestamp: new Date(),
          metadata: { userAgent: "Mozilla/5.0..." },
        },
        {
          id: "2",
          level: "warning",
          message: "High memory usage detected",
          component: "server",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          metadata: { memoryUsage: "85%" },
        },
        {
          id: "3",
          level: "error",
          message: "Database connection failed",
          component: "database",
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          metadata: { error: "Connection timeout" },
        },
      ];

      // Apply filters
      let filteredLogs = logs;

      if (level) {
        filteredLogs = filteredLogs.filter((log) => log.level === level);
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          logs: paginatedLogs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredLogs.length,
            pages: Math.ceil(filteredLogs.length / limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting system logs:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get system logs",
      });
    }
  }

  // Get financial reports
  static async getFinancialReports(req, res) {
    try {
      const { period = "30d", type = "revenue" } = req.query;

      // Mock financial reports
      const reports = {
        revenue: {
          total: 3750000,
          breakdown: {
            tradingFees: 3000000,
            withdrawalFees: 500000,
            listingFees: 250000,
          },
          daily: [
            { date: "2024-01-01", amount: 125000 },
            { date: "2024-01-02", amount: 130000 },
            { date: "2024-01-03", amount: 120000 },
          ],
        },
        expenses: {
          total: 1500000,
          breakdown: {
            serverCosts: 500000,
            staff: 800000,
            marketing: 200000,
          },
        },
        profit: {
          total: 2250000,
          margin: 60,
        },
      };

      res.json({
        success: true,
        data: reports,
      });
    } catch (error) {
      console.error("Error getting financial reports:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get financial reports",
      });
    }
  }

  // Get security alerts
  static async getSecurityAlerts(req, res) {
    try {
      // Mock security alerts
      const alerts = [
        {
          id: "1",
          type: "suspicious_activity",
          severity: "high",
          title: "Multiple failed login attempts",
          description: "User account has 5 failed login attempts in 10 minutes",
          userId: "user123",
          ip: "192.168.1.100",
          timestamp: new Date(),
          status: "open",
          actions: ["block_ip", "notify_user", "require_2fa"],
        },
        {
          id: "2",
          type: "unusual_trading",
          severity: "medium",
          title: "Unusual trading pattern detected",
          description: "User made 50 trades in 1 hour, 10x above average",
          userId: "user456",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: "investigating",
          actions: ["review_trades", "contact_user"],
        },
      ];

      res.json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      console.error("Error getting security alerts:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get security alerts",
      });
    }
  }

  // Update security alert
  static async updateSecurityAlert(req, res) {
    try {
      const { alertId } = req.params;
      const { status, action, notes } = req.body;

      // Mock updating security alert
      console.log(`Updating security alert ${alertId}:`, {
        status,
        action,
        notes,
      });

      res.json({
        success: true,
        message: "Security alert updated successfully",
      });
    } catch (error) {
      console.error("Error updating security alert:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to update security alert",
      });
    }
  }
}

module.exports = { AdminController };

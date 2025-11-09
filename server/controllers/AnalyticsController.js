const { UserService } = require("../models/User");
const { MarketService } = require("../models/Market");
const { OrderService } = require("../models/Order");
const { WalletService } = require("../models/Wallet");

class AnalyticsController {
  // Get user trading analytics
  static async getUserTradingAnalytics(req, res) {
    try {
      const userId = req.user?.userId || "demo-user";
      const { period = "30d", pair } = req.query;

      // Mock user trading analytics
      const analytics = {
        overview: {
          totalTrades: 156,
          totalVolume: 125000,
          totalFees: 125,
          winRate: 68.5,
          averageTradeSize: 801.28,
          profitLoss: 2500.5,
        },
        performance: {
          daily: [
            { date: "2024-01-01", trades: 5, volume: 2500, pnl: 125.5 },
            { date: "2024-01-02", trades: 8, volume: 4200, pnl: -50.25 },
            { date: "2024-01-03", trades: 3, volume: 1800, pnl: 200.75 },
          ],
          weekly: [
            { week: "2024-W01", trades: 25, volume: 15000, pnl: 500.25 },
            { week: "2024-W02", trades: 32, volume: 22000, pnl: 750.5 },
            { week: "2024-W03", trades: 28, volume: 18000, pnl: 300.75 },
          ],
          monthly: [
            { month: "2024-01", trades: 85, volume: 55000, pnl: 1250.25 },
            { month: "2024-02", trades: 71, volume: 70000, pnl: 1250.25 },
          ],
        },
        topPairs: [
          { pair: "BTC/USDT", trades: 45, volume: 50000, pnl: 1200.5 },
          { pair: "ETH/USDT", trades: 38, volume: 35000, pnl: 800.25 },
          { pair: "BNB/USDT", trades: 25, volume: 20000, pnl: 300.75 },
          { pair: "ADA/USDT", trades: 20, volume: 15000, pnl: 150.5 },
          { pair: "SOL/USDT", trades: 18, volume: 5000, pnl: 49.5 },
        ],
        tradingHours: {
          "00:00": 5,
          "01:00": 3,
          "02:00": 2,
          "03:00": 1,
          "04:00": 2,
          "05:00": 4,
          "06:00": 8,
          "07:00": 12,
          "08:00": 15,
          "09:00": 18,
          "10:00": 22,
          "11:00": 25,
          "12:00": 28,
          "13:00": 30,
          "14:00": 32,
          "15:00": 35,
          "16:00": 38,
          "17:00": 40,
          "18:00": 35,
          "19:00": 30,
          "20:00": 25,
          "21:00": 20,
          "22:00": 15,
          "23:00": 10,
        },
        riskMetrics: {
          maxDrawdown: -850.25,
          sharpeRatio: 1.85,
          volatility: 0.15,
          var95: -200.5,
          var99: -350.75,
        },
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error getting user trading analytics:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get user trading analytics",
      });
    }
  }

  // Get market analytics
  static async getMarketAnalytics(req, res) {
    try {
      const { period = "24h", pair } = req.query;

      // Mock market analytics
      const analytics = {
        overview: {
          totalVolume: 125000000,
          totalTrades: 45600,
          activeUsers: 1250,
          newUsers: 45,
          averageTradeSize: 2741.23,
        },
        volume: {
          byPair: [
            { pair: "BTC/USDT", volume: 50000000, percentage: 40.0 },
            { pair: "ETH/USDT", volume: 30000000, percentage: 24.0 },
            { pair: "BNB/USDT", volume: 15000000, percentage: 12.0 },
            { pair: "ADA/USDT", volume: 10000000, percentage: 8.0 },
            { pair: "SOL/USDT", volume: 20000000, percentage: 16.0 },
          ],
          byHour: [
            { hour: "00:00", volume: 2500000 },
            { hour: "01:00", volume: 1800000 },
            { hour: "02:00", volume: 1200000 },
            { hour: "03:00", volume: 800000 },
            { hour: "04:00", volume: 600000 },
            { hour: "05:00", volume: 1000000 },
            { hour: "06:00", volume: 2000000 },
            { hour: "07:00", volume: 3500000 },
            { hour: "08:00", volume: 5000000 },
            { hour: "09:00", volume: 6500000 },
            { hour: "10:00", volume: 8000000 },
            { hour: "11:00", volume: 9500000 },
            { hour: "12:00", volume: 11000000 },
            { hour: "13:00", volume: 12000000 },
            { hour: "14:00", volume: 13000000 },
            { hour: "15:00", volume: 14000000 },
            { hour: "16:00", volume: 13500000 },
            { hour: "17:00", volume: 12000000 },
            { hour: "18:00", volume: 10000000 },
            { hour: "19:00", volume: 8000000 },
            { hour: "20:00", volume: 6000000 },
            { hour: "21:00", volume: 4000000 },
            { hour: "22:00", volume: 3000000 },
            { hour: "23:00", volume: 2500000 },
          ],
        },
        userActivity: {
          activeUsers: {
            daily: [
              { date: "2024-01-01", users: 1200 },
              { date: "2024-01-02", users: 1350 },
              { date: "2024-01-03", users: 1280 },
            ],
            hourly: [
              { hour: "00:00", users: 50 },
              { hour: "01:00", users: 35 },
              { hour: "02:00", users: 25 },
              { hour: "03:00", users: 20 },
              { hour: "04:00", users: 15 },
              { hour: "05:00", users: 25 },
              { hour: "06:00", users: 45 },
              { hour: "07:00", users: 80 },
              { hour: "08:00", users: 120 },
              { hour: "09:00", users: 150 },
              { hour: "10:00", users: 180 },
              { hour: "11:00", users: 200 },
              { hour: "12:00", users: 220 },
              { hour: "13:00", users: 240 },
              { hour: "14:00", users: 250 },
              { hour: "15:00", users: 260 },
              { hour: "16:00", users: 255 },
              { hour: "17:00", users: 240 },
              { hour: "18:00", users: 200 },
              { hour: "19:00", users: 160 },
              { hour: "20:00", users: 120 },
              { hour: "21:00", users: 80 },
              { hour: "22:00", users: 60 },
              { hour: "23:00", users: 50 },
            ],
          },
          newUsers: {
            daily: [
              { date: "2024-01-01", users: 25 },
              { date: "2024-01-02", users: 30 },
              { date: "2024-01-03", users: 28 },
            ],
          },
        },
        tradingPatterns: {
          orderTypes: {
            market: 65.5,
            limit: 34.5,
          },
          orderSides: {
            buy: 52.3,
            sell: 47.7,
          },
          tradeSizes: {
            small: 45.2, // < $100
            medium: 35.8, // $100 - $1000
            large: 15.5, // $1000 - $10000
            whale: 3.5, // > $10000
          },
        },
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error getting market analytics:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get market analytics",
      });
    }
  }

  // Get portfolio analytics
  static async getPortfolioAnalytics(req, res) {
    try {
      const userId = req.user?.userId || "demo-user";
      const { period = "30d" } = req.query;

      // Mock portfolio analytics
      const analytics = {
        overview: {
          totalValue: 125000,
          totalCost: 100000,
          totalProfit: 25000,
          profitPercentage: 25.0,
          dayChange: 1250,
          dayChangePercentage: 1.01,
        },
        allocation: [
          {
            currency: "BTC",
            value: 50000,
            percentage: 40.0,
            cost: 40000,
            profit: 10000,
          },
          {
            currency: "ETH",
            value: 30000,
            percentage: 24.0,
            cost: 25000,
            profit: 5000,
          },
          {
            currency: "BNB",
            value: 20000,
            percentage: 16.0,
            cost: 18000,
            profit: 2000,
          },
          {
            currency: "ADA",
            value: 15000,
            percentage: 12.0,
            cost: 12000,
            profit: 3000,
          },
          {
            currency: "USDT",
            value: 10000,
            percentage: 8.0,
            cost: 10000,
            profit: 0,
          },
        ],
        performance: {
          daily: [
            { date: "2024-01-01", value: 100000, change: 0 },
            { date: "2024-01-02", value: 102500, change: 2.5 },
            { date: "2024-01-03", value: 101000, change: -1.46 },
            { date: "2024-01-04", value: 105000, change: 3.96 },
            { date: "2024-01-05", value: 108000, change: 2.86 },
          ],
          weekly: [
            { week: "2024-W01", value: 105000, change: 5.0 },
            { week: "2024-W02", value: 110000, change: 4.76 },
            { week: "2024-W03", value: 115000, change: 4.55 },
            { week: "2024-W04", value: 120000, change: 4.35 },
          ],
          monthly: [
            { month: "2024-01", value: 120000, change: 20.0 },
            { month: "2024-02", value: 125000, change: 4.17 },
          ],
        },
        riskMetrics: {
          volatility: 0.15,
          sharpeRatio: 1.85,
          maxDrawdown: -8500,
          var95: -2000,
          var99: -3500,
          beta: 1.2,
        },
        topPerformers: [
          { currency: "BTC", profit: 10000, profitPercentage: 25.0 },
          { currency: "ADA", profit: 3000, profitPercentage: 25.0 },
          { currency: "ETH", profit: 5000, profitPercentage: 20.0 },
          { currency: "BNB", profit: 2000, profitPercentage: 11.11 },
        ],
        worstPerformers: [
          { currency: "USDT", profit: 0, profitPercentage: 0.0 },
        ],
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error getting portfolio analytics:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get portfolio analytics",
      });
    }
  }

  // Get revenue analytics
  static async getRevenueAnalytics(req, res) {
    try {
      const { period = "30d" } = req.query;

      // Mock revenue analytics
      const analytics = {
        overview: {
          totalRevenue: 375000,
          totalFees: 350000,
          otherRevenue: 25000,
          dayChange: 12500,
          dayChangePercentage: 3.45,
        },
        revenue: {
          bySource: [
            { source: "Trading Fees", amount: 300000, percentage: 80.0 },
            { source: "Withdrawal Fees", amount: 50000, percentage: 13.3 },
            { source: "Listing Fees", amount: 25000, percentage: 6.7 },
          ],
          byPair: [
            { pair: "BTC/USDT", fees: 120000, percentage: 34.3 },
            { pair: "ETH/USDT", fees: 80000, percentage: 22.9 },
            { pair: "BNB/USDT", fees: 60000, percentage: 17.1 },
            { pair: "ADA/USDT", fees: 40000, percentage: 11.4 },
            { pair: "SOL/USDT", fees: 50000, percentage: 14.3 },
          ],
          daily: [
            { date: "2024-01-01", amount: 12500 },
            { date: "2024-01-02", amount: 13000 },
            { date: "2024-01-03", amount: 12000 },
            { date: "2024-01-04", amount: 15000 },
            { date: "2024-01-05", amount: 14000 },
          ],
          monthly: [
            { month: "2024-01", amount: 350000 },
            { month: "2024-02", amount: 375000 },
          ],
        },
        userMetrics: {
          averageRevenuePerUser: 24.35,
          topUsers: [
            { userId: "user123", revenue: 1250, trades: 150 },
            { userId: "user456", revenue: 980, trades: 120 },
            { userId: "user789", revenue: 850, trades: 100 },
          ],
          revenueByUserTier: [
            { tier: "Basic", users: 10000, revenue: 100000 },
            { tier: "Silver", users: 3000, revenue: 150000 },
            { tier: "Gold", users: 1000, revenue: 100000 },
            { tier: "Platinum", users: 100, revenue: 25000 },
          ],
        },
        projections: {
          nextMonth: 400000,
          nextQuarter: 1200000,
          nextYear: 5000000,
          growthRate: 6.7,
        },
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error getting revenue analytics:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get revenue analytics",
      });
    }
  }

  // Get user behavior analytics
  static async getUserBehaviorAnalytics(req, res) {
    try {
      const { period = "30d" } = req.query;

      // Mock user behavior analytics
      const analytics = {
        engagement: {
          dailyActiveUsers: 1250,
          weeklyActiveUsers: 3500,
          monthlyActiveUsers: 8500,
          averageSessionDuration: 25.5, // minutes
          averageSessionsPerUser: 3.2,
          bounceRate: 15.5,
        },
        userJourney: {
          registration: 1000,
          firstDeposit: 750,
          firstTrade: 600,
          secondTrade: 450,
          thirdTrade: 350,
          conversionRates: {
            registration_to_deposit: 75.0,
            deposit_to_first_trade: 80.0,
            first_to_second_trade: 75.0,
            second_to_third_trade: 77.8,
          },
        },
        featureUsage: {
          trading: 85.2,
          wallet: 92.5,
          markets: 78.3,
          history: 45.8,
          settings: 25.6,
          support: 12.3,
        },
        deviceAnalytics: {
          desktop: 45.2,
          mobile: 38.7,
          tablet: 16.1,
        },
        geographicDistribution: [
          { country: "US", users: 2500, percentage: 29.4 },
          { country: "UK", users: 1200, percentage: 14.1 },
          { country: "CA", users: 800, percentage: 9.4 },
          { country: "AU", users: 600, percentage: 7.1 },
          { country: "DE", users: 500, percentage: 5.9 },
          { country: "Other", users: 2900, percentage: 34.1 },
        ],
        retention: {
          day1: 85.2,
          day7: 65.8,
          day30: 45.3,
          day90: 32.1,
        },
        churn: {
          daily: 0.5,
          weekly: 3.2,
          monthly: 12.5,
        },
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error getting user behavior analytics:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get user behavior analytics",
      });
    }
  }

  // Get risk analytics
  static async getRiskAnalytics(req, res) {
    try {
      const { period = "30d" } = req.query;

      // Mock risk analytics
      const analytics = {
        overview: {
          totalRisk: 1250000,
          riskLimit: 2000000,
          riskUtilization: 62.5,
          riskAlerts: 5,
          riskEvents: 12,
        },
        riskMetrics: {
          var95: 50000,
          var99: 75000,
          expectedShortfall: 60000,
          maxDrawdown: 85000,
          sharpeRatio: 1.85,
          volatility: 0.15,
        },
        riskByAsset: [
          { asset: "BTC", risk: 500000, percentage: 40.0, volatility: 0.25 },
          { asset: "ETH", risk: 300000, percentage: 24.0, volatility: 0.3 },
          { asset: "BNB", risk: 200000, percentage: 16.0, volatility: 0.2 },
          { asset: "ADA", risk: 150000, percentage: 12.0, volatility: 0.35 },
          { asset: "USDT", risk: 100000, percentage: 8.0, volatility: 0.01 },
        ],
        riskEvents: [
          {
            id: "1",
            type: "high_volatility",
            severity: "medium",
            description: "BTC volatility exceeded 30% threshold",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            resolved: false,
          },
          {
            id: "2",
            type: "large_trade",
            severity: "low",
            description: "Large trade detected: 10 BTC",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
            resolved: true,
          },
          {
            id: "3",
            type: "unusual_activity",
            severity: "high",
            description: "Unusual trading pattern detected",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
            resolved: false,
          },
        ],
        riskLimits: {
          daily: 100000,
          weekly: 500000,
          monthly: 2000000,
          perAsset: 200000,
          perUser: 50000,
        },
        stressTest: {
          scenario1: { name: "Market Crash", impact: -25.5 },
          scenario2: { name: "High Volatility", impact: -15.2 },
          scenario3: { name: "Liquidity Crisis", impact: -35.8 },
        },
      };

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Error getting risk analytics:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get risk analytics",
      });
    }
  }

  // Export analytics data
  static async exportAnalytics(req, res) {
    try {
      const { type, period, format = "csv" } = req.query;
      const userId = req.user?.userId || "demo-user";

      // Mock export
      const exportData = {
        id: `export-${Date.now()}`,
        type,
        period,
        format,
        userId,
        status: "processing",
        createdAt: new Date(),
        downloadUrl: null,
      };

      console.log("Analytics export requested:", exportData);

      res.status(202).json({
        success: true,
        message: "Export request submitted successfully",
        data: exportData,
      });
    } catch (error) {
      console.error("Error exporting analytics:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to export analytics",
      });
    }
  }
}

module.exports = { AnalyticsController };

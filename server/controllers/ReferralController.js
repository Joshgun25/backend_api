const { UserService } = require('../models/User');

class ReferralController {
  // Get referral program info
  static async getReferralInfo(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock referral info
      const referralInfo = {
        userId,
        referralCode: 'LUMEN123',
        referralLink: `https://lumen-exchange.com/ref/LUMEN123`,
        program: {
          name: 'Lumen Referral Program',
          description: 'Earn rewards for referring friends to Lumen Exchange',
          active: true,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        },
        rewards: {
          referrer: {
            type: 'percentage',
            value: 20, // 20% of trading fees
            description: 'Earn 20% of trading fees from your referrals'
          },
          referee: {
            type: 'bonus',
            value: 10, // $10 bonus
            description: 'Get $10 bonus when you sign up with a referral code'
          }
        },
        statistics: {
          totalReferrals: 15,
          activeReferrals: 12,
          totalEarnings: 125.50,
          pendingEarnings: 25.75,
          thisMonthEarnings: 45.25
        },
        limits: {
          maxReferrals: 100,
          minTradingVolume: 1000, // $1000 minimum trading volume
          maxEarningsPerReferral: 1000 // $1000 max earnings per referral
        }
      };

      res.json({
        success: true,
        data: referralInfo
      });
    } catch (error) {
      console.error('Error getting referral info:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get referral info'
      });
    }
  }

  // Get referral statistics
  static async getReferralStats(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { period = '30d' } = req.query;

      // Mock referral statistics
      const stats = {
        overview: {
          totalReferrals: 15,
          activeReferrals: 12,
          totalEarnings: 125.50,
          pendingEarnings: 25.75,
          thisMonthEarnings: 45.25,
          lastMonthEarnings: 35.50
        },
        referrals: {
          byStatus: {
            pending: 3,
            active: 12,
            inactive: 0
          },
          byMonth: [
            { month: '2024-01', count: 5, earnings: 25.50 },
            { month: '2024-02', count: 8, earnings: 45.25 },
            { month: '2024-03', count: 2, earnings: 15.75 }
          ],
          bySource: {
            direct: 10,
            social: 3,
            email: 2
          }
        },
        earnings: {
          daily: [
            { date: '2024-01-01', amount: 2.50 },
            { date: '2024-01-02', amount: 3.25 },
            { date: '2024-01-03', amount: 1.75 },
            { date: '2024-01-04', amount: 4.50 },
            { date: '2024-01-05', amount: 2.25 }
          ],
          monthly: [
            { month: '2024-01', amount: 25.50 },
            { month: '2024-02', amount: 45.25 },
            { month: '2024-03', amount: 15.75 }
          ]
        },
        topReferrals: [
          {
            userId: 'ref123',
            email: 'john.doe@example.com',
            joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            totalEarnings: 25.50,
            tradingVolume: 5000,
            status: 'active'
          },
          {
            userId: 'ref456',
            email: 'jane.smith@example.com',
            joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
            totalEarnings: 20.25,
            tradingVolume: 3500,
            status: 'active'
          },
          {
            userId: 'ref789',
            email: 'bob.wilson@example.com',
            joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
            totalEarnings: 15.75,
            tradingVolume: 2500,
            status: 'active'
          }
        ]
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting referral stats:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get referral stats'
      });
    }
  }

  // Get referral list
  static async getReferralList(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { page = 1, limit = 20, status, sortBy = 'joinedAt', sortOrder = 'desc' } = req.query;

      // Mock referral list
      const referrals = [
        {
          id: 'ref123',
          userId: 'user123',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          status: 'active', // 'pending', 'active', 'inactive'
          totalEarnings: 25.50,
          tradingVolume: 5000,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
          kycStatus: 'verified',
          totalTrades: 45
        },
        {
          id: 'ref456',
          userId: 'user456',
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
          status: 'active',
          totalEarnings: 20.25,
          tradingVolume: 3500,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24),
          kycStatus: 'verified',
          totalTrades: 32
        },
        {
          id: 'ref789',
          userId: 'user789',
          email: 'bob.wilson@example.com',
          firstName: 'Bob',
          lastName: 'Wilson',
          joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
          status: 'pending',
          totalEarnings: 0,
          tradingVolume: 0,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          kycStatus: 'pending',
          totalTrades: 0
        }
      ];

      // Apply filters
      let filteredReferrals = referrals;
      
      if (status) {
        filteredReferrals = filteredReferrals.filter(ref => ref.status === status);
      }

      // Apply sorting
      filteredReferrals.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedReferrals = filteredReferrals.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          referrals: paginatedReferrals,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredReferrals.length,
            pages: Math.ceil(filteredReferrals.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting referral list:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get referral list'
      });
    }
  }

  // Get referral earnings
  static async getReferralEarnings(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { page = 1, limit = 20, period = '30d' } = req.query;

      // Mock referral earnings
      const earnings = [
        {
          id: 'earn123',
          userId,
          referralId: 'ref123',
          referralEmail: 'john.doe@example.com',
          type: 'trading_fee',
          amount: 2.50,
          description: 'Trading fee from BTC/USDT trade',
          tradingPair: 'BTC/USDT',
          tradingVolume: 1000,
          feeRate: 0.001,
          status: 'paid',
          earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
        },
        {
          id: 'earn456',
          userId,
          referralId: 'ref456',
          referralEmail: 'jane.smith@example.com',
          type: 'trading_fee',
          amount: 3.25,
          description: 'Trading fee from ETH/USDT trade',
          tradingPair: 'ETH/USDT',
          tradingVolume: 1300,
          feeRate: 0.001,
          status: 'paid',
          earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
        },
        {
          id: 'earn789',
          userId,
          referralId: 'ref123',
          referralEmail: 'john.doe@example.com',
          type: 'trading_fee',
          amount: 1.75,
          description: 'Trading fee from BNB/USDT trade',
          tradingPair: 'BNB/USDT',
          tradingVolume: 700,
          feeRate: 0.001,
          status: 'pending',
          earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
          paidAt: null
        }
      ];

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedEarnings = earnings.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          earnings: paginatedEarnings,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: earnings.length,
            pages: Math.ceil(earnings.length / limit)
          },
          summary: {
            totalEarnings: 125.50,
            pendingEarnings: 25.75,
            paidEarnings: 99.75
          }
        }
      });
    } catch (error) {
      console.error('Error getting referral earnings:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get referral earnings'
      });
    }
  }

  // Withdraw referral earnings
  static async withdrawEarnings(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      const { amount, currency = 'USDT', address } = req.body;

      // Mock withdrawal
      const withdrawal = {
        id: `withdraw-${Date.now()}`,
        userId,
        amount: parseFloat(amount),
        currency,
        address,
        status: 'pending',
        requestedAt: new Date(),
        processedAt: null,
        txHash: null,
        fee: 5.0
      };

      console.log('Referral earnings withdrawal requested:', withdrawal);

      res.status(201).json({
        success: true,
        message: 'Withdrawal request submitted successfully',
        data: withdrawal
      });
    } catch (error) {
      console.error('Error withdrawing earnings:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to withdraw earnings'
      });
    }
  }

  // Generate referral code
  static async generateReferralCode(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';

      // Mock generating referral code
      const referralCode = `LUMEN${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const referralData = {
        userId,
        referralCode,
        referralLink: `https://lumen-exchange.com/ref/${referralCode}`,
        createdAt: new Date(),
        active: true
      };

      console.log('New referral code generated:', referralData);

      res.status(201).json({
        success: true,
        message: 'Referral code generated successfully',
        data: referralData
      });
    } catch (error) {
      console.error('Error generating referral code:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate referral code'
      });
    }
  }

  // Apply referral code
  static async applyReferralCode(req, res) {
    try {
      const { referralCode } = req.body;
      const userId = req.user?.userId || 'demo-user';

      // Mock applying referral code
      const application = {
        userId,
        referralCode,
        appliedAt: new Date(),
        status: 'applied',
        bonus: {
          amount: 10,
          currency: 'USDT',
          description: 'Welcome bonus for using referral code'
        }
      };

      console.log('Referral code applied:', application);

      res.status(201).json({
        success: true,
        message: 'Referral code applied successfully',
        data: application
      });
    } catch (error) {
      console.error('Error applying referral code:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to apply referral code'
      });
    }
  }

  // Get referral program settings
  static async getReferralSettings(req, res) {
    try {
      // Mock referral program settings
      const settings = {
        program: {
          name: 'Lumen Referral Program',
          description: 'Earn rewards for referring friends to Lumen Exchange',
          active: true,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          terms: 'Referral program terms and conditions...'
        },
        rewards: {
          referrer: {
            type: 'percentage',
            value: 20,
            description: 'Earn 20% of trading fees from your referrals',
            minTradingVolume: 1000,
            maxEarningsPerReferral: 1000
          },
          referee: {
            type: 'bonus',
            value: 10,
            description: 'Get $10 bonus when you sign up with a referral code',
            currency: 'USDT',
            minDeposit: 100
          }
        },
        limits: {
          maxReferrals: 100,
          minTradingVolume: 1000,
          maxEarningsPerReferral: 1000,
          withdrawalMinAmount: 50,
          withdrawalFee: 5
        },
        restrictions: {
          allowedCountries: ['US', 'UK', 'CA', 'AU', 'DE'],
          restrictedCountries: ['CN', 'KR'],
          minAge: 18,
          kycRequired: true
        }
      };

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error getting referral settings:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get referral settings'
      });
    }
  }

  // Admin: Get all referrals
  static async getAllReferrals(req, res) {
    try {
      const { page = 1, limit = 20, status, sortBy = 'joinedAt', sortOrder = 'desc' } = req.query;

      // Mock all referrals
      const referrals = [
        {
          id: 'ref123',
          referrerId: 'user123',
          referrerEmail: 'referrer@example.com',
          refereeId: 'user456',
          refereeEmail: 'referee@example.com',
          referralCode: 'LUMEN123',
          joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          status: 'active',
          totalEarnings: 25.50,
          tradingVolume: 5000,
          kycStatus: 'verified'
        }
      ];

      // Apply filters and sorting
      let filteredReferrals = referrals;
      
      if (status) {
        filteredReferrals = filteredReferrals.filter(ref => ref.status === status);
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedReferrals = filteredReferrals.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          referrals: paginatedReferrals,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredReferrals.length,
            pages: Math.ceil(filteredReferrals.length / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error getting all referrals:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get all referrals'
      });
    }
  }

  // Admin: Update referral program settings
  static async updateReferralSettings(req, res) {
    try {
      const settings = req.body;

      // Mock updating referral settings
      console.log('Referral program settings updated:', settings);

      res.json({
        success: true,
        message: 'Referral program settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating referral settings:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update referral settings'
      });
    }
  }
}

module.exports = { ReferralController };

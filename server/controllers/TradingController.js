const { OrderService } = require('../models/Order');
const { WalletService } = require('../models/Wallet');

class TradingController {
  // Get order book
  static async getOrderBook(req, res) {
    try {
      const { pair } = req.params;
      
      const orderBook = OrderService.getOrderBook(pair);
      
      res.json({
        success: true,
        data: orderBook
      });
    } catch (error) {
      console.error('Error fetching order book:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch order book' 
      });
    }
  }

  // Get recent trades
  static async getRecentTrades(req, res) {
    try {
      const { pair } = req.params;
      const { limit = 50 } = req.query;
      
      // Mock recent trades data
      const recentTrades = [
        { price: 65432.10, amount: 0.1234, time: "14:23:45", type: "buy" },
        { price: 65431.50, amount: 0.2456, time: "14:23:44", type: "sell" },
        { price: 65433.20, amount: 0.0987, time: "14:23:43", type: "buy" },
        { price: 65430.80, amount: 0.3456, time: "14:23:42", type: "sell" },
        { price: 65432.90, amount: 0.1876, time: "14:23:41", type: "buy" }
      ];
      
      res.json({
        success: true,
        data: {
          pair: pair.toUpperCase(),
          trades: recentTrades.slice(0, parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching recent trades:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch recent trades' 
      });
    }
  }

  // Place new order
  static async placeOrder(req, res) {
    try {
      const { pair, side, type, amount, price } = req.body;
      const userId = req.user?.userId || 'demo-user';
      
      // Validate required fields
      if (!pair || !side || !type || !amount) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields: pair, side, type, amount' 
        });
      }
      
      if (type === 'limit' && !price) {
        return res.status(400).json({ 
          success: false,
          error: 'Price is required for limit orders' 
        });
      }
      
      // Check if user has sufficient balance for the order
      const baseCoin = pair.split('/')[0];
      const quoteCoin = pair.split('/')[1];
      
      if (side === 'buy') {
        const wallet = WalletService.getWallet(userId);
        const balance = wallet.getBalance(quoteCoin);
        const requiredAmount = type === 'market' ? amount * price : amount * price;
        
        if (balance.available < requiredAmount) {
          return res.status(400).json({ 
            success: false,
            error: 'Insufficient balance for this order' 
          });
        }
      } else {
        const wallet = WalletService.getWallet(userId);
        const balance = wallet.getBalance(baseCoin);
        
        if (balance.available < amount) {
          return res.status(400).json({ 
            success: false,
            error: 'Insufficient balance for this order' 
          });
        }
      }
      
      // Create new order
      const order = OrderService.create({
        userId,
        pair: pair.toUpperCase(),
        side: side.toLowerCase(),
        type: type.toLowerCase(),
        amount: parseFloat(amount),
        price: price ? parseFloat(price) : null
      });
      
      
      if (side === 'buy') {
        const requiredAmount = type === 'market' ? amount * price : amount * price;
        WalletService.lockBalance(userId, quoteCoin, requiredAmount);
      } else {
        WalletService.lockBalance(userId, baseCoin, amount);
      }
      
      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order
      });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to place order' 
      });
    }
  }

  // Get user orders
  static async getUserOrders(req, res) {
    try {
      const { status, pair, limit = 50 } = req.query;
      const userId = req.user?.userId || 'demo-user';
      
      let userOrders = OrderService.findByUserId(userId);
      
      // Apply filters
      if (status && status !== 'all') {
        userOrders = userOrders.filter(order => order.status === status);
      }
      
      if (pair) {
        userOrders = userOrders.filter(order => order.pair === pair.toUpperCase());
      }
      
      // Apply limit
      userOrders = userOrders.slice(0, parseInt(limit));
      
      res.json({
        success: true,
        data: {
          orders: userOrders,
          total: userOrders.length,
          filters: { status, pair, limit }
        }
      });
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch user orders'
      });
    }
  }

  // Cancel order
  static async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.userId || 'demo-user';
      
      const order = OrderService.findById(orderId);
      if (!order) {
        return res.status(404).json({ 
          success: false,
          error: 'Order not found' 
        });
      }
      
      if (order.userId !== userId) {
        return res.status(403).json({ 
          success: false,
          error: 'Unauthorized to cancel this order' 
        });
      }
      
      const cancelledOrder = OrderService.cancel(orderId, userId);
      
      // Unlock the balance
      const baseCoin = order.pair.split('/')[0];
      const quoteCoin = order.pair.split('/')[1];
      
      if (order.side === 'buy') {
        const lockedAmount = order.amount * (order.price || 0);
        WalletService.unlockBalance(userId, quoteCoin, lockedAmount);
      } else {
        WalletService.unlockBalance(userId, baseCoin, order.amount);
      }
      
      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: cancelledOrder
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to cancel order' 
      });
    }
  }

  // Get trading statistics
  static async getTradingStats(req, res) {
    try {
      const { pair } = req.params;
      
      const stats = OrderService.getTradingStats(pair);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching trading stats:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch trading statistics' 
      });
    }
  }

  // Get user trading history
  static async getUserTradingHistory(req, res) {
    try {
      const { pair, limit = 100 } = req.query;
      const userId = req.user?.userId || 'demo-user';
      
      let userOrders = OrderService.findByUserId(userId);
      
      // Filter by pair if specified
      if (pair) {
        userOrders = userOrders.filter(order => order.pair === pair.toUpperCase());
      }
      
      // Only include completed orders
      userOrders = userOrders.filter(order => order.status === 'filled');
      
      // Apply limit
      userOrders = userOrders.slice(0, parseInt(limit));
      
      res.json({
        success: true,
        data: {
          trades: userOrders,
          total: userOrders.length,
          filters: { pair, limit }
        }
      });
    } catch (error) {
      console.error('Error fetching trading history:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch trading history' 
      });
    }
  }

  // Get order details
  static async getOrderDetails(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.userId || 'demo-user';
      
      const order = OrderService.findById(orderId);
      if (!order) {
        return res.status(404).json({ 
          success: false,
          error: 'Order not found' 
        });
      }
      
      if (order.userId !== userId) {
        return res.status(403).json({ 
          success: false,
          error: 'Unauthorized to view this order' 
        });
      }
      
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch order details' 
      });
    }
  }
}

module.exports = { TradingController };

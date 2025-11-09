const { WalletService, TransactionService } = require('../models/Wallet');

class WalletController {
  // Get wallet balances
  static async getBalances(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      
      const balances = WalletService.getBalances(userId);
      
      res.json({
        success: true,
        data: balances
      });
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch wallet balances' 
      });
    }
  }

  // Get transaction history
  static async getTransactionHistory(req, res) {
    try {
      const { type, status, limit = 50 } = req.query;
      const userId = req.user?.userId || 'demo-user';
      
      const transactions = TransactionService.getTransactionHistory(userId, {
        type,
        status,
        limit
      });
      
      res.json({
        success: true,
        data: {
          transactions,
          total: transactions.length,
          filters: { type, status, limit }
        }
      });
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch transaction history' 
      });
    }
  }

  // Create deposit transaction
  static async createDeposit(req, res) {
    try {
      const { coin, amount, network, txHash } = req.body;
      const userId = req.user?.userId || 'demo-user';
      
      // Validate required fields
      if (!coin || !amount || !network) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields: coin, amount, network' 
        });
      }
      
      // Create deposit transaction
      const transaction = TransactionService.create({
        userId,
        type: 'deposit',
        coin: coin.toUpperCase(),
        amount: parseFloat(amount),
        network,
        txHash: txHash || `dep_${Date.now()}`,
        status: 'pending'
      });
      
      res.status(201).json({
        success: true,
        message: 'Deposit transaction created',
        data: transaction
      });
    } catch (error) {
      console.error('Error creating deposit:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to create deposit transaction' 
      });
    }
  }

  // Create withdrawal transaction
  static async createWithdrawal(req, res) {
    try {
      const { coin, amount, address, network } = req.body;
      const userId = req.user?.userId || 'demo-user';
      
      // Validate required fields
      if (!coin || !amount || !address || !network) {
        return res.status(400).json({ 
          success: false,
          error: 'Missing required fields: coin, amount, address, network' 
        });
      }
      
      // Check if user has sufficient balance
      const wallet = WalletService.getWallet(userId);
      const balance = wallet.getBalance(coin);
      
      if (balance.available < parseFloat(amount)) {
        return res.status(400).json({ 
          success: false,
          error: 'Insufficient balance for withdrawal' 
        });
      }
      
      // Create withdrawal transaction
      const transaction = TransactionService.create({
        userId,
        type: 'withdraw',
        coin: coin.toUpperCase(),
        amount: parseFloat(amount),
        address,
        network,
        txHash: `wit_${Date.now()}`,
        status: 'pending'
      });
      
      // Lock the balance for withdrawal
      WalletService.lockBalance(userId, coin, parseFloat(amount));
      
      res.status(201).json({
        success: true,
        message: 'Withdrawal transaction created',
        data: transaction
      });
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to create withdrawal transaction' 
      });
    }
  }

  // Get transaction details
  static async getTransactionDetails(req, res) {
    try {
      const { transactionId } = req.params;
      const userId = req.user?.userId || 'demo-user';
      
      const transaction = TransactionService.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ 
          success: false,
          error: 'Transaction not found' 
        });
      }
      
      if (transaction.userId !== userId) {
        return res.status(403).json({ 
          success: false,
          error: 'Unauthorized to view this transaction' 
        });
      }
      
      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch transaction details' 
      });
    }
  }

  // Get wallet summary
  static async getWalletSummary(req, res) {
    try {
      const userId = req.user?.userId || 'demo-user';
      
      const balances = WalletService.getBalances(userId);
      const recentTransactions = TransactionService.getTransactionHistory(userId, { limit: 10 });
      
      // Calculate portfolio statistics
      const totalValue = balances.totalValue;
      const assetCount = balances.balances.length;
      const topAsset = balances.balances.reduce((max, balance) => 
        balance.valueUSD > max.valueUSD ? balance : max, 
        { valueUSD: 0 }
      );
      
      res.json({
        success: true,
        data: {
          totalValue,
          assetCount,
          topAsset,
          recentTransactions: recentTransactions.slice(0, 5),
          balances: balances.balances
        }
      });
    } catch (error) {
      console.error('Error fetching wallet summary:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch wallet summary' 
      });
    }
  }

  // Get balance for specific coin
  static async getCoinBalance(req, res) {
    try {
      const { coin } = req.params;
      const userId = req.user?.userId || 'demo-user';
      
      const wallet = WalletService.getWallet(userId);
      const balance = wallet.getBalance(coin);
      
      res.json({
        success: true,
        data: balance
      });
    } catch (error) {
      console.error('Error fetching coin balance:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch coin balance' 
      });
    }
  }

  // Update transaction status (admin only)
  static async updateTransactionStatus(req, res) {
    try {
      const { transactionId } = req.params;
      const { status, txHash, confirmations } = req.body;
      
      // In a real app, you'd check if user is admin
      const transaction = TransactionService.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ 
          success: false,
          error: 'Transaction not found' 
        });
      }
      
      const updatedTransaction = TransactionService.update(transactionId, {
        status,
        txHash: txHash || transaction.txHash,
        confirmations: confirmations || transaction.confirmations
      });
      
      // If transaction is completed, update wallet balance
      if (status === 'completed') {
        if (transaction.type === 'deposit') {
          WalletService.addBalance(transaction.userId, transaction.coin, transaction.amount);
        } else if (transaction.type === 'withdraw') {
          WalletService.subtractBalance(transaction.userId, transaction.coin, transaction.amount, true);
        }
      }
      
      res.json({
        success: true,
        message: 'Transaction status updated',
        data: updatedTransaction
      });
    } catch (error) {
      console.error('Error updating transaction status:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to update transaction status' 
      });
    }
  }
}

module.exports = { WalletController };

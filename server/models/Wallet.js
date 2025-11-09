// Wallet model
class Wallet {
  constructor(data) {
    this.userId = data.userId;
    this.balances = data.balances || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Get balance for a specific coin
  getBalance(coin) {
    const balance = this.balances.find((b) => b.symbol === coin.toUpperCase());
    return (
      balance || {
        coin: coin,
        symbol: coin.toUpperCase(),
        available: 0,
        locked: 0,
        valueUSD: 0,
      }
    );
  }

  // Get total portfolio value
  getTotalValue() {
    return this.balances.reduce((sum, balance) => sum + balance.valueUSD, 0);
  }

  // Add balance
  addBalance(coin, amount, isLocked = false) {
    const existingBalance = this.balances.find(
      (b) => b.symbol === coin.toUpperCase()
    );

    if (existingBalance) {
      if (isLocked) {
        existingBalance.locked += amount;
      } else {
        existingBalance.available += amount;
      }
    } else {
      this.balances.push({
        coin: coin,
        symbol: coin.toUpperCase(),
        available: isLocked ? 0 : amount,
        locked: isLocked ? amount : 0,
        valueUSD: 0,
      });
    }

    this.updatedAt = new Date();
  }

  // Subtract balance
  subtractBalance(coin, amount, fromLocked = false) {
    const balance = this.balances.find((b) => b.symbol === coin.toUpperCase());

    if (!balance) {
      throw new Error("Insufficient balance");
    }

    if (fromLocked) {
      if (balance.locked < amount) {
        throw new Error("Insufficient locked balance");
      }
      balance.locked -= amount;
    } else {
      if (balance.available < amount) {
        throw new Error("Insufficient available balance");
      }
      balance.available -= amount;
    }

    this.updatedAt = new Date();
  }

  // Lock balance
  lockBalance(coin, amount) {
    this.subtractBalance(coin, amount, false);
    this.addBalance(coin, amount, true);
  }

  // Unlock balance
  unlockBalance(coin, amount) {
    this.subtractBalance(coin, amount, true);
    this.addBalance(coin, amount, false);
  }
}

// Transaction model
class Transaction {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.type = data.type; // 'deposit', 'withdraw', 'trade', 'transfer'
    this.coin = data.coin;
    this.amount = data.amount;
    this.status = data.status || "pending"; // 'pending', 'completed', 'failed', 'cancelled'
    this.txHash = data.txHash;
    this.network = data.network;
    this.fee = data.fee;
    this.address = data.address;
    this.confirmations = data.confirmations;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validate transaction data
  static validate(data) {
    const errors = [];

    if (!["deposit", "withdraw", "trade", "transfer"].includes(data.type)) {
      errors.push("Valid transaction type is required");
    }

    if (!data.coin || data.coin.trim().length === 0) {
      errors.push("Coin symbol is required");
    }

    if (typeof data.amount !== "number" || data.amount <= 0) {
      errors.push("Valid amount is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Wallet data storage (will be replaced with database)
const wallets = {};

// Transaction data storage (will be replaced with database)
const transactions = [];

// Wallet service methods
class WalletService {
  static getWallet(userId) {
    return wallets[userId] || new Wallet({ userId });
  }

  static getBalances(userId) {
    const wallet = this.getWallet(userId);
    return {
      balances: wallet.balances,
      totalValue: wallet.getTotalValue(),
    };
  }

  static addBalance(userId, coin, amount, isLocked = false) {
    const wallet = this.getWallet(userId);
    wallet.addBalance(coin, amount, isLocked);
    wallets[userId] = wallet;
    return wallet;
  }

  static subtractBalance(userId, coin, amount, fromLocked = false) {
    const wallet = this.getWallet(userId);
    wallet.subtractBalance(coin, amount, fromLocked);
    wallets[userId] = wallet;
    return wallet;
  }

  static lockBalance(userId, coin, amount) {
    const wallet = this.getWallet(userId);
    wallet.lockBalance(coin, amount);
    wallets[userId] = wallet;
    return wallet;
  }

  static unlockBalance(userId, coin, amount) {
    const wallet = this.getWallet(userId);
    wallet.unlockBalance(coin, amount);
    wallets[userId] = wallet;
    return wallet;
  }
}

// Transaction service methods
class TransactionService {
  static create(transactionData) {
    const validation = Transaction.validate(transactionData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const newTransaction = new Transaction({
      id: Date.now().toString(),
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    transactions.push(newTransaction);
    return newTransaction;
  }

  static findById(id) {
    return transactions.find((transaction) => transaction.id === id);
  }

  static findByUserId(userId) {
    return transactions.filter((transaction) => transaction.userId === userId);
  }

  static findByType(type) {
    return transactions.filter(
      (transaction) => transaction.type.toLowerCase() === type.toLowerCase()
    );
  }

  static findByStatus(status) {
    return transactions.filter(
      (transaction) => transaction.status.toLowerCase() === status.toLowerCase()
    );
  }

  static update(id, updateData) {
    const transactionIndex = transactions.findIndex(
      (transaction) => transaction.id === id
    );
    if (transactionIndex === -1) {
      throw new Error("Transaction not found");
    }

    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    return transactions[transactionIndex];
  }

  static getTransactionHistory(userId, filters = {}) {
    let userTransactions = this.findByUserId(userId);

    if (filters.type && filters.type !== "all") {
      userTransactions = userTransactions.filter(
        (tx) => tx.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters.status && filters.status !== "all") {
      userTransactions = userTransactions.filter(
        (tx) => tx.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.limit) {
      userTransactions = userTransactions.slice(0, parseInt(filters.limit));
    }

    return userTransactions;
  }
}

module.exports = {
  Wallet,
  Transaction,
  wallets,
  transactions,
  WalletService,
  TransactionService
};

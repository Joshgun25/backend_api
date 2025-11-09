const express = require("express");
const { WalletController } = require("../controllers/WalletController");
const {
  validate,
  depositSchema,
  withdrawalSchema,
  validateQuery,
  transactionQuerySchema,
} = require("../middlewares/validation");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// Get wallet balances
router.get("/balances", authenticateToken, WalletController.getBalances);

// Get wallet summary
router.get("/summary", authenticateToken, WalletController.getWalletSummary);

// Get balance for specific coin
router.get(
  "/balance/:coin",
  authenticateToken,
  WalletController.getCoinBalance
);

// Get transaction history
router.get(
  "/transactions",
  authenticateToken,
  validateQuery(transactionQuerySchema),
  WalletController.getTransactionHistory
);

// Get transaction details
router.get(
  "/transactions/:transactionId",
  authenticateToken,
  WalletController.getTransactionDetails
);

// Create deposit transaction
router.post(
  "/deposit",
  authenticateToken,
  validate(depositSchema),
  WalletController.createDeposit
);

// Create withdrawal transaction
router.post(
  "/withdraw",
  authenticateToken,
  validate(withdrawalSchema),
  WalletController.createWithdrawal
);

// Update transaction status (admin only)
router.put(
  "/transactions/:transactionId/status",
  authenticateToken,
  WalletController.updateTransactionStatus
);

module.exports = router;

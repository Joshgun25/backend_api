const express = require("express");
const { TradingController } = require("../controllers/TradingController");
const ProductController = require("../controllers/ProductController");

const {
  validate,
  orderSchema,
  validateQuery,
  orderQuerySchema,
  validateTradingPair,
} = require("../middlewares/validation");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// Get order book for a trading pair
router.get(
  "/orderbook/:pair",
  validateTradingPair,
  TradingController.getOrderBook
);

// Get recent trades
router.get(
  "/trades/:pair",
  validateTradingPair,
  TradingController.getRecentTrades
);

// Place a new order
router.post(
  "/orders",
  authenticateToken,
  validate(orderSchema),
  TradingController.placeOrder
);

// Get user's orders
router.get(
  "/orders",
  authenticateToken,
  validateQuery(orderQuerySchema),
  TradingController.getUserOrders
);

// Get order details
router.get(
  "/orders/:orderId",
  authenticateToken,
  TradingController.getOrderDetails
);

// Cancel an order
router.delete(
  "/orders/:orderId",
  authenticateToken,
  TradingController.cancelOrder
);

// Get trading statistics
router.get(
  "/stats/:pair",
  validateTradingPair,
  TradingController.getTradingStats
);

// Get user trading history
router.get(
  "/history",
  authenticateToken,
  TradingController.getUserTradingHistory
);

router.get(
  "/products", 
  authenticateToken, 
  ProductController.getAllProducts
);

module.exports = router;

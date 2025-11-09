const express = require("express");
const { MarketController } = require("../controllers/MarketController");
const {
  validateQuery,
  marketQuerySchema,
  validateTradingPair,
} = require("../middlewares/validation");

const router = express.Router();

// Get all markets
router.get(
  "/",
  validateQuery(marketQuerySchema),
  MarketController.getAllMarkets
);

// Get market statistics
router.get("/stats/overview", MarketController.getMarketStats);

// Get top gainers
router.get("/top-gainers", MarketController.getTopGainers);

// Get top losers
router.get("/top-losers", MarketController.getTopLosers);

// Get markets by volume
router.get("/by-volume", MarketController.getMarketsByVolume);

// Search markets
router.get("/search", MarketController.searchMarkets);

// Get specific market
router.get("/:pair", validateTradingPair, MarketController.getMarket);

// Get market ticker
router.get(
  "/:pair/ticker",
  validateTradingPair,
  MarketController.getMarketTicker
);

// Get price history for a market
router.get(
  "/:pair/history",
  validateTradingPair,
  MarketController.getPriceHistory
);

module.exports = router;

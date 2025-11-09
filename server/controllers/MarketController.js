const { MarketService } = require('../models/Market');

class MarketController {
  // Get all markets
  static async getAllMarkets(req, res) {
    try {
      const { search, sort, filter } = req.query;
      
      let markets = MarketService.getAll();
      
      // Apply search filter
      if (search) {
        markets = MarketService.search(search);
      }
      
      // Apply sorting
      if (sort) {
        markets = MarketService.sortBy(sort);
      }
      
      // Apply additional filters if needed
      if (filter) {
        // Add custom filtering logic here
        // For example: filter by market cap, volume, etc.
      }
      
      res.json({
        success: true,
        data: {
          markets,
          total: markets.length,
          filters: { search, sort, filter }
        }
      });
    } catch (error) {
      console.error('Error fetching markets:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch markets' 
      });
    }
  }

  // Get specific market
  static async getMarket(req, res) {
    try {
      const { pair } = req.params;
      const market = MarketService.findByPair(pair);
      
      if (!market) {
        return res.status(404).json({ 
          success: false,
          error: 'Market not found' 
        });
      }
      
      res.json({
        success: true,
        data: market
      });
    } catch (error) {
      console.error('Error fetching market:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch market data' 
      });
    }
  }

  // Get market statistics
  static async getMarketStats(req, res) {
    try {
      const stats = MarketService.getMarketStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching market stats:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch market statistics' 
      });
    }
  }

  // Get price history
  static async getPriceHistory(req, res) {
    try {
      const { pair } = req.params;
      const { interval = '1h', limit = 100 } = req.query;
      
      const history = MarketService.generatePriceHistory(pair, interval, parseInt(limit));
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to fetch price history' 
      });
    }
  }

  // Get top gainers
  static async getTopGainers(req, res) {
    try {
      const { limit = 10 } = req.query;
      const markets = MarketService.getAll();
      
      const topGainers = markets
        .filter(market => market.change > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, parseInt(limit));
      
      res.json({
        success: true,
        data: topGainers
      });
    } catch (error) {
      console.error('Error fetching top gainers:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch top gainers' 
      });
    }
  }

  // Get top losers
  static async getTopLosers(req, res) {
    try {
      const { limit = 10 } = req.query;
      const markets = MarketService.getAll();
      
      const topLosers = markets
        .filter(market => market.change < 0)
        .sort((a, b) => a.change - b.change)
        .slice(0, parseInt(limit));
      
      res.json({
        success: true,
        data: topLosers
      });
    } catch (error) {
      console.error('Error fetching top losers:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch top losers' 
      });
    }
  }

  // Get market by volume
  static async getMarketsByVolume(req, res) {
    try {
      const { limit = 10 } = req.query;
      const markets = MarketService.sortBy('volume').slice(0, parseInt(limit));
      
      res.json({
        success: true,
        data: markets
      });
    } catch (error) {
      console.error('Error fetching markets by volume:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch markets by volume' 
      });
    }
  }

  // Search markets
  static async searchMarkets(req, res) {
    try {
      const { q: query } = req.query;
      
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ 
          success: false,
          error: 'Search query must be at least 2 characters' 
        });
      }
      
      const results = MarketService.search(query);
      
      res.json({
        success: true,
        data: {
          results,
          query,
          total: results.length
        }
      });
    } catch (error) {
      console.error('Error searching markets:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to search markets' 
      });
    }
  }

  // Get market ticker (24h stats)
  static async getMarketTicker(req, res) {
    try {
      const { pair } = req.params;
      const market = MarketService.findByPair(pair);
      
      if (!market) {
        return res.status(404).json({ 
          success: false,
          error: 'Market not found' 
        });
      }
      
      const ticker = {
        pair: market.pair,
        price: market.price,
        change: market.change,
        changePercent: market.getChangePercentage(),
        high: market.high,
        low: market.low,
        volume: market.volume,
        volumeFormatted: market.getFormattedVolume(),
        lastUpdated: market.lastUpdated
      };
      
      res.json({
        success: true,
        data: ticker
      });
    } catch (error) {
      console.error('Error fetching market ticker:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch market ticker' 
      });
    }
  }
}

module.exports = { MarketController };

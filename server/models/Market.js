// Market model
class Market {
  constructor(data) {
    this.pair = data.pair;
    this.name = data.name;
    this.price = data.price;
    this.change = data.change;
    this.volume = data.volume;
    this.high = data.high;
    this.low = data.low;
    this.marketCap = data.marketCap;
    this.sparkline = data.sparkline || [];
    this.lastUpdated = data.lastUpdated || new Date();
  }

  // Calculate price change percentage
  getChangePercentage() {
    return ((this.change / (this.price - this.change)) * 100).toFixed(2);
  }

  // Get formatted price
  getFormattedPrice() {
    return this.price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  // Get formatted volume
  getFormattedVolume() {
    if (this.volume >= 1000000000) {
      return `$${(this.volume / 1000000000).toFixed(1)}B`;
    } else if (this.volume >= 1000000) {
      return `$${(this.volume / 1000000).toFixed(1)}M`;
    } else if (this.volume >= 1000) {
      return `$${(this.volume / 1000).toFixed(1)}K`;
    }
    return `$${this.volume.toFixed(2)}`;
  }

  // Validate market data
  static validate(data) {
    const errors = [];

    if (!data.pair || !data.pair.includes("/")) {
      errors.push("Valid trading pair is required (e.g., BTC/USDT)");
    }

    if (!data.name || data.name.trim().length < 2) {
      errors.push("Market name is required");
    }

    if (typeof data.price !== "number" || data.price <= 0) {
      errors.push("Valid price is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Market data storage (will be replaced with database)
const markets = [];

// Market service methods
class MarketService {
  static getAll() {
    return markets;
  }

  static findByPair(pair) {
    return markets.find((market) => market.pair === pair.toUpperCase());
  }

  static search(query) {
    const searchTerm = query.toLowerCase();
    return markets.filter(
      (market) =>
        market.pair.toLowerCase().includes(searchTerm) ||
        market.name.toLowerCase().includes(searchTerm)
    );
  }

  static sortBy(sortBy) {
    const sortedMarkets = [...markets];

    switch (sortBy) {
      case "volume":
        return sortedMarkets.sort((a, b) => b.volume - a.volume);
      case "change":
        return sortedMarkets.sort((a, b) => b.change - a.change);
      case "price":
        return sortedMarkets.sort((a, b) => b.price - a.price);
      case "market-cap":
        return sortedMarkets.sort((a, b) => b.marketCap - a.marketCap);
      default:
        return sortedMarkets;
    }
  }

  static getMarketStats() {
    const totalMarketCap = markets.reduce(
      (sum, market) => sum + market.marketCap,
      0
    );
    const totalVolume = markets.reduce((sum, market) => sum + market.volume, 0);
    const btcDominance = (markets[0].marketCap / totalMarketCap) * 100;

    return {
      totalMarketCap,
      totalVolume,
      btcDominance: Math.round(btcDominance * 100) / 100,
      activePairs: markets.length,
      topGainer: markets.reduce((max, market) =>
        market.change > max.change ? market : max
      ),
      topLoser: markets.reduce((min, market) =>
        market.change < min.change ? market : min
      ),
    };
  }

  static generatePriceHistory(pair, interval = "1h", limit = 100) {
    const market = this.findByPair(pair);
    if (!market) {
      throw new Error("Market not found");
    }

    const history = [];
    const now = new Date();
    const basePrice = market.price;

    for (let i = limit; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + variation);

      history.push({
        timestamp: timestamp.toISOString(),
        open: price * 0.999,
        high: price * 1.002,
        low: price * 0.998,
        close: price,
        volume: Math.random() * 1000000,
      });
    }

    return {
      pair: pair.toUpperCase(),
      interval,
      data: history,
    };
  }
}

module.exports = {
  Market,
  markets,
  MarketService
};

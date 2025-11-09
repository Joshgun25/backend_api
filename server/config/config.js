// Server configuration
const config = {
  // Server settings
  PORT: process.env.PORT || 5000,
  FRONTEND_PORT: process.env.FRONTEND_PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",

  // JWT settings
  JWT_SECRET:
    process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",
  JWT_EXPIRES_IN: "24h",

  // CORS settings
  CORS_ORIGINS: [
    `http://localhost:${process.env.FRONTEND_PORT || 8080}`,
    `http://127.0.0.1:${process.env.FRONTEND_PORT || 8080}`,
  ],

  // Rate limiting
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // WebSocket settings
  WS_PATH: "/ws",

  // Database settings (for future use)
  DATABASE: {
    MONGODB_URI:
      process.env.MONGODB_URI || "mongodb://localhost:27017/lumen-exchange",
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  },

  // API Keys (for future use)
  API_KEYS: {
    BINANCE: process.env.BINANCE_API_KEY || "",
    COINMARKETCAP: process.env.COINMARKETCAP_API_KEY || "",
  },
};

module.exports = config;

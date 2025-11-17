const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const config = require("./config/config");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const marketRoutes = require("./routes/markets");
const productRoutes = require("./routes/product");
const walletRoutes = require("./routes/wallet");
const propertyRoutes = require("./routes/properties");

// Load environment variables
dotenv.config();

const app = express();
const PORT = config.PORT;
const FRONTEND_PORT = config.FRONTEND_PORT;

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit(config.RATE_LIMIT);
app.use("/api/", limiter);

// CORS configuration
app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/markets", marketRoutes);
app.use("/api/product", productRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/properties", propertyRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API-only server - no static file serving

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Create HTTP server
const server = createServer(app);

// WebSocket server for real-time data
const wss = new WebSocketServer({
  server,
  path: config.WS_PATH,
});

// WebSocket connection handling
wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection established");

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to Lumen Exchange WebSocket",
      timestamp: new Date().toISOString(),
    })
  );

  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received WebSocket message:", data);

      // Handle different message types
      switch (data.type) {
        case "subscribe":
          // Handle market data subscriptions
          ws.send(
            JSON.stringify({
              type: "subscribed",
              channel: data.channel,
              message: `Subscribed to ${data.channel}`,
            })
          );
          break;
        case "ping":
          ws.send(JSON.stringify({ type: "pong" }));
          break;
        default:
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Unknown message type",
            })
          );
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message format",
        })
      );
    }
  });

  // Handle connection close
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  if (process.env.NODE_ENV === "development") {
    console.log(`\nDevelopment mode enabled`);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = app;

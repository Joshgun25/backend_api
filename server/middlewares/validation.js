const { z } = require("zod");

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const orderSchema = z.object({
  pair: z
    .string()
    .regex(/^[A-Z]{3,10}\/[A-Z]{3,10}$/, "Invalid trading pair format"),
  side: z.enum(["buy", "sell"], {
    errorMap: () => ({ message: "Side must be buy or sell" }),
  }),
  type: z.enum(["market", "limit"], {
    errorMap: () => ({ message: "Type must be market or limit" }),
  }),
  amount: z.number().positive("Amount must be positive"),
  price: z.number().positive("Price must be positive").optional(),
});

const depositSchema = z.object({
  coin: z.string().min(2, "Coin symbol is required"),
  amount: z.number().positive("Amount must be positive"),
  network: z.string().min(1, "Network is required"),
  txHash: z.string().optional(),
});

const withdrawalSchema = z.object({
  coin: z.string().min(2, "Coin symbol is required"),
  amount: z.number().positive("Amount must be positive"),
  address: z.string().min(10, "Valid address is required"),
  network: z.string().min(1, "Network is required"),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  price: z.number().positive("Price must be a positive number"),
  status: z.enum(["available", "sold", "pending", "rented"], {
    errorMap: () => ({ message: "Status must be one of: available, sold, pending, rented" }),
  }).optional(),
});

const updatePropertySchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character").optional(),
  description: z.string().optional(),
  address: z.string().min(1, "Address must be at least 1 character").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  status: z.enum(["available", "sold", "pending", "rented"], {
    errorMap: () => ({ message: "Status must be one of: available, sold, pending, rented" }),
  }).optional(),
});

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      let zodError = null;
      
      if (error instanceof z.ZodError) {
        zodError = error;
      } else if (error && error.constructor && error.constructor.name === 'ZodError') {
        zodError = error;
      } else if (error && error.name === 'ZodError') {
        zodError = error;
      }
      
      if (zodError && zodError.errors && Array.isArray(zodError.errors)) {
        const errors = zodError.errors.map((err) => ({
          field: err.path && err.path.length > 0 ? err.path.join(".") : "unknown",
          message: err.message || "Validation error",
        }));

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors,
        });
      }
      
      if (error.message && typeof error.message === 'string' && error.message.includes('"expected"')) {
        try {
          const parsedErrors = JSON.parse(error.message);
          if (Array.isArray(parsedErrors)) {
            const errors = parsedErrors.map((err) => ({
              field: err.path && Array.isArray(err.path) && err.path.length > 0 ? err.path.join(".") : "unknown",
              message: err.message || "Validation error",
            }));

            return res.status(400).json({
              success: false,
              error: "Validation failed",
              details: errors,
            });
          }
        } catch (parseError) {
          // Continue to default error handling
        }
      }

      res.status(400).json({
        success: false,
        error: "Validation failed",
        message: error.message || "Invalid request data",
      });
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      if (!req.query) {
        req.query = {};
      }
      
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery;
      next();
    } catch (error) {
      if (error instanceof z.ZodError && error.errors && Array.isArray(error.errors)) {
        const errors = error.errors.map((err) => ({
          field: err.path ? err.path.join(".") : "unknown",
          message: err.message || "Validation error",
        }));

        return res.status(400).json({
          success: false,
          error: "Query validation failed",
          details: errors,
        });
      }

      res.status(500).json({
        success: false,
        error: "Query validation error",
        message: error.message || "Unknown validation error",
      });
    }
  };
};

// Common query schemas
const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

const marketQuerySchema = z.object({
  search: z.string().optional(),
  sort: z.enum(["volume", "change", "price", "market-cap"]).optional(),
  filter: z.string().optional(),
});

const orderQuerySchema = z.object({
  status: z.enum(["open", "filled", "cancelled", "partial"]).optional(),
  pair: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

const transactionQuerySchema = z.object({
  type: z.enum(["deposit", "withdraw", "trade", "transfer", "all"]).optional(),
  status: z
    .enum(["pending", "completed", "failed", "cancelled", "all"])
    .optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

const propertyQuerySchema = z.object({
  status: z.enum(["available", "sold", "pending", "rented"]).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
}).passthrough();

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any potentially dangerous characters
  const sanitizeString = (str) => {
    if (typeof str !== "string") return str;
    return str.trim().replace(/[<>]/g, "");
  };

  const sanitizeObject = (obj) => {
    if (typeof obj !== "object" || obj === null) return obj;

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === "object") {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};

// Custom validation for trading pairs
const validateTradingPair = (req, res, next) => {
  const { pair } = req.params;

  if (!pair || !pair.includes("/")) {
    return res.status(400).json({
      success: false,
      error: "Invalid trading pair format. Expected format: BTC/USDT",
    });
  }

  const [base, quote] = pair.split("/");
  if (base.length < 2 || quote.length < 2) {
    return res.status(400).json({
      success: false,
      error: "Trading pair symbols must be at least 2 characters",
    });
  }

  next();
};

// Custom validation for amounts
const validateAmount = (req, res, next) => {
  const { amount } = req.body;

  if (amount !== undefined) {
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number",
      });
    }

    if (numAmount > 1000000) {
      return res.status(400).json({
        success: false,
        error: "Amount exceeds maximum limit",
      });
    }

    req.body.amount = numAmount;
  }

  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  orderSchema,
  depositSchema,
  withdrawalSchema,
  updateProfileSchema,
  changePasswordSchema,
  propertySchema,
  updatePropertySchema,
  validate,
  validateQuery,
  paginationSchema,
  marketQuerySchema,
  orderQuerySchema,
  transactionQuerySchema,
  propertyQuerySchema,
  sanitizeInput,
  validateTradingPair,
  validateAmount
};

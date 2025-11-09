const express = require("express");
const { AuthController } = require("../controllers/AuthController");
const {
  validate,
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require("../middlewares/validation");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// Register endpoint
router.post("/register", validate(registerSchema), AuthController.register);

// Login endpoint
router.post("/login", validate(loginSchema), AuthController.login);

// Verify token endpoint
router.get("/verify", AuthController.verifyToken);

// Logout endpoint
router.post("/logout", AuthController.logout);

// Refresh token endpoint
router.post("/refresh", AuthController.refreshToken);

// Change password endpoint
router.post(
  "/change-password",
  authenticateToken,
  validate(changePasswordSchema),
  AuthController.changePassword
);

module.exports = router;

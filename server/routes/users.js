const express = require("express");
const { UserController } = require("../controllers/UserController");
const { validate, updateProfileSchema } = require("../middlewares/validation");
const { authenticateToken, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, UserController.getProfile);

// Update user profile
router.put(
  "/profile",
  authenticateToken,
  validate(updateProfileSchema),
  UserController.updateProfile
);

// Get user statistics
router.get("/stats", authenticateToken, UserController.getUserStats);

// Update user preferences
router.put("/preferences", authenticateToken, UserController.updatePreferences);

// Get user activity log
router.get("/activity", authenticateToken, UserController.getActivityLog);

// Delete user account
router.delete("/account", authenticateToken, UserController.deleteAccount);

// Admin routes
// Get all users (admin only)
router.get("/", authenticateToken, requireAdmin, UserController.getAllUsers);

// Update user status (admin only)
router.put(
  "/:userId/status",
  authenticateToken,
  requireAdmin,
  UserController.updateUserStatus
);

module.exports = router;

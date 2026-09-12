const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protect } = require("../middlewares/auth.middleware");

const {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  deleteAccount,
} = require("../controllers/auth.controller");

// Public routes
// Use upload.array for multiple files with field name "documents"
router.post("/register", upload.array("documents", 5), register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

// Protected routes
router.delete("/me", protect, deleteAccount);
router.post("/logout", protect, logout);

module.exports = router;
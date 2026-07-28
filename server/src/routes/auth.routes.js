const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  register,
  login,
  googleLogin,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post(
    "/refresh-token",
    refreshToken
);

router.post("/login", login);
router.post(
  "/google",
  googleLogin
);
router.post(
  "/forgot-password",
  forgotPassword
);
router.post(
    "/reset-password/:token",
    resetPassword
);
router.post(
    "/resend-verification",
    resendVerification
);

router.post("/logout", protect, logout);
router.get(
  "/verify-email/:token",
  verifyEmail
);

module.exports = router;
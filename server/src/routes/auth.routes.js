const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post(
    "/refresh-token",
    refreshToken
);

router.post("/login", login);
router.post(
  "/forgot-password",
  forgotPassword
);
router.post(
    "/reset-password/:token",
    resetPassword
);

router.post("/logout", protect, logout);

module.exports = router;
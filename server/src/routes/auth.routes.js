const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  register,
  login,
<<<<<<< HEAD
  googleLogin,
=======
>>>>>>> 34dd02696b0e174e8eaa84a08828d961448fe46e
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
<<<<<<< HEAD
  "/google",
  googleLogin
);
router.post(
=======
>>>>>>> 34dd02696b0e174e8eaa84a08828d961448fe46e
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
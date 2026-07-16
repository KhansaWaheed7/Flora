const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/user.controller");

router.use(protect);

router.get("/me", getMe);

router.put("/profile", updateProfile);

router.put("/password", changePassword);

router.delete("/account", deleteAccount);

module.exports = router;
const express = require("express");

const router = express.Router();

const {
  getCurrentUser,
} = require("../controllers/user.controller");

const {
  protect,
} = require("../middlewares/auth.middleware");

router.get("/me", protect, getCurrentUser);

module.exports = router;
const express = require("express");

const router = express.Router();
const ROLES = require("../constants/roles");

const { protect } = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

router.get(
  "/dashboard",
  protect,
  authorize(ROLES.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

module.exports = router;
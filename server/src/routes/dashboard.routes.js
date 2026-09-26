const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const ROLES = require("../constants/roles");
const { getDashboardSummary } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get(
  "/summary",
  protect,
  authorize(ROLES.USER),
  getDashboardSummary
);

module.exports = router;

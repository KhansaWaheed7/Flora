const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  getReminders,
  completeReminder,
} = require("../controllers/pregnancyReminder.controller");

router.get(
  "/",
  protect,
  getReminders
);

router.patch(
  "/:id/complete",
  protect,
  completeReminder
);

module.exports = router;
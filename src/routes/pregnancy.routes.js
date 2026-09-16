const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");



const {
  createPregnancy,
  getPregnancy,
  getPregnancyDashboard,
  updatePregnancy,
  endPregnancy,
} = require("../controllers/pregnancy.controller");

const {
  createPregnancyValidator,
  updatePregnancyValidator,
} = require("../validators/pregnancy.validator");
const {
  getReminders,
  completeReminder,
  getUpcomingReminder,
} = require("../controllers/pregnancyReminder.controller");

// Create pregnancy
router.post(
  "/",
  protect,
  createPregnancyValidator,
  createPregnancy
);

// Get pregnancy
router.get(
  "/",
  protect,
  getPregnancy
);

// Dashboard
router.get(
  "/dashboard",
  protect,
  getPregnancyDashboard
);

router.get(
  "/reminders",
  protect,
  getReminders
);

router.patch(
  "/reminders/:id",
  protect,
  completeReminder
);

router.get(
  "/upcoming",
  protect,
  getUpcomingReminder
); 

// Update pregnancy
router.put(
  "/",
  protect,
  updatePregnancyValidator,
  updatePregnancy
);

// End pregnancy
router.delete(
  "/",
  protect,
  endPregnancy
);


module.exports = router;
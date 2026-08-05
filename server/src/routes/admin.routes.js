const express = require("express");

const router = express.Router();

const ROLES = require("../constants/roles");

const { protect } = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
  getPendingDoctors,
  getDoctors,
  approveDoctor,
  rejectDoctor,
} = require("../controllers/admin.controller");

// =========================================
// Dashboard
// =========================================

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

// =========================================
// Doctors
// =========================================

router.get(
  "/doctors",
  protect,
  authorize(ROLES.ADMIN),
  getDoctors
);

router.get(
  "/doctors/pending",
  protect,
  authorize(ROLES.ADMIN),
  getPendingDoctors
);

router.put(
  "/doctors/:id/approve",
  protect,
  authorize(ROLES.ADMIN),
  approveDoctor
);

router.put(
  "/doctors/:id/reject",
  protect,
  authorize(ROLES.ADMIN),
  rejectDoctor
);

module.exports = router;
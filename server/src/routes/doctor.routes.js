const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const ROLES = require("../constants/roles");

const {
  getDashboard,
  getPendingRequests,
  getAssignedPatients,
  acceptConsultation,
  rejectConsultation,
} = require("../controllers/doctor.controller");

// =========================================
// Dashboard
// =========================================

router.get(
  "/dashboard",
  protect,
  authorize(ROLES.DOCTOR),
  getDashboard
);

// =========================================
// Pending Consultation Requests
// =========================================

router.get(
  "/requests",
  protect,
  authorize(ROLES.DOCTOR),
  getPendingRequests
);

// =========================================
// Assigned Patients
// =========================================

router.get(
  "/patients",
  protect,
  authorize(ROLES.DOCTOR),
  getAssignedPatients
);
// =========================================
// Accept Consultation
// =========================================

router.put(
  "/chat/:id/accept",
  protect,
  authorize(ROLES.DOCTOR),
  acceptConsultation
);

// =========================================
// Reject Consultation
// =========================================

router.put(
  "/chat/:id/reject",
  protect,
  authorize(ROLES.DOCTOR),
  rejectConsultation
);

module.exports = router;
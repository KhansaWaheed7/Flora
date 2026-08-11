const express = require("express");

const router = express.Router();

const ROLES = require("../constants/roles");

const { protect } = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
  getDashboardStats,
  getPendingDoctors,
  getDoctors,
  approveDoctor,
  rejectDoctor,
  updateDoctorStatus,
  getPatients,
  updatePatientStatus,
  getAuditLogs
  
} = require("../controllers/admin.controller");

// =========================================
// Dashboard
// =========================================

router.get(
  "/dashboard",
  protect,
  authorize(ROLES.ADMIN),
  getDashboardStats
);


router.get(
  "/patients",
  protect,
  authorize(ROLES.ADMIN),
  getPatients
);

router.patch(
  "/patients/:patientId/status",
  protect,
  authorize(ROLES.ADMIN),
  updatePatientStatus
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

router.patch(
  "/doctors/:id/status",
  protect,
  authorize(ROLES.ADMIN),
  updateDoctorStatus
);
router.get(
  "/audit-logs",
  protect,
  authorize(ROLES.ADMIN),
  getAuditLogs
);

module.exports = router;
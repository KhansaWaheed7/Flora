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

const {
  getPendingDoctors: getPendingVerifications,
  getDoctorVerificationDetails,
  approveDoctor: approveVerification,
  rejectDoctor: rejectVerification,
} = require("../controllers/adminVerification.controller");

// =========================================
// Dashboard
// =========================================

router.get(
  "/dashboard",
  protect,
  authorize(ROLES.ADMIN),
  getDashboardStats
);

// =========================================
// Patients
// =========================================

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
// Doctors - Management
// =========================================

router.get(
  "/doctors",
  protect,
  authorize(ROLES.ADMIN),
  getDoctors
);

router.patch(
  "/doctors/:id/status",
  protect,
  authorize(ROLES.ADMIN),
  updateDoctorStatus
);

// =========================================
// Doctors - Verification (using adminVerification)
// =========================================

// Get pending doctors for verification
router.get(
  "/doctors/pending",
  protect,
  authorize(ROLES.ADMIN),
  getPendingVerifications
);

// Get doctor verification details
router.get(
  "/doctors/:doctorId/verification",
  protect,
  authorize(ROLES.ADMIN),
  getDoctorVerificationDetails
);

// Approve doctor
router.patch(
  "/doctors/:doctorId/approve",
  protect,
  authorize(ROLES.ADMIN),
  approveVerification
);

// Reject doctor
router.patch(
  "/doctors/:doctorId/reject",
  protect,
  authorize(ROLES.ADMIN),
  rejectVerification
);

// =========================================
// Audit Logs
// =========================================

router.get(
  "/audit-logs",
  protect,
  authorize(ROLES.ADMIN),
  getAuditLogs
);

module.exports = router;
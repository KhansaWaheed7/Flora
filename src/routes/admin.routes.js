const express = require("express");
const router = express.Router();
const ROLES = require("../constants/roles");
const { protect } = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");

const {
  getDashboardStats,
  getDoctors,
  updateDoctorStatus,
  getPatients,
  updatePatientStatus,
  getAuditLogs
} = require("../controllers/admin.controller");

const {
  getPendingDoctors,
  getDoctorVerificationDetails,
  approveDoctor,
  rejectDoctor,
  suspendDoctor, 
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

// IMPORTANT: Put specific routes before generic ones
// Get pending doctors for verification
router.get(
  "/doctors/pending",
  protect,
  authorize(ROLES.ADMIN),
  getPendingDoctors
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
  approveDoctor
);

// Reject doctor
router.patch(
  "/doctors/:doctorId/reject",
  protect,
  authorize(ROLES.ADMIN),
  rejectDoctor
);

// Suspend doctor
router.patch(
  "/doctors/:doctorId/suspend",
  protect,
  authorize(ROLES.ADMIN),
  suspendDoctor
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
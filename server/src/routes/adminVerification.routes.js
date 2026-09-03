const express = require("express");

const router = express.Router();

const {
  protect,
  authorize,
} = require("../middlewares/auth.middleware");

const {
  getPendingDoctors,
  getDoctorVerificationDetails,
  approveDoctor,
  rejectDoctor,
  deleteDoctorDocument,
} = require("../controllers/adminVerification.controller");

// =========================================
// Admin Verification Routes
// =========================================

// Pending doctors
router.get(
  "/pending",
  protect,
  authorize("admin"),
  getPendingDoctors
);

// Doctor details
router.get(
  "/doctors/:doctorId",
  protect,
  authorize("admin"),
  getDoctorVerificationDetails
);

// Approve doctor
router.patch(
  "/doctors/:doctorId/approve",
  protect,
  authorize("admin"),
  approveDoctor
);

// Reject doctor
router.patch(
  "/doctors/:doctorId/reject",
  protect,
  authorize("admin"),
  rejectDoctor
);

// Delete verification document
router.delete(
  "/doctors/:doctorId/documents/:documentId",
  protect,
  authorize("admin"),
  deleteDoctorDocument
);

module.exports = router;
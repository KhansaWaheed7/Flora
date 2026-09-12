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
  closeConsultation,
  getClosedConsultations,
  getDoctorProfile,
  updateDoctorProfile,
  uploadDoctorAvatar,
  removeDoctorAvatar,
} = require("../controllers/doctor.controller");

const {
  handleAvatarUpload,
} = require("../middlewares/upload.middleware");

// =========================================
// Doctor Profile
// =========================================

router.get(
  "/profile",
  protect,
  authorize(ROLES.DOCTOR),
  getDoctorProfile
);

router.patch(
  "/profile",
  protect,
  authorize(ROLES.DOCTOR),
  updateDoctorProfile
);

// =========================================
// Doctor Profile Picture
// =========================================

router.post(
  "/profile/avatar",
  protect,
  authorize(ROLES.DOCTOR),
  handleAvatarUpload,
  uploadDoctorAvatar
);

router.delete(
  "/profile/avatar",
  protect,
  authorize(ROLES.DOCTOR),
  removeDoctorAvatar
);

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
// Closed Consultations
// =========================================

router.get(
  "/closed",
  protect,
  authorize(ROLES.DOCTOR),
  getClosedConsultations
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

router.put(
  "/chat/:id/close",
  protect,
  authorize(ROLES.DOCTOR),
  closeConsultation
);
module.exports = router;
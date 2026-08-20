// server/src/routes/medicalReport.routes.js
const express = require("express");
const MedicalReportController = require("../controllers/medicalReportController");
const medicalReportUpload = require("../middlewares/medicalReportUpload.middleware");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Upload report
router.post(
  "/upload",
  medicalReportUpload.single("file"),
  MedicalReportController.uploadReport
);

// Get all user reports
router.get("/", MedicalReportController.getUserReports);

// Get report by ID
router.get("/:id", MedicalReportController.getReportById);

// Get report summary
router.get("/:id/summary", MedicalReportController.getReportSummary);

// Get processing status
router.get("/:id/status", MedicalReportController.getProcessingStatus);

// Download report
router.get("/:id/download", MedicalReportController.downloadReport);

// Delete report
router.delete("/:id", MedicalReportController.deleteReport);

module.exports = router;
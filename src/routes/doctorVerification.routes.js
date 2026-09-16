const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  uploadDoctorDocument,
  getDoctorVerification,
} = require("../controllers/doctorVerification.controller");

router.get(
  "/",
  protect,
  authorize("doctor"),
  getDoctorVerification
);

// Use upload.single for single file upload with field name "document"
router.post(
  "/documents",
  protect,
  authorize("doctor"),
  upload.single("document"),
  uploadDoctorDocument
);

module.exports = router;
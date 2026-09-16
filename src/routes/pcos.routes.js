const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  createAssessment,
  getLatestAssessment,
  getAssessmentHistory,
  getDashboard,
  deleteAssessment,
} = require("../controllers/pcos.controller");

const {
  createPCOSAssessmentValidator,
} = require("../validators/pcos.validator");

router.post(
  "/",
  protect,
  createPCOSAssessmentValidator,
  createAssessment
);

router.get(
  "/",
  protect,
  getLatestAssessment
);

router.get(
  "/history",
  protect,
  getAssessmentHistory
);

router.get(
  "/dashboard",
  protect,
  getDashboard
);

router.delete(
  "/:id",
  protect,
  deleteAssessment
);

module.exports = router;
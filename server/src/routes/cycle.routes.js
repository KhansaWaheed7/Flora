const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  createCycle,
  getCycles,
  getCycle,
  updateCycle,
  deleteCycle,
  predictCycle,
  dashboard,
} = require("../controllers/cycle.controller");

router.use(protect);

router.post("/", createCycle);

router.get("/", getCycles);

router.get("/prediction", predictCycle);
router.get("/dashboard", dashboard);

router.get("/:id", getCycle);

router.put("/:id", updateCycle);

router.delete("/:id", deleteCycle);


module.exports = router;
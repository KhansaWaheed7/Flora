const express = require("express");

const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const cycleRoutes = require("./cycle.routes");
const adminRoutes = require("./admin.routes");


router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/cycles", cycleRoutes);
router.use("/admin", adminRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    server: "Flora API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

module.exports = router;
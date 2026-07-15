const express = require("express");

const router = express.Router();

// Health Check Route
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
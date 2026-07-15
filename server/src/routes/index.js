const express = require("express");

const router = express.Router();

const userRoutes = require("./user.routes");


const authRoutes = require("./auth.routes");

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.get("/health", (req, res) => {
  res.json({
    success: true,
    server: "Flora API",
  });
});

module.exports = router;
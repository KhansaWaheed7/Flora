const express = require("express");

const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const cycleRoutes = require("./cycle.routes");
const adminRoutes = require("./admin.routes");
const profileRoutes = require("./profile.routes");
const pregnancyRoutes = require("./pregnancy.routes");
const pcosRoutes = require("./pcos.routes");
const pregnancyReminderRoutes = require("./pregnancyReminder.routes");
const chatRoutes = require("./chat.routes");
const doctorRoutes = require("./doctor.routes");
const messageRoutes = require("./message.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cycles", cycleRoutes);
router.use("/admin", adminRoutes);
router.use("/profile", profileRoutes);
router.use("/pregnancy", pregnancyRoutes);
router.use(
  "/pregnancy/reminders",
  pregnancyReminderRoutes
);
router.use("/pcos", pcosRoutes);
router.use("/chat", chatRoutes);
router.use("/doctor", doctorRoutes);
router.use("/messages", messageRoutes);


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
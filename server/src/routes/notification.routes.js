const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const controller = require("../controllers/notification.controller");

const router = express.Router();

router.use(protect);

router.get("/", controller.getNotifications);
router.get("/unread-count", controller.getUnreadCount);
router.patch("/:id/read", controller.markRead);
router.patch("/read-all", controller.markAllRead);
router.delete("/:id", controller.deleteNotification);

module.exports = router;

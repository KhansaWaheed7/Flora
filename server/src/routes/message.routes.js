const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  sendMessage,
  getMessages,
} = require("../controllers/message.controller");

// =========================================
// Get Messages
// =========================================

router.get(
  "/:chatId",
  protect,
  getMessages
);

// =========================================
// Send Message
// =========================================

router.post(
  "/:chatId",
  protect,
  sendMessage
);

module.exports = router;
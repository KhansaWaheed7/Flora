const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const chatAttachmentUpload = require("../middlewares/chatAttachmentUpload.middleware");

const {
  sendMessage,
  getMessages,
  getMessageAttachment,
  markMessagesAsRead,
} = require("../controllers/message.controller");

// =========================================
// Get Message Attachment
// =========================================

router.get(
  "/:chatId/:messageId/attachment",
  protect,
  getMessageAttachment
);

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
  chatAttachmentUpload.single("file"),
  sendMessage
);

// =========================================
// Mark Messages as Read
// =========================================

router.patch(
  "/:chatId/read",
  protect,
  markMessagesAsRead
);

module.exports = router;
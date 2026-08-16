const express = require("express");

const {
  createConversation,
  sendMessage,
  getConversationHistory,
  getConversation,
} = require("../controllers/gynaeAssistant.controller");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", createConversation);

router.post("/message", sendMessage);

router.get("/history", getConversationHistory);

router.get("/:id", getConversation);

module.exports = router;
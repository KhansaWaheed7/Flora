const express = require("express");

const {
  sendMessage,
  getConversationHistory,
  getConversation,
  deleteConversation,
} = require("../controllers/gynaeAssistant.controller");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);


router.post("/message", sendMessage);

router.get("/history", getConversationHistory);

router.get("/:id", getConversation);
router.delete("/conversations/:id", deleteConversation);
module.exports = router;

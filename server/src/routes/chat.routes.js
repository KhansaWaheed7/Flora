const express = require("express");

const router = express.Router();

const { protect, } = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const ROLES = require("../constants/roles");

const {
  createChat,
  getAvailableDoctors,
  getMyRequests,
  getConversations,
} = require("../controllers/chat.controller");

router.get(
  "/doctors",
  protect,
  authorize(ROLES.USER),
  getAvailableDoctors
);

router.get(
  "/conversations",
  protect,
  getConversations
);

router.post(
  "/request",
  protect,
  authorize(ROLES.USER),
  createChat
);
router.get(
  "/my-requests",
  protect,
  authorize(ROLES.USER),
  getMyRequests
);
module.exports = router;
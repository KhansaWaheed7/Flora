const express = require("express");

const router = express.Router();
const upload=require("../middlewares/upload.middleware");

const { protect } = require("../middlewares/auth.middleware");

const {
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadAvatar,
} = require("../controllers/user.controller");

router.use(protect);

router.get("/me", getMe);

router.put("/profile", updateProfile);

router.put("/password", changePassword);

router.delete("/account", deleteAccount);

router.post(

"/avatar",

upload.single("avatar"),

uploadAvatar

);

module.exports = router;
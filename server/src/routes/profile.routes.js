const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload.middleware");

const { protect } = require("../middlewares/auth.middleware");

const {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
} = require("../controllers/profile.controller");

const {
  updateProfileValidation,
} = require("../validators/profile.validator");

router.get(
  "/",
  protect,
  getProfile
);

router.put(
  "/",
  protect,
  updateProfileValidation,
  updateProfile
);

router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  
  uploadAvatar
);

router.delete(
  "/avatar",
  protect,
  removeAvatar
);

module.exports = router;
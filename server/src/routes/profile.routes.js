const express = require("express");

const router = express.Router();
<<<<<<< HEAD

=======
>>>>>>> 34dd02696b0e174e8eaa84a08828d961448fe46e
const upload = require("../middlewares/upload.middleware");

const { protect } = require("../middlewares/auth.middleware");

const {
  getProfile,
  updateProfile,
  uploadAvatar,
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

module.exports = router;
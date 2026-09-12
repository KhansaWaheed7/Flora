const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const profileService = require("../services/profile.service");

exports.getProfile = asyncHandler(async (req, res) => {

  const data = await profileService.getProfile(req.user._id);

  res.json(
    new ApiResponse(
      200,
      "Profile fetched successfully",
      data
    )
  );
});

exports.updateProfile = asyncHandler(async (req, res) => {

  const profile = await profileService.updateProfile(
    req.user._id,
    req.body
  );

  res.json(
    new ApiResponse(
      200,
      "Profile updated successfully",
      profile
    )
  );
});

exports.uploadAvatar = asyncHandler(async (req, res) => {
  const avatar = await profileService.uploadAvatar(
    req.user._id,
    req.file
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Avatar uploaded successfully",
      avatar
    )
  );
});

exports.removeAvatar = asyncHandler(async (req, res) => {
  const avatar = await profileService.removeAvatar(req.user._id);

  res.json(
    new ApiResponse(
      200,
      "Profile picture removed successfully",
      avatar
    )
  );
});
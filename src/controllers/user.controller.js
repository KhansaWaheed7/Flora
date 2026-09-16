const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
  updateProfile,
  changePassword,
  deleteAccount,
  updateAvatar,
} = require("../services/user.service");

const {
  updateProfileSchema,
  changePasswordSchema,
} = require("../validators/user.validator");

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "User profile fetched successfully", {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      age: req.user.age,
      role: req.user.role,
    })
  );
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const data = updateProfileSchema.parse(req.body);

  const user = await updateProfile(req.user._id, data);

  res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", user)
  );
});

exports.changePassword = asyncHandler(async (req, res) => {
  const data = changePasswordSchema.parse(req.body);

  await changePassword(
    req.user._id,
    data.currentPassword,
    data.newPassword
  );

  res.status(200).json(
    new ApiResponse(200, "Password updated successfully")
  );
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  await deleteAccount(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Account deleted successfully")
  );
});
exports.uploadAvatar=asyncHandler(async(req,res)=>{

    if(!req.file){

        throw new ApiError(400,"Please upload an image");

    }

    const user=await updateAvatar(

        req.user._id,

        req.file.path

    );

    res.status(200).json(

        new ApiResponse(

            200,

            "Profile picture updated",

            user

        )

    );

});
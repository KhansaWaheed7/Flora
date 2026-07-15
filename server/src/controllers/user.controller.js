const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "User profile fetched successfully", {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      age: req.user.age,
      role: req.user.role,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
    })
  );
});
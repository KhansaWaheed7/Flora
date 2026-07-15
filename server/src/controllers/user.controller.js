const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

exports.getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      "Current user",
      req.user
    )
  );
});
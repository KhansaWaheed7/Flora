const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { getDashboardSummary } = require("../services/dashboard.service");

exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await getDashboardSummary(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, "Dashboard summary fetched successfully", summary)
  );
});

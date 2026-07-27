const asyncHandler = require("../utils/asyncHandler");

const ApiResponse = require("../utils/ApiResponse");

const pregnancyService = require("../services/pregnancy.service");


// Create Pregnancy

exports.createPregnancy = asyncHandler(async (req, res) => {
  const { lastPeriodDate } = req.body;

  const pregnancy = await pregnancyService.createPregnancy(
    req.user._id,
    lastPeriodDate
  );

  return res.status(201).json(
    new ApiResponse(
  201,
  "Pregnancy profile created successfully",
  {
    pregnancy,
  }
)
  );
});


// Get Pregnancy

exports.getPregnancy = asyncHandler(async (req, res) => {
  const pregnancy = await pregnancyService.getPregnancy(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pregnancy,
      },
      "Pregnancy fetched successfully"
    )
  );
});


// Pregnancy Dashboard

exports.getPregnancyDashboard = asyncHandler(async (req, res) => {
  const dashboard =
    await pregnancyService.getPregnancyDashboard(
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      dashboard,
      "Pregnancy dashboard fetched successfully"
    )
  );
});


// Update Pregnancy

exports.updatePregnancy = asyncHandler(async (req, res) => {
  const { lastPeriodDate } = req.body;

  const pregnancy =
    await pregnancyService.updatePregnancy(
      req.user._id,
      lastPeriodDate
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pregnancy,
      },
      "Pregnancy updated successfully"
    )
  );
});


// End Pregnancy

exports.endPregnancy = asyncHandler(async (req, res) => {
  const pregnancy =
    await pregnancyService.endPregnancy(req.user._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        pregnancy,
      },
      "Pregnancy ended successfully"
    )
  );
});
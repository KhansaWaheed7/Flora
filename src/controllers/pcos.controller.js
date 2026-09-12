const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const pcosService = require("../services/pcos.service");


// Create Assessment

exports.createAssessment = asyncHandler(async (req, res) => {

  const assessment =
    await pcosService.createAssessment(
      req.user._id,
      req.body
    );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        assessment,
      },
      "PCOS assessment completed successfully"
    )
  );

});


// Latest Assessment

exports.getLatestAssessment = asyncHandler(async (req, res) => {

  const assessment =
    await pcosService.getLatestAssessment(
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        assessment,
      },
      "Latest assessment fetched successfully"
    )
  );

});


// Assessment History

exports.getAssessmentHistory = asyncHandler(async (req, res) => {

  const history =
    await pcosService.getAssessmentHistory(
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        history,
      },
      "Assessment history fetched successfully"
    )
  );

});


// Dashboard

exports.getDashboard = asyncHandler(async (req, res) => {

  const dashboard =
    await pcosService.getDashboard(
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      dashboard,
      "Dashboard fetched successfully"
    )
  );

});


// Delete Assessment

exports.deleteAssessment = asyncHandler(async (req, res) => {

  await pcosService.deleteAssessment(
    req.user._id,
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Assessment deleted successfully"
    )
  );

});
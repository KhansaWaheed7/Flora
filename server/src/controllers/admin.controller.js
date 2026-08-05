const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
  getPendingDoctors,
  getDoctors,
  approveDoctor,
  rejectDoctor,
} = require("../services/admin.service");

// =========================================
// Get Pending Doctors
// =========================================

exports.getPendingDoctors = asyncHandler(async (req, res) => {

  const doctors = await getPendingDoctors();

  res.status(200).json(
    new ApiResponse(
      200,
      "Pending doctors fetched successfully.",
      doctors
    )
  );

});

// =========================================
// Get All Doctors
// =========================================

exports.getDoctors = asyncHandler(async (req, res) => {

  const doctors = await getDoctors();

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctors fetched successfully.",
      doctors
    )
  );

});

// =========================================
// Approve Doctor
// =========================================

exports.approveDoctor = asyncHandler(async (req, res) => {

  const doctor = await approveDoctor(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctor approved successfully.",
      doctor
    )
  );

});

// =========================================
// Reject Doctor
// =========================================

exports.rejectDoctor = asyncHandler(async (req, res) => {

  const doctor = await rejectDoctor(req.params.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctor rejected successfully.",
      doctor
    )
  );

});
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const {
  getPendingDoctors,
  getDoctorVerificationDetails,
  approveDoctor,
  rejectDoctor,
  deleteDoctorDocument,
} = require("../services/adminVerification.service");

// =========================================
// Get Pending Doctors
// =========================================

exports.getPendingDoctors = asyncHandler(
  async (req, res) => {
    const doctors = await getPendingDoctors();

    res.status(200).json(
      new ApiResponse(
        200,
        "Pending doctors fetched successfully.",
        {
          doctors,
        }
      )
    );
  }
);

// =========================================
// Get Doctor Details
// =========================================

exports.getDoctorVerificationDetails =
  asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    const doctor =
      await getDoctorVerificationDetails(
        doctorId
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Doctor verification details fetched successfully.",
        {
          doctor,
        }
      )
    );
  });

// =========================================
// Approve Doctor
// =========================================

exports.approveDoctor = asyncHandler(
  async (req, res) => {
    const { doctorId } = req.params;

    const doctor = await approveDoctor(
      doctorId,
      req.user._id
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Doctor verified successfully.",
        {
          doctor,
        }
      )
    );
  }
);

// =========================================
// Reject Doctor
// =========================================

exports.rejectDoctor = asyncHandler(
  async (req, res) => {
    const { doctorId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason?.trim()) {
      throw new ApiError(
        400,
        "Rejection reason is required."
      );
    }

    const doctor = await rejectDoctor(
      doctorId,
      req.user._id,
      rejectionReason
    );

    res.status(200).json(
      new ApiResponse(
        200,
        "Doctor verification rejected.",
        {
          doctor,
        }
      )
    );
  }
);

// =========================================
// Delete Document
// =========================================

exports.deleteDoctorDocument =
  asyncHandler(async (req, res) => {
    const { doctorId, documentId } =
      req.params;

    const result =
      await deleteDoctorDocument(
        doctorId,
        documentId
      );

    res.status(200).json(
      new ApiResponse(
        200,
        result.message,
        result
      )
    );
  });
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const {
  uploadDocument,
} = require("../services/doctorVerification.service");


exports.uploadDoctorDocument = asyncHandler(
  async (req, res) => {
    const { documentType } = req.body;

    if (!documentType) {
      throw new ApiError(
        400,
        "Document type is required."
      );
    }

    // Check if file exists
    if (!req.file) {
      throw new ApiError(
        400,
        "No file uploaded. Please select a document to upload."
      );
    }

    const document =
      await uploadDocument(
        req.user._id,
        req.file,
        documentType
      );

    res.status(201).json(
      new ApiResponse(
        201,
        "Verification document uploaded successfully.",
        {
          document,
        }
      )
    );
  }
);

exports.getDoctorVerification = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user._id).select(
      "fullName email specialization hospital yearsOfExperience doctorVerification"
    );

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        "Doctor verification information retrieved successfully.",
        user
      )
    );
  }
);
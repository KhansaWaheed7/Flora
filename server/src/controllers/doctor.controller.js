const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
  getDashboard,
  getPendingRequests,
  acceptConsultation,
  rejectConsultation,
  getAssignedPatients,
  closeConsultation,
  getClosedConsultations,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../services/doctor.service");

// Dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getDashboard(req.user.id);

  res.status(200).json(
    new ApiResponse(200, "Doctor dashboard fetched successfully.", dashboard)
  );
});

// Pending Consultation Requests
exports.getPendingRequests = asyncHandler(async (req, res) => {
  const requests = await getPendingRequests(req.user.id);

  res.status(200).json(
    new ApiResponse(200, "Pending consultation requests fetched successfully.", requests)
  );
});

// Assigned Patients
exports.getAssignedPatients = asyncHandler(async (req, res) => {
  const patients = await getAssignedPatients(req.user.id);

  res.status(200).json(
    new ApiResponse(200, "Assigned patients fetched successfully.", patients)
  );
});

// Accept Consultation Request
exports.acceptConsultation = asyncHandler(async (req, res) => {
  const chat = await acceptConsultation(req.user.id, req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Consultation request accepted successfully.", chat)
  );
});

// Reject Consultation Request
exports.rejectConsultation = asyncHandler(async (req, res) => {
  const chat = await rejectConsultation(req.user.id, req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Consultation request rejected successfully.", chat)
  );
});

// Close Consultation
exports.closeConsultation = asyncHandler(async (req, res) => {
  const chat = await closeConsultation(req.user.id, req.params.id);

  res.status(200).json(
    new ApiResponse(200, "Consultation closed successfully.", chat)
  );
});
// Closed Consultations
exports.getClosedConsultations = asyncHandler(async (req, res) => {
  const consultations = await getClosedConsultations(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Closed consultations fetched successfully.",
      consultations
    )
  );
});
// =========================================
// Doctor Profile
// =========================================

exports.getDoctorProfile = asyncHandler(async (req, res) => {
  const profile = await getDoctorProfile(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctor profile fetched successfully.",
      profile
    )
  );
});

// =========================================
// Update Doctor Profile
// =========================================

exports.updateDoctorProfile = asyncHandler(async (req, res) => {
  const profile = await updateDoctorProfile(
    req.user.id,
    req.body
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctor profile updated successfully.",
      profile
    )
  );
});
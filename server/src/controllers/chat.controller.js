const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const { createChatSchema } = require("../validators/chat.validator");

const {
  createChat,
  getAvailableDoctors,
  getMyRequests,
  getConversations,
  getDoctorProfileForConsultation,
  getPatientProfileForConsultation,
  closeConsultationAsPatient,
} = require("../services/chat.service");

// =========================================
// Create Consultation Request
// =========================================

exports.createChat = asyncHandler(async (req, res) => {
  const validatedData = createChatSchema.parse(req.body);

  const chat = await createChat(
    req.user.id,
    validatedData.doctorId,
    validatedData.reason
  );

  res.status(201).json(
    new ApiResponse(
      201,
      "Consultation request sent successfully.",
      chat
    )
  );
});

// =========================================
// Get Available Doctors
// =========================================

exports.getAvailableDoctors = asyncHandler(async (req, res) => {
  const doctors = await getAvailableDoctors(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Available doctors fetched successfully.",
      doctors
    )
  );
});

// =========================================
// Get Conversations
// =========================================

exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await getConversations(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Conversations fetched successfully.",
      conversations
    )
  );
});

// =========================================
// Get Doctor Profile for Consultation
// =========================================

exports.getDoctorProfileForConsultation = asyncHandler(async (req, res) => {
  const profile = await getDoctorProfileForConsultation(
    req.user.id,
    req.params.id
  );

  res.status(200).json(
    new ApiResponse(200, "Doctor profile fetched successfully.", profile)
  );
});

// =========================================
// Close Consultation from Patient Side
// =========================================

exports.closeConsultationAsPatient = asyncHandler(async (req, res) => {
  const chat = await closeConsultationAsPatient(
    req.user.id,
    req.params.id
  );

  res.status(200).json(
    new ApiResponse(200, "Consultation closed successfully.", chat)
  );
});

// =========================================
// Get My Consultation Requests
// =========================================

exports.getMyRequests = asyncHandler(async (req, res) => {
  const requests = await getMyRequests(req.user.id);

  res.status(200).json(
    new ApiResponse(
      200,
      "Consultation history fetched successfully.",
      requests
    )
  );
});

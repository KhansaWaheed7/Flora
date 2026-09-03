const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const { createChatSchema } = require("../validators/chat.validator");

const {
  createChat,
  getAvailableDoctors,
  getMyRequests,
  getConversations,
} = require("../services/chat.service");


// Create Consultation Request


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

// Get Available Doctors

exports.getAvailableDoctors = asyncHandler(async (req, res) => {

  const doctors = await getAvailableDoctors();

  res.status(200).json(
    new ApiResponse(
      200,
      "Available doctors fetched successfully.",
      doctors
    )
  );

});


// Get Conversations

exports.getConversations = asyncHandler(async (req, res) => {

  const conversations = await getConversations(
    req.user.id
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Conversations fetched successfully.",
      conversations
    )
  );

});


// Get My Consultation Requests


exports.getMyRequests = asyncHandler(async (req, res) => {

  const requests = await getMyRequests(
    req.user.id
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Consultation history fetched successfully.",
      requests
    )
  );

});
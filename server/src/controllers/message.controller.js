const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const { sendMessageSchema } = require("../validators/message.validator");

const {
  sendMessage,
  getMessages,
} = require("../services/message.service");

// =========================================
// Send Message
// =========================================

exports.sendMessage = asyncHandler(async (req, res) => {

  const validatedData = sendMessageSchema.parse(req.body);

  const message = await sendMessage(
    req.params.chatId,
    req.user.id,
    validatedData.message
  );

  res.status(201).json(
    new ApiResponse(
      201,
      "Message sent successfully.",
      message
    )
  );

});

// =========================================
// Get Messages
// =========================================

exports.getMessages = asyncHandler(async (req, res) => {

  const messages = await getMessages(
    req.params.chatId,
    req.user.id
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Messages fetched successfully.",
      messages
    )
  );

});
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { sendMessageSchema } = require("../validators/message.validator");

const {
  sendMessage,
  getMessages,
  getMessageAttachment,
  markMessagesAsRead,
} = require("../services/message.service");
// =========================================
// Send Message
// =========================================

exports.sendMessage = asyncHandler(async (req, res) => {
  const validatedData = sendMessageSchema.parse(req.body);

  const message = await sendMessage(
    req.params.chatId,
    req.user.id,
    validatedData.message,
    req.file
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

// =========================================
// Mark Messages as Read
// =========================================

exports.markMessagesAsRead = asyncHandler(async (req, res) => {
  await markMessagesAsRead(
    req.params.chatId,
    req.user.id
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Messages marked as read successfully.",
      null
    )
  );
});

// =========================================
// Get Message Attachment
// =========================================

exports.getMessageAttachment = asyncHandler(
  async (req, res) => {
    const attachment = await getMessageAttachment(
      req.params.chatId,
      req.params.messageId,
      req.user.id
    );

    res.setHeader(
      "Content-Type",
      attachment.mimeType
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${attachment.originalName}"`
    );

    res.setHeader(
      "Content-Length",
      attachment.size
    );

    res.send(attachment.buffer);
  }
);
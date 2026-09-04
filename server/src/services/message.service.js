const Chat = require("../models/Chat");
const Message = require("../models/Message");
const ApiError = require("../utils/ApiError");
const EncryptionUtil = require("../utils/encryptionUtil");
// =========================================
// Send Message
// =========================================

// =========================================
// Send Message
// =========================================

const sendMessage = async (
  chatId,
  senderId,
  message = "",
  file = null
) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(
      404,
      "Chat not found."
    );
  }

  if (chat.status !== "active") {
    throw new ApiError(
      400,
      "Consultation is not active."
    );
  }

  // Verify sender belongs to this chat
  const isParticipant = chat.participants.some(
    (participant) =>
      participant.toString() === senderId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "You are not a participant in this chat."
    );
  }

  // Message must contain either text or attachment
  if (!message?.trim() && !file) {
    throw new ApiError(
      400,
      "Message or attachment is required."
    );
  }

  // Determine receiver
  const receiver =
    chat.patient.toString() === senderId.toString()
      ? chat.doctor
      : chat.patient;

  let messageType = "text";
  let attachment = undefined;

  // =========================================
  // Handle Attachment
  // =========================================

  if (file) {
    const fileHash = EncryptionUtil.generateHash(
      file.buffer
    );

    const encryption = EncryptionUtil.encryptBuffer(
      file.buffer
    );

    if (file.mimetype.startsWith("image/")) {
      messageType = "image";
    } else if (file.mimetype.startsWith("audio/")) {
      messageType = "audio";
    } else {
      messageType = "file";
    }

    attachment = {
      encryptedData: encryption.encryptedData,
      encryptionIV: encryption.iv,
      encryptionAuthTag: encryption.authTag,
      fileHash,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  // =========================================
  // Create Message
  // =========================================

  const newMessage = await Message.create({
    chat: chat._id,
    sender: senderId,
    receiver,
    message: message?.trim() || "",
    messageType,
    attachment,
    isDelivered: false,
    isRead: false,
  });

  // Update last message
  chat.lastMessage = newMessage._id;
  chat.lastMessageAt = new Date();

  // Update unread count
  if (
    receiver.toString() ===
    chat.patient.toString()
  ) {
    chat.unreadCounts.patient += 1;
  } else {
    chat.unreadCounts.doctor += 1;
  }

  await chat.save();

  const populatedMessage = await newMessage.populate(
  "sender",
  "fullName profilePicture role"
);

const messageResponse = populatedMessage.toObject();

if (messageResponse.attachment) {
  delete messageResponse.attachment.encryptedData;
  delete messageResponse.attachment.encryptionIV;
  delete messageResponse.attachment.encryptionAuthTag;
}

return messageResponse;
};

// =========================================
// Get Messages
// =========================================

// =========================================
// Get Messages
// =========================================

// =========================================
// Get Messages
// =========================================

const getMessages = async (chatId, userId) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(
      404,
      "Chat not found."
    );
  }

  const isParticipant = chat.participants.some(
    (participant) =>
      participant.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "Access denied."
    );
  }

  const messages = await Message.find({
    chat: chatId,
  })
    .select(
      "chat sender receiver message messageType attachment.originalName attachment.size attachment.mimeType isDelivered deliveredAt isRead readAt createdAt updatedAt"
    )
    .populate(
      "sender",
      "fullName profilePicture role"
    )
    .sort({
      createdAt: 1,
    });

  return messages;
};

// =========================================
// Get Attachment
// =========================================

const getMessageAttachment = async (
  chatId,
  messageId,
  userId
) => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Chat not found.");
  }

  // Verify user belongs to this chat
  const isParticipant = chat.participants.some(
    (participant) =>
      participant.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "Access denied."
    );
  }

  // Find message AND make sure it belongs to this chat
  const message = await Message.findOne({
    _id: messageId,
    chat: chatId,
  });

  if (!message) {
    throw new ApiError(
      404,
      "Message not found."
    );
  }

  if (!message.attachment?.encryptedData) {
    throw new ApiError(
      404,
      "Attachment not found."
    );
  }

  // Decrypt attachment
  const decryptedBuffer = EncryptionUtil.decryptBuffer(
    message.attachment.encryptedData,
    message.attachment.encryptionIV,
    message.attachment.encryptionAuthTag
  );

  return {
    buffer: decryptedBuffer,
    originalName: message.attachment.originalName,
    mimeType: message.attachment.mimeType,
    size: message.attachment.size,
  };
};

// =========================================
// Mark Messages as Read
// =========================================

const markMessagesAsRead = async (
  chatId,
  userId
) => {

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(
      404,
      "Chat not found."
    );
  }

  const isParticipant = chat.participants.some(
    (participant) =>
      participant.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new ApiError(
      403,
      "Access denied."
    );
  }

  const result = await Message.updateMany(
  {
    chat: chatId,
    receiver: userId,
    isRead: false,
  },
  {
    $set: {
      isDelivered: true,
      deliveredAt: new Date(),
      isRead: true,
      readAt: new Date(),
    },
  }
);

console.log("📖 Messages marked as read:", {
  chatId,
  userId: userId.toString(),
  modifiedCount: result.modifiedCount,
});

  if (chat.patient.toString() === userId.toString()) {

    chat.unreadCounts.patient = 0;

  } else {

    chat.unreadCounts.doctor = 0;

  }

  await chat.save();

  return true;

};

module.exports = {
  sendMessage,
  getMessages,
  getMessageAttachment,
  markMessagesAsRead,
};
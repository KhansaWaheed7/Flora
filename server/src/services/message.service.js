const Chat = require("../models/Chat");
const Message = require("../models/Message");
const ApiError = require("../utils/ApiError");



// =========================================
// Send Message
// =========================================

const sendMessage = async (
  chatId,
  senderId,
  message
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

  // Determine receiver
  const receiver =
    chat.patient.toString() === senderId.toString()
      ? chat.doctor
      : chat.patient;

  const newMessage = await Message.create({

    chat: chat._id,

    sender: senderId,

    receiver,

    message,

    messageType: "text",

    isDelivered: false,

    isRead: false,

  });

  chat.lastMessage = newMessage._id;
  chat.lastMessageAt = new Date();

  // Update unread count
  if (receiver.toString() === chat.patient.toString()) {
    chat.unreadCounts.patient += 1;
  } else {
    chat.unreadCounts.doctor += 1;
  }

  await chat.save();

const populatedMessage = await newMessage.populate(
  "sender",
  "fullName profilePicture role"
);

return populatedMessage;

};

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
  markMessagesAsRead,
};
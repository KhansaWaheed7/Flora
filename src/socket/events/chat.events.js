const Chat = require("../../models/Chat");
const {
  sendMessage,
  markMessagesAsRead,
} = require("../../services/message.service");

const { MESSAGE_READ, NEW_MESSAGE } = require("../../constants/socketEvents");
// =========================================
// Chat Events
// =========================================

const registerChatEvents = (io, socket) => {

  // =========================================
  // Join Chat Room
  // =========================================

  socket.on("join-chat", async (chatId) => {

    try {

      const chat = await Chat.findById(chatId);

      if (!chat) {
        return;
      }

      const isParticipant = chat.participants.some(
        (participant) =>
          participant.toString() ===
          socket.user._id.toString()
      );

      if (!isParticipant) {
        return;
      }

      socket.join(chatId);

      console.log(
        `${socket.user.fullName} joined room ${chatId}`
      );

    } catch (error) {

      console.error(error);

    }

  });

  // =========================================
// Send Message
// =========================================

socket.on(
  "send-message",
  async ({ chatId, message }) => {

    try {

      const newMessage = await sendMessage(
        chatId,
        socket.user._id,
        message
      );

      io.to(chatId).emit(NEW_MESSAGE, newMessage);

    } catch (error) {

      socket.emit(
        "message-error",
        error.message
      );

    }

  }
);


// =========================================
// Message Delivered
// =========================================

socket.on(
  "message-delivered",
  async ({ messageId }) => {
    try {
      const Message = require("../../models/Message");

      const message = await Message.findById(messageId);

      if (!message) {
        return;
      }

      const chat = await Chat.findById(message.chat);

if (!chat) {
  return;
}

const isParticipant = chat.participants.some(
  (participant) =>
    participant.toString() ===
    socket.user._id.toString()
);

if (!isParticipant) {
  return;
}

if (
  message.receiver.toString() !==
  socket.user._id.toString()
) {
  return;
}

      if (!message.isDelivered) {
        message.isDelivered = true;
        message.deliveredAt = new Date();

        await message.save();
      }

      io.to(message.chat.toString()).emit("message-delivered", {
        messageId: message._id,
        chatId: message.chat,
        deliveredAt: message.deliveredAt,
      });

    } catch (error) {
      console.error("Message delivery error:", error);
    }
  }
);

// =========================================
// Typing Indicator
// =========================================

socket.on("typing", ({ chatId }) => {

  socket.to(chatId).emit("user-typing", {
    userId: socket.user._id,
    fullName: socket.user.fullName,
  });

});

// =========================================
// Stop Typing
// =========================================

socket.on("stop-typing", ({ chatId }) => {

  socket.to(chatId).emit("user-stop-typing", {
    userId: socket.user._id,
  });

});

// =========================================
// Mark Messages as Read
// =========================================

socket.on(
  "mark-read",
  async ({ chatId }) => {

    try {

      await markMessagesAsRead(
        chatId,
        socket.user._id
      );

      io.to(chatId).emit(MESSAGE_READ, {
  chatId,
  userId: socket.user._id,
});

    } catch (error) {

      socket.emit(
        "message-error",
        error.message
      );

    }

  }
);


};

module.exports = registerChatEvents;
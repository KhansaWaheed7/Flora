const Chat = require("../../models/Chat");
const {
  sendMessage,
  markMessagesAsRead,
} = require("../../services/message.service");
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

      io.to(chatId).emit(
        "new-message",
        newMessage
      );

    } catch (error) {

      socket.emit(
        "message-error",
        error.message
      );

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

      io.to(chatId).emit(
        "messages-read",
        {
          chatId,
          userId: socket.user._id,
        }
      );

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
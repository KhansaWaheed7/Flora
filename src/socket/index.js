const { Server } = require("socket.io");
const socketAuth = require("./middleware/socketAuth");
const registerChatEvents = require("./events/chat.events");

const {
  registerPresenceEvents,
} = require("./events/presence.events");
let io;

// =========================================
// Initialize Socket.IO
// =========================================

const initializeSocket = (server) => {

  io = new Server(server, {

    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },

  });
  io.use(socketAuth);

  io.on("connection", (socket) => {

  console.log(
    `🟢 ${socket.user.fullName} connected (${socket.id})`
  );

  registerChatEvents(io, socket);
  registerPresenceEvents(io, socket);

  socket.on("disconnect", () => {

    console.log(
      `🔴 ${socket.user.fullName} disconnected`
    );

  });

});

  return io;

};

// =========================================
// Get Socket Instance
// =========================================

const getIO = () => {

  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized."
    );
  }

  return io;

};

module.exports = {
  initializeSocket,
  getIO,
};
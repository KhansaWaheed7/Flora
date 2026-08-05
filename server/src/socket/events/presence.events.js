// =========================================
// Online Users
// userId -> socketId
// =========================================

const onlineUsers = new Map();

const registerPresenceEvents = (io, socket) => {

  const userId = socket.user._id.toString();

  // Store this user's socket
  onlineUsers.set(userId, socket.id);

  // Notify everyone that this user is online
  io.emit("user-online", {
    userId,
  });

  console.log(`${socket.user.fullName} is online`);

  socket.on("disconnect", () => {

    onlineUsers.delete(userId);

    io.emit("user-offline", {
      userId,
    });

    console.log(`${socket.user.fullName} is offline`);

  });

};

// =========================================
// Get Socket Id
// =========================================

const getSocketId = (userId) => {
  return onlineUsers.get(userId.toString());
};

// =========================================
// Check Online Status
// =========================================

const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};

module.exports = {
  registerPresenceEvents,
  isUserOnline,
  getSocketId,
};
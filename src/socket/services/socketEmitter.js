const { getIO } = require("../index");
const {
  getSocketId,
} = require("../events/presence.events");
// =========================================
// Emit To Room
// =========================================

const emitToRoom = (
  roomId,
  event,
  data
) => {

  getIO()
    .to(roomId)
    .emit(event, data);

};

// =========================================
// Emit To User
// =========================================

const emitToUser = (
  userId,
  event,
  data
) => {

  const socketId = getSocketId(userId);

  if (!socketId) {
    return;
  }

  getIO()
    .to(socketId)
    .emit(event, data);

};

module.exports = {
  emitToRoom,
  emitToUser,
};
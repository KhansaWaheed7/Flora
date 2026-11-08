const { getIO } = require("../index");

const emitToRoom = (roomId, event, data) => getIO().to(roomId).emit(event, data);

const emitToUser = (userId, event, data) => {
  if (!userId) return;
  try { getIO().to(`user:${userId.toString()}`).emit(event, data); } catch (error) { console.warn("Socket event could not be emitted:", error.message); }
};

module.exports = { emitToRoom, emitToUser };

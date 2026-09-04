const Chat = require("../models/Chat");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const {
  emitToUser,
} = require("../socket/services/socketEmitter");

const SocketEvents = require("../constants/socketEvents");
// =========================================
// Create Consultation Request
// =========================================

const createChat = async (patientId, doctorId, reason) => {

  if (patientId === doctorId) {
    throw new ApiError(
      400,
      "You cannot start a chat with yourself."
    );
  }

  const doctor = await User.findById(doctorId);

  if (!doctor) {
    throw new ApiError(
      404,
      "Doctor not found."
    );
  }

  if (doctor.role !== "doctor") {
  throw new ApiError(
    400,
    "Selected user is not a doctor."
  );
}

if (doctor.doctorVerification?.status !== "verified") {
  throw new ApiError(
    400,
    "Doctor is not verified."
  );
}

if (!doctor.isEmailVerified) {
  throw new ApiError(
    400,
    "Doctor account is not verified."
  );
}

  const existingChat = await Chat.findOne({
    patient: patientId,
    doctor: doctorId,
    status: {
      $in: ["pending", "active"],
    },
  });

  if (existingChat) {
    throw new ApiError(
      400,
      "A consultation already exists."
    );
  }

  const chat = await Chat.create({
  participants: [
    patientId,
    doctorId,
  ],
  initiatedBy: patientId,
  reason,
  patient: patientId,
  doctor: doctorId,
  status: "pending",
});

  await chat.populate(
  "patient",
  "fullName profilePicture"
);

emitToUser(
  doctorId,
  SocketEvents.NEW_CONSULTATION_REQUEST,
  {
    chatId: chat._id,
    patient: chat.patient,
    createdAt: chat.createdAt,
  }
);

  return chat;
};

// =========================================
// Get Available Doctors
// =========================================

const getAvailableDoctors = async () => {

  const doctors = await User.find({
  role: "doctor",
  "doctorVerification.status": "verified",
  isEmailVerified: true,
})
    .select(
      "fullName specialization hospital yearsOfExperience profilePicture"
    )
    .sort({
      fullName: 1,
    });

  return doctors;

};

// =========================================
// Get Patient Consultation History
// =========================================

const getMyRequests = async (patientId) => {

  const chats = await Chat.find({
    patient: patientId,
  })
    .populate(
      "doctor",
      "fullName specialization hospital yearsOfExperience profilePicture"
    )
    .sort({
      createdAt: -1,
    });

  return chats;

};

// =========================================
// Get Conversations
// =========================================

const getConversations = async (userId) => {

  const chats = await Chat.find({

    participants: userId,

    status: {
      $in: ["active", "pending"],
    },

  })
    .populate(
      "patient",
      "fullName profilePicture"
    )
    .populate(
      "doctor",
      "fullName profilePicture specialization"
    )
    .populate({
      path: "lastMessage",
      select: "message createdAt sender",
      populate: {
        path: "sender",
        select: "fullName",
      },
    })
    .sort({
      lastMessageAt: -1,
      updatedAt: -1,
    });

  const conversations = chats.map((chat) => {

  const isPatient =
    chat.patient._id.toString() === userId.toString();

  const otherParticipant = isPatient
    ? chat.doctor
    : chat.patient;

  return {

    _id: chat._id,

    status: chat.status,

    createdAt: chat.createdAt,

    updatedAt: chat.updatedAt,

    lastMessageAt: chat.lastMessageAt,

    otherParticipant,

    lastMessage: chat.lastMessage
      ? {
          _id: chat.lastMessage._id,
          message: chat.lastMessage.message,
          sender: chat.lastMessage.sender,
          createdAt: chat.lastMessage.createdAt,
        }
      : null,

    unreadCount: isPatient
      ? chat.unreadCounts.patient
      : chat.unreadCounts.doctor,

  };

});

return conversations;

};

module.exports = {
  createChat,
  getAvailableDoctors,
  getMyRequests,
  getConversations,
};
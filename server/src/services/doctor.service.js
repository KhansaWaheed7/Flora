const Chat = require("../models/Chat");
const ApiError = require("../utils/ApiError");
const {
  emitToUser,
} = require("../socket/services/socketEmitter");

const SocketEvents = require("../constants/socketEvents");
// =========================================
// Dashboard Summary
// =========================================

const getDashboard = async (doctorId) => {

  const pendingRequests = await Chat.countDocuments({
    doctor: doctorId,
    status: "pending",
  });

  const activePatients = await Chat.countDocuments({
    doctor: doctorId,
    status: "active",
  });

  const recentPatients = await Chat.find({
    doctor: doctorId,
    status: "active",
  })
    .populate(
      "patient",
      "fullName email profilePicture"
    )
    .sort({
      acceptedAt: -1,
    })
    .limit(5);

  return {

    pendingRequests,

    activePatients,

    activeChats: activePatients,

    recentPatients,

  };

};

// =========================================
// Pending Consultation Requests
// =========================================

const getPendingRequests = async (doctorId) => {

  return await Chat.find({
    doctor: doctorId,
    status: "pending",
  })
    .populate(
      "patient",
      "fullName email age profilePicture"
    )
    .sort({
      createdAt: -1,
    });

};
// =========================================
// Assigned Patients
// =========================================

const getAssignedPatients = async (doctorId) => {

  const patients = await Chat.find({
    doctor: doctorId,
    status: "active",
  })
    .populate(
      "patient",
      "fullName email age profilePicture"
    )
    .sort({
      acceptedAt: -1,
    });

  return patients;

};

// =========================================
// Accept Consultation Request
// =========================================

const acceptConsultation = async (doctorId, chatId) => {

  const chat = await Chat.findOne({
    _id: chatId,
    doctor: doctorId,
    status: "pending",
  });

  if (!chat) {
    throw new ApiError(
  404,
  "Consultation request not found."
);
  }

  chat.status = "active";
  chat.acceptedAt = new Date();

  await chat.save();
  await chat.populate(
  "doctor",
  "fullName specialization profilePicture"
);

emitToUser(
  chat.patient,
  SocketEvents.CONSULTATION_ACCEPTED,
  {
    chatId: chat._id,
    doctor: chat.doctor,
    acceptedAt: chat.acceptedAt,
  }
);

  return chat;

};

// =========================================
// Reject Consultation Request
// =========================================

const rejectConsultation = async (doctorId, chatId) => {

  const chat = await Chat.findOne({
    _id: chatId,
    doctor: doctorId,
    status: "pending",
  });

  if (!chat) {
    throw new ApiError(
  404,
  "Consultation request not found."
);
  }

  chat.status = "rejected";

  await chat.save();
  await chat.populate(
  "doctor",
  "fullName specialization profilePicture"
);

emitToUser(
  chat.patient,
  SocketEvents.CONSULTATION_REJECTED,
  {
    chatId: chat._id,
    doctor: chat.doctor,
  }
);

  return chat;

};

module.exports = {
  getDashboard,
  getPendingRequests,
  acceptConsultation,
  rejectConsultation,
  getAssignedPatients,
};
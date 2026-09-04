const Chat = require("../models/Chat");
const ApiError = require("../utils/ApiError");
const {
  emitToUser,
} = require("../socket/services/socketEmitter");

const Message = require("../models/Message");

const SocketEvents = require("../constants/socketEvents");
// =========================================
// Dashboard Summary
// =========================================

// =========================================
// Dashboard Summary
// =========================================

const getDashboard = async (doctorId) => {
  // Pending consultation requests
  const pendingRequests = await Chat.countDocuments({
    doctor: doctorId,
    status: "pending",
  });

  // Active patients
  const activePatients = await Chat.countDocuments({
    doctor: doctorId,
    status: "active",
  });

  // Closed consultations
  const closedConsultations = await Chat.countDocuments({
    doctor: doctorId,
    status: "closed",
  });

  // Start of today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Start of tomorrow
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  // Messages received by doctor today
  const todaysMessages = await Message.countDocuments({
    receiver: doctorId,
    createdAt: {
      $gte: startOfToday,
      $lt: startOfTomorrow,
    },
  });

  // Unread incoming messages
  const unreadMessages = await Message.countDocuments({
    receiver: doctorId,
    isRead: false,
  });

  // Recent active patients
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
    closedConsultations,
    todaysMessages,
    unreadMessages,
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
// Closed Consultations
// =========================================

const getClosedConsultations = async (doctorId) => {
  return await Chat.find({
    doctor: doctorId,
    status: "closed",
  })
    .populate(
      "patient",
      "fullName email age profilePicture"
    )
    .sort({
      closedAt: -1,
    });
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

// =========================================
// Close Consultation
// =========================================
const closeConsultation = async (doctorId, chatId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    doctor: doctorId,
    status: "active",
  });

  if (!chat) {
    throw new ApiError(
      404,
      "Active consultation not found."
    );
  }

  chat.status = "closed";
  chat.closedAt = new Date();
  chat.closedBy = doctorId;

  await chat.save();

  await Message.create({
  chat: chat._id,
  sender: doctorId,
  receiver: chat.patient,
  message: "Consultation has been closed.",
  messageType: "system",
  isRead: false,
});

  return chat;
};

module.exports = {
  getDashboard,
  getPendingRequests,
  acceptConsultation,
  rejectConsultation,
  getAssignedPatients,
  closeConsultation,
  getClosedConsultations,
};
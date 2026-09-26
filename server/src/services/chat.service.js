const Chat = require("../models/Chat");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Message = require("../models/Message");
const ApiError = require("../utils/ApiError");

const { emitToUser } = require("../socket/services/socketEmitter");
const SocketEvents = require("../constants/socketEvents");
const { createNotification } = require("./notification.service");

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const normalizePublicSchedule = (schedule = []) =>
  DAY_NAMES.map((name, day) => {
    const item = schedule.find((entry) => Number(entry.day) === day);
    return {
      day,
      name,
      enabled: Boolean(item?.enabled),
      slots: Array.isArray(item?.slots) ? item.slots : [],
    };
  });


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

  await createNotification({
    userId: patientId,
    type: "consultation",
    title: "Consultation request sent",
    message: "Your consultation request has been sent to the doctor.",
    link: "/chat",
    uniqueKey: `consultation-request-sent-${chat._id}`,
    metadata: { chatId: chat._id, doctorId },
  });

  await createNotification({
    userId: doctorId,
    type: "consultation",
    title: "New consultation request",
    message: "A patient has sent you a new consultation request.",
    link: "/doctor/consultation-requests",
    uniqueKey: `consultation-request-${chat._id}`,
    metadata: { chatId: chat._id, patientId },
  });

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

const getAvailableDoctors = async (patientId) => {
  const doctors = await User.find({
    role: "doctor",
    "doctorVerification.status": "verified",
    isEmailVerified: true,
  })
    .select(
      "fullName specialization hospital yearsOfExperience profilePicture city consultationFee qualifications areasOfExpertise languages bio doctorVerification weeklySchedule scheduleTimezone"
    )
    .sort({
      fullName: 1,
    })
    .lean();

  // -----------------------------------------
  // Find active chats for this patient
  // -----------------------------------------

  const activeChats = await Chat.find({
    patient: patientId,
    status: "active",
  })
    .select("doctor")
    .lean();

  const activeDoctorIds = new Set(
    activeChats.map((chat) =>
      chat.doctor.toString()
    )
  );

  // -----------------------------------------
  // Add hasActiveChat to every doctor
  // -----------------------------------------

  const doctorsWithChatStatus = doctors.map((doctor) => ({
    ...doctor,

    hasActiveChat: activeDoctorIds.has(
      doctor._id.toString()
    ),

    verificationStatus:
      doctor.doctorVerification?.status || null,
    weeklySchedule: normalizePublicSchedule(doctor.weeklySchedule || []),
    scheduleTimezone: doctor.scheduleTimezone || "Asia/Karachi",
  }));

  return doctorsWithChatStatus;
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

// =========================================
// Get Doctor Profile for an Existing Consultation
// =========================================

// =========================================
// Get Doctor Profile for an Existing Consultation
// =========================================

const getDoctorProfileForConsultation = async (patientId, chatId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    patient: patientId,
  });

  if (!chat) {
    throw new ApiError(404, "Consultation not found.");
  }

  const doctor = await User.findOne({
    _id: chat.doctor,
    role: "doctor",
  }).select(
    "fullName email phone profilePicture specialization hospital yearsOfExperience bio areasOfExpertise languages city consultationFee doctorVerification weeklySchedule scheduleTimezone"
  );

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }

  // Normalize the doctor's weekly schedule so all 7 days
  // are always returned, including unavailable days.
  const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const scheduleMap = new Map(
    (doctor.weeklySchedule || []).map((item) => [
      Number(item.day),
      {
        day: Number(item.day),
        enabled: Boolean(item.enabled),
        slots: Array.isArray(item.slots) ? item.slots : [],
      },
    ])
  );

  const weeklySchedule = DAY_NAMES.map((name, day) => ({
    day,
    name,
    enabled: scheduleMap.get(day)?.enabled || false,
    slots: scheduleMap.get(day)?.slots || [],
  }));

  return {
    chatId: chat._id,
    consultationStatus: chat.status,

    _id: doctor._id,
    fullName: doctor.fullName,
    email: doctor.email,
    phone: doctor.phone,
    profilePicture: doctor.profilePicture,

    specialization: doctor.specialization,
    hospital: doctor.hospital,
    yearsOfExperience: doctor.yearsOfExperience,

    qualifications: doctor.doctorVerification?.qualifications || [],

    bio: doctor.bio,
    areasOfExpertise: doctor.areasOfExpertise || [],
    languages: doctor.languages || [],
    city: doctor.city,
    consultationFee: doctor.consultationFee,

    verificationStatus:
      doctor.doctorVerification?.status || "pending",

    // Doctor availability
    weeklySchedule,
    scheduleTimezone: doctor.scheduleTimezone || "Asia/Karachi",
  };
};

// =========================================
// Get Patient Profile for an Existing Consultation
// =========================================

const getPatientProfileForConsultation = async (doctorId, chatId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    doctor: doctorId,
  });

  if (!chat) {
    throw new ApiError(404, "Consultation not found.");
  }

  const patient = await User.findOne({
    _id: chat.patient,
    role: "user",
  }).select("fullName email phone age profilePicture role accountStatus isEmailVerified");

  if (!patient) {
    throw new ApiError(404, "Patient profile not found.");
  }

  let profile = await Profile.findOne({ user: patient._id }).lean();

  if (!profile) {
    profile = {
      dateOfBirth: null,
      gender: null,
      bloodGroup: null,
      location: null,
      height: null,
      weight: null,
      allergies: [],
      medicalConditions: [],
      avatar: "",
    };
  }

  return {
    chatId: chat._id,
    consultationStatus: chat.status,
    patient: {
      _id: patient._id,
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      profilePicture: patient.profilePicture,
      avatar: profile.avatar || patient.profilePicture || "",
      accountStatus: patient.accountStatus,
      isEmailVerified: patient.isEmailVerified,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      location: profile.location,
      height: profile.height,
      weight: profile.weight,
      allergies: profile.allergies || [],
      medicalConditions: profile.medicalConditions || [],
    },
  };
};

// =========================================
// Close Consultation from Patient Side
// =========================================

const closeConsultationAsPatient = async (patientId, chatId) => {
  const chat = await Chat.findOne({
    _id: chatId,
    patient: patientId,
    status: "active",
  });

  if (!chat) {
    throw new ApiError(404, "Active consultation not found.");
  }

  chat.status = "closed";
  chat.closedAt = new Date();
  chat.closedBy = patientId;

  await chat.save();

  await createNotification({
    userId: chat.doctor,
    type: "consultation",
    title: "Consultation closed",
    message: "The patient has closed the consultation.",
    link: `/doctor/messages/${chat._id}`,
    uniqueKey: `consultation-closed-by-patient-${chat._id}`,
    metadata: { chatId: chat._id, patientId },
  });

  await Message.create({
    chat: chat._id,
    sender: patientId,
    receiver: chat.doctor,
    message: "Consultation has been closed.",
    messageType: "system",
    isRead: false,
  });

  return chat;
};

module.exports = {
  createChat,
  getAvailableDoctors,
  getMyRequests,
  getConversations,
  getDoctorProfileForConsultation,
  getPatientProfileForConsultation,
  closeConsultationAsPatient,
};

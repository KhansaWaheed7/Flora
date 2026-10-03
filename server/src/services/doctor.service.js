const Chat = require("../models/Chat");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const {
  emitToUser,
} = require("../socket/services/socketEmitter");

const Message = require("../models/Message");

const SocketEvents = require("../constants/socketEvents");
const { createNotification } = require("./notification.service");

const DEFAULT_TIMEZONE = "Asia/Karachi";
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const normalizeSchedule = (schedule = []) => {
  const byDay = new Map(
    schedule.map((item) => [
      Number(item.day),
      {
        day: Number(item.day),
        enabled: Boolean(item.enabled),
        slots: Array.isArray(item.slots) ? item.slots : [],
      },
    ])
  );

  return DAY_NAMES.map((name, day) => ({
    day,
    name,
    enabled: byDay.get(day)?.enabled || false,
    slots: byDay.get(day)?.slots || [],
  }));
};

const timeToMinutes = (time) => {
  const [hours, minutes] = String(time).split(":").map(Number);
  return hours * 60 + minutes;
};

const validateSchedule = (schedule) => {
  if (!Array.isArray(schedule) || schedule.length !== 7) {
    throw new ApiError(400, "Schedule must contain all 7 days.");
  }

  const seenDays = new Set();

  for (const day of schedule) {
    const dayNumber = Number(day.day);

    if (!Number.isInteger(dayNumber) || dayNumber < 0 || dayNumber > 6) {
      throw new ApiError(400, "Invalid schedule day.");
    }

    if (seenDays.has(dayNumber)) {
      throw new ApiError(400, "Each day can only appear once.");
    }
    seenDays.add(dayNumber);

    if (!Array.isArray(day.slots)) {
      throw new ApiError(400, `Invalid time slots for ${DAY_NAMES[dayNumber]}.`);
    }

    const normalizedSlots = day.slots.map((slot) => ({
      start: String(slot.start || ""),
      end: String(slot.end || ""),
    }));

    for (const slot of normalizedSlots) {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.start) ||
          !/^([01]\d|2[0-3]):[0-5]\d$/.test(slot.end)) {
        throw new ApiError(400, `Invalid time format for ${DAY_NAMES[dayNumber]}.`);
      }

      if (timeToMinutes(slot.start) >= timeToMinutes(slot.end)) {
        throw new ApiError(400, `End time must be after start time on ${DAY_NAMES[dayNumber]}.`);
      }
    }

    const sorted = [...normalizedSlots].sort(
      (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
    );

    for (let i = 1; i < sorted.length; i += 1) {
      if (timeToMinutes(sorted[i].start) < timeToMinutes(sorted[i - 1].end)) {
        throw new ApiError(400, `Schedule slots overlap on ${DAY_NAMES[dayNumber]}.`);
      }
    }

    if (day.enabled && normalizedSlots.length === 0) {
      throw new ApiError(400, `${DAY_NAMES[dayNumber]} must have at least one time slot.`);
    }
  }

  return schedule
    .sort((a, b) => Number(a.day) - Number(b.day))
    .map((day) => ({
      day: Number(day.day),
      enabled: Boolean(day.enabled),
      slots: day.slots.map((slot) => ({
        start: String(slot.start),
        end: String(slot.end),
      })),
    }));
};

const getTodayInTimezone = (timeZone = DEFAULT_TIMEZONE) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
  });
  const weekday = formatter.format(new Date());
  return DAY_NAMES.indexOf(weekday);
};

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

  const doctor = await User.findById(doctorId)
    .select("weeklySchedule scheduleTimezone")
    .lean();

  const schedule = normalizeSchedule(doctor?.weeklySchedule || []);
  const timezone = doctor?.scheduleTimezone || DEFAULT_TIMEZONE;
  const todayDay = getTodayInTimezone(timezone);
  const todaySchedule = schedule.find((item) => item.day === todayDay) || {
    day: todayDay,
    name: DAY_NAMES[todayDay],
    enabled: false,
    slots: [],
  };

  return {
    pendingRequests,
    activePatients,
    closedConsultations,
    todaysMessages,
    unreadMessages,
    activeChats: activePatients,
    recentPatients,
    schedule,
    todaySchedule,
    scheduleTimezone: timezone,
  };
};


// Pending Consultation Requests

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

// Assigned Patients

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


// Closed Consultations

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


// Accept Consultation Request

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

  await createNotification({
    userId: chat.patient,
    type: "consultation",
    title: "Consultation accepted",
    message: "Your doctor accepted the consultation request.",
    link: `/chat/${chat._id}`,
    uniqueKey: `consultation-accepted-${chat._id}`,
    metadata: { chatId: chat._id, doctorId },
  });

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

// Reject Consultation Request

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

  await createNotification({
    userId: chat.patient,
    type: "consultation",
    title: "Consultation request declined",
    message: "Your doctor declined the consultation request.",
    link: "/chat",
    uniqueKey: `consultation-rejected-${chat._id}`,
    metadata: { chatId: chat._id, doctorId },
  });

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


// Close Consultation

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

  await createNotification({
    userId: chat.patient,
    type: "consultation",
    title: "Consultation closed",
    message: "Your consultation with the doctor has been closed.",
    link: `/chat/${chat._id}/closed`,
    uniqueKey: `consultation-closed-${chat._id}`,
    metadata: { chatId: chat._id },
  });

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


// Doctor Schedule
const getDoctorSchedule = async (doctorId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  }).select("weeklySchedule scheduleTimezone");

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }

  const schedule = normalizeSchedule(doctor.weeklySchedule || []);
  const timezone = doctor.scheduleTimezone || DEFAULT_TIMEZONE;
  const todayDay = getTodayInTimezone(timezone);

  return {
    schedule,
    todaySchedule: schedule.find((item) => item.day === todayDay),
    scheduleTimezone: timezone,
  };
};

const updateDoctorSchedule = async (doctorId, schedule, scheduleTimezone = DEFAULT_TIMEZONE) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }

  const normalized = validateSchedule(schedule);

  doctor.weeklySchedule = normalized;
  doctor.scheduleTimezone = scheduleTimezone || DEFAULT_TIMEZONE;
  await doctor.save();

  return {
    schedule: normalizeSchedule(normalized),
    scheduleTimezone: doctor.scheduleTimezone,
  };
};

// Get Doctor Profile

const getDoctorProfile = async (doctorId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  }).select(
    "fullName email phone age profilePicture specialization hospital yearsOfExperience bio areasOfExpertise languages city consultationFee doctorVerification weeklySchedule scheduleTimezone"
  );

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }

  return {
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

    verificationStatus: doctor.doctorVerification?.status || "pending",
    weeklySchedule: normalizeSchedule(doctor.weeklySchedule || []),
    scheduleTimezone: doctor.scheduleTimezone || DEFAULT_TIMEZONE,
  };
};

// Update Doctor Profile

const updateDoctorProfile = async (doctorId, data) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }


  // Basic Profile

  if (data.fullName !== undefined) {
    doctor.fullName = data.fullName;
  }

  if (data.phone !== undefined) {
    doctor.phone = data.phone;
  }

  if (data.profilePicture !== undefined) {
    doctor.profilePicture = data.profilePicture;
  }

  // Professional Profile

  if (data.hospital !== undefined) {
    doctor.hospital = data.hospital;
  }

  if (data.yearsOfExperience !== undefined) {
    doctor.yearsOfExperience = data.yearsOfExperience;
  }

  if (data.bio !== undefined) {
    doctor.bio = data.bio;
  }

  if (data.areasOfExpertise !== undefined) {
    doctor.areasOfExpertise = data.areasOfExpertise;
  }

  if (data.languages !== undefined) {
    doctor.languages = data.languages;
  }

  if (data.city !== undefined) {
    doctor.city = data.city;
  }

  if (data.consultationFee !== undefined) {
    doctor.consultationFee = data.consultationFee;
  }

  await doctor.save();

  return {
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

    verificationStatus: doctor.doctorVerification?.status || "pending",
    weeklySchedule: normalizeSchedule(doctor.weeklySchedule || []),
    scheduleTimezone: doctor.scheduleTimezone || DEFAULT_TIMEZONE,
  };
};


// Upload Doctor Profile Picture

const uploadDoctorAvatar = async (doctorId, file) => {
  if (!file) {
    throw new ApiError(400, "No image file provided.");
  }

  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "flora/doctors/profile",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary doctor avatar upload error:",
              error
            );

            return reject(error);
          }

          resolve(result);
        }
      );

      streamifier
        .createReadStream(file.buffer)
        .pipe(stream);
    });

    console.log(
      "Doctor profile picture uploaded:",
      result.secure_url
    );

    if (doctor.profilePicture) {
      try {
        const urlParts = doctor.profilePicture.split("/upload/");

        if (urlParts.length === 2) {
          let publicId = urlParts[1];

          // Remove version: v123456789/
          publicId = publicId.replace(/^v\d+\//, "");

          // Remove extension
          publicId = publicId.replace(/\.[^/.]+$/, "");

          await cloudinary.uploader.destroy(publicId);
        }
      } catch (deleteError) {
        console.error(
          "Failed to delete old doctor profile picture:",
          deleteError
        );
      }
    }

    doctor.profilePicture = result.secure_url;

    await doctor.save();

    return doctor.profilePicture;
  } catch (error) {
    console.error(
      "Doctor avatar upload failed:",
      error
    );

    throw new ApiError(
      500,
      error.message || "Failed to upload profile picture."
    );
  }
};


// Remove Doctor Profile Picture

const removeDoctorAvatar = async (doctorId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }


  if (!doctor.profilePicture) {
    return "";
  }

  try {
    const urlParts = doctor.profilePicture.split("/upload/");

    if (urlParts.length === 2) {
      let publicId = urlParts[1];

      publicId = publicId.replace(/^v\d+\//, "");

      publicId = publicId.replace(/\.[^/.]+$/, "");

      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error(
      "Failed to delete doctor profile picture from Cloudinary:",
      error
    );
  }

  doctor.profilePicture = "";

  await doctor.save();

  return "";
};

module.exports = {
  getDashboard,
  getPendingRequests,
  acceptConsultation,
  rejectConsultation,
  getAssignedPatients,
  closeConsultation,
  getClosedConsultations,
  getDoctorProfile,
  updateDoctorProfile,
  uploadDoctorAvatar,
  removeDoctorAvatar,
  getDoctorSchedule,
  updateDoctorSchedule,
};
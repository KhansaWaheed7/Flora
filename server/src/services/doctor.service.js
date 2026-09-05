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

// =========================================
// Get Doctor Profile
// =========================================

const getDoctorProfile = async (doctorId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  }).select(
    "fullName email phone age profilePicture specialization hospital yearsOfExperience bio areasOfExpertise languages city consultationFee doctorVerification"
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
  };
};

// =========================================
// Update Doctor Profile
// =========================================

const updateDoctorProfile = async (doctorId, data) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }

  // -----------------------------------------
  // Basic Profile
  // -----------------------------------------

  if (data.fullName !== undefined) {
    doctor.fullName = data.fullName;
  }

  if (data.phone !== undefined) {
    doctor.phone = data.phone;
  }

  if (data.profilePicture !== undefined) {
    doctor.profilePicture = data.profilePicture;
  }

  // -----------------------------------------
  // Professional Profile
  // -----------------------------------------

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
  };
};

// =========================================
// Upload Doctor Profile Picture
// =========================================

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

    // If doctor already has an old Cloudinary image,
    // delete it before saving the new one.
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

// =========================================
// Remove Doctor Profile Picture
// =========================================

const removeDoctorAvatar = async (doctorId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor profile not found.");
  }

  // Nothing to remove
  if (!doctor.profilePicture) {
    return "";
  }

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
};
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const AuditLog = require("../models/AuditLog");

// =========================================
// Pending Doctors
// =========================================

const getPendingDoctors = async () => {

  return await User.find({
    role: "doctor",
    doctorApprovalStatus: "pending",
  }).select("-password -refreshToken");

};

// =========================================
// All Doctors
// =========================================

// =========================================
// All Doctors — Search + Pagination
// =========================================

const getDoctors = async (
  page = 1,
  limit = 10,
  search = ""
) => {

  const skip = (page - 1) * limit;

  const filter = {
    role: "doctor",
  };

  if (search.trim()) {

    filter.$or = [
      {
        fullName: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        email: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        specialization: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        hospital: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];

  }

  const [
    doctors,
    totalDoctors,
  ] = await Promise.all([

    User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(filter),

  ]);

  return {

    doctors,

    pagination: {

      page,

      limit,

      totalDoctors,

      totalPages: Math.ceil(
        totalDoctors / limit
      ),

      hasNextPage:
        page * limit < totalDoctors,

      hasPreviousPage:
        page > 1,

    },

  };

};

// =========================================
// Approve Doctor
// =========================================

const approveDoctor = async (
  doctorId,
  adminId
) => {

  const doctor = await User.findById(doctorId);

  if (!doctor || doctor.role !== "doctor") {
    throw new ApiError(
      404,
      "Doctor not found."
    );
  }

  doctor.doctorApprovalStatus = "approved";

  await doctor.save();

  await AuditLog.create({
    admin: adminId,
    action: "APPROVE_DOCTOR",
    targetUser: doctor._id,
    details: "Doctor account approved.",
  });

  return doctor;
};

// =========================================
// Reject Doctor
// =========================================

const rejectDoctor = async (
  doctorId,
  adminId
) => {

  const doctor = await User.findById(doctorId);

  if (!doctor || doctor.role !== "doctor") {
    throw new ApiError(
      404,
      "Doctor not found."
    );
  }

  doctor.doctorApprovalStatus = "rejected";

  await doctor.save();

  await AuditLog.create({
    admin: adminId,
    action: "REJECT_DOCTOR",
    targetUser: doctor._id,
    details: "Doctor account rejected.",
  });

  return doctor;
};

// =========================================
// Admin Dashboard Statistics
// =========================================

const getDashboardStats = async () => {

  const [
    totalPatients,
    totalDoctors,
    pendingDoctors,
    suspendedAccounts,
  ] = await Promise.all([

    User.countDocuments({
      role: "user",
    }),

    User.countDocuments({
      role: "doctor",
    }),

    User.countDocuments({
      role: "doctor",
      doctorApprovalStatus: "pending",
    }),

    User.countDocuments({
      accountStatus: "suspended",
    }),

  ]);

  return {
    totalPatients,
    totalDoctors,
    pendingDoctors,
    suspendedAccounts,
  };

};

// =========================================
// Get All Patients
// =========================================

const getPatients = async (
  page = 1,
  limit = 10,
  search = ""
) => {

  const skip = (page - 1) * limit;

  const filter = {
    role: "user",
  };

  if (search.trim()) {

    filter.$or = [
      {
        fullName: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        email: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];

  }

  const [
    patients,
    totalPatients,
  ] = await Promise.all([

    User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments(filter),

  ]);

  return {

    patients,

    pagination: {

      page,

      limit,

      totalPatients,

      totalPages: Math.ceil(
        totalPatients / limit
      ),

      hasNextPage:
        page * limit < totalPatients,

      hasPreviousPage:
        page > 1,

    },

  };

};
// =========================================
// Update Patient Account Status
// =========================================

const updatePatientStatus = async (
  patientId,
  status,
  adminId
) => {

  const patient = await User.findById(patientId);

  if (!patient || patient.role !== "user") {
    throw new ApiError(
      404,
      "Patient not found."
    );
  }

  if (
    status !== "active" &&
    status !== "suspended"
  ) {
    throw new ApiError(
      400,
      "Invalid account status."
    );
  }

  patient.accountStatus = status;

  await patient.save();

  await AuditLog.create({
    admin: adminId,
    action:
      status === "suspended"
        ? "SUSPEND_PATIENT"
        : "REACTIVATE_PATIENT",
    targetUser: patient._id,
    details: `Patient account ${status}.`,
  });

  return patient;
};

// =========================================
// Update Doctor Account Status
// =========================================

const updateDoctorStatus = async (
  doctorId,
  status,
  adminId
) => {

  const doctor = await User.findById(doctorId);

  if (!doctor || doctor.role !== "doctor") {
    throw new ApiError(
      404,
      "Doctor not found."
    );
  }

  if (
    status !== "active" &&
    status !== "suspended"
  ) {
    throw new ApiError(
      400,
      "Invalid account status."
    );
  }

  doctor.accountStatus = status;

  await doctor.save();

  await AuditLog.create({
    admin: adminId,
    action:
      status === "suspended"
        ? "SUSPEND_DOCTOR"
        : "REACTIVATE_DOCTOR",
    targetUser: doctor._id,
    details: `Doctor account ${status}.`,
  });

  return doctor;
};
const getAuditLogs = async (
  page = 1,
  limit = 20
) => {

  const skip = (page - 1) * limit;

  const [
    logs,
    totalLogs,
  ] = await Promise.all([

    AuditLog.find()
      .populate(
        "admin",
        "fullName email"
      )
      .populate(
        "targetUser",
        "fullName email role"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    AuditLog.countDocuments(),

  ]);

  return {

    logs,

    pagination: {

      page,

      limit,

      totalLogs,

      totalPages: Math.ceil(
        totalLogs / limit
      ),

      hasNextPage:
        page * limit < totalLogs,

      hasPreviousPage:
        page > 1,

    },

  };

};

module.exports = {
  getDashboardStats,
  getPendingDoctors,
  getDoctors,
  approveDoctor,
  rejectDoctor,
  getPatients,
  updatePatientStatus,
  updateDoctorStatus,
  getAuditLogs,
};
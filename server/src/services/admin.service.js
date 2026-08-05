const User = require("../models/User");
const ApiError = require("../utils/ApiError");

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

const getDoctors = async () => {

  return await User.find({
    role: "doctor",
  }).select("-password -refreshToken");

};

// =========================================
// Approve Doctor
// =========================================

const approveDoctor = async (doctorId) => {

  const doctor = await User.findById(doctorId);

  if (!doctor || doctor.role !== "doctor") {
    throw new ApiError(404, "Doctor not found.");
  }

  doctor.doctorApprovalStatus = "approved";

  await doctor.save();

  return doctor;

};

// =========================================
// Reject Doctor
// =========================================

const rejectDoctor = async (doctorId) => {

  const doctor = await User.findById(doctorId);

  if (!doctor || doctor.role !== "doctor") {
    throw new ApiError(404, "Doctor not found.");
  }

  doctor.doctorApprovalStatus = "rejected";

  await doctor.save();

  return doctor;

};

module.exports = {
  getPendingDoctors,
  getDoctors,
  approveDoctor,
  rejectDoctor,
};
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");
const { sendDoctorVerificationEmail } =
  require("../services/email.service");
// =========================================
// Get Pending Doctor Verifications
// =========================================

exports.getPendingDoctors = async () => {
  const doctors = await User.find({
    role: "doctor",
    "doctorVerification.status": "pending",
  })
    .select(
      "fullName email phone specialization hospital yearsOfExperience doctorVerification"
    )
    .sort({ createdAt: 1 });

  return doctors;
};

// =========================================
// Get Doctor Verification Details
// =========================================

exports.getDoctorVerificationDetails = async (doctorId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  }).select(
    "fullName email phone age specialization hospital yearsOfExperience doctorVerification"
  );

  if (!doctor) {
    throw new ApiError(404, "Doctor not found.");
  }

  return doctor;
};

// =========================================
// Approve Doctor
// =========================================

exports.approveDoctor = async (doctorId, adminId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor not found.");
  }

  if (doctor.doctorVerification.status === "verified") {
    throw new ApiError(400, "Doctor is already verified.");
  }

  doctor.doctorVerification.status = "verified";
  doctor.doctorVerification.verifiedAt = new Date();
  doctor.doctorVerification.verifiedBy = adminId;
  doctor.doctorVerification.rejectionReason = "";
  doctor.accountStatus = "active";

  await doctor.save();

  // Send approval email (don't await, let it run async)
  sendDoctorVerificationEmail(doctor, "verified").catch(err => {
    console.error("Failed to send approval email:", err);
  });

  return doctor;
};

// =========================================
// Reject Doctor
// =========================================

exports.rejectDoctor = async (doctorId, adminId, rejectionReason) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor not found.");
  }

  if (doctor.doctorVerification.status === "verified") {
    throw new ApiError(400, "Verified doctor cannot be rejected.");
  }

  if (!rejectionReason || !rejectionReason.trim()) {
    throw new ApiError(
      400,
      "Rejection reason is required."
    );
  }

  doctor.doctorVerification.status = "rejected";
  doctor.doctorVerification.rejectionReason =
    rejectionReason.trim();
  doctor.doctorVerification.verifiedAt = null;
  doctor.doctorVerification.verifiedBy = adminId;
  doctor.accountStatus = "suspended";

  await doctor.save();

  // Send rejection email (don't await, let it run async)
  sendDoctorVerificationEmail(doctor, "rejected", rejectionReason).catch(err => {
    console.error("Failed to send rejection email:", err);
  });

  return doctor;
};

// =========================================
// Suspend Doctor (Add this)
// =========================================

exports.suspendDoctor = async (doctorId, adminId, reason) => {
  const doctor = await User.findById(doctorId);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found.");
  }

  if (doctor.role !== "doctor") {
    throw new ApiError(400, "User is not a doctor.");
  }

  // Update verification status
  doctor.doctorVerification.status = "suspended";
  doctor.doctorVerification.rejectionReason = reason || "Account suspended";
  doctor.doctorVerification.verifiedAt = new Date();
  doctor.doctorVerification.verifiedBy = adminId;
  
  await doctor.save();

  // Send suspension email
  sendDoctorVerificationEmail(doctor, "suspended", reason).catch(err => {
    console.error("Failed to send suspension email:", err);
  });

  return doctor;
};

// =========================================
// Delete Doctor Document
// =========================================

exports.deleteDoctorDocument = async (doctorId, documentId) => {
  const doctor = await User.findOne({
    _id: doctorId,
    role: "doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor not found.");
  }

  const documentIndex = doctor.doctorVerification.documents.findIndex(
    (doc) => doc._id.toString() === documentId
  );

  if (documentIndex === -1) {
    throw new ApiError(404, "Document not found.");
  }

  const document = doctor.doctorVerification.documents[documentIndex];

  // Delete from Cloudinary
  if (document.publicId) {
    try {
      await cloudinary.uploader.destroy(document.publicId, {
        resource_type: document.resourceType || "image",
      });
    } catch (error) {
      console.error("Failed to delete document from Cloudinary:", error);
    }
  }

  // Remove from array
  doctor.doctorVerification.documents.splice(documentIndex, 1);

  // If no documents left, set status to pending if not verified
  if (doctor.doctorVerification.documents.length === 0) {
    if (doctor.doctorVerification.status === "pending") {
      // Keep as pending
    } else if (doctor.doctorVerification.status === "verified") {
      doctor.doctorVerification.status = "pending";
      doctor.doctorVerification.verifiedAt = null;
      doctor.doctorVerification.verifiedBy = null;
    }
  }

  await doctor.save();

  return {
    message: "Document deleted successfully.",
    remainingDocuments: doctor.doctorVerification.documents.length,
  };
};
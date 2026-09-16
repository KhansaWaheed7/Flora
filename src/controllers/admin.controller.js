const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const {
  getDashboardStats,
  getPendingDoctors,
  getDoctors,
  approveDoctor,
  rejectDoctor,
  getPatients,
  updatePatientStatus,
  updateDoctorStatus,
  getAuditLogs,
  suspendDoctor,
} = require("../services/admin.service");

// =========================================
// Get Pending Doctors
// =========================================

exports.getPendingDoctors = asyncHandler(async (req, res) => {

  const doctors = await getPendingDoctors();

  res.status(200).json(
    new ApiResponse(
      200,
      "Pending doctors fetched successfully.",
      doctors
    )
  );

});

// =========================================
// Get All Doctors
// =========================================

exports.getDoctors = asyncHandler(async (req, res) => {

  const page =
    Math.max(
      parseInt(req.query.page) || 1,
      1
    );

  const limit =
    Math.min(
      Math.max(
        parseInt(req.query.limit) || 10,
        1
      ),
      100
    );

  const search =
    req.query.search || "";

  const result = await getDoctors(
    page,
    limit,
    search
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctors fetched successfully.",
      result
    )
  );

});

// =========================================
// Approve Doctor
// =========================================

exports.approveDoctor = asyncHandler(async (req, res) => {

  const doctor = await approveDoctor(
  req.params.id,
  req.user._id
);

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctor approved successfully.",
      doctor
    )
  );

});

// =========================================
// Reject Doctor
// =========================================

exports.rejectDoctor = asyncHandler(async (req, res) => {

  const doctor = await rejectDoctor(
  req.params.id,
  req.user._id
);

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctor rejected successfully.",
      doctor
    )
  );

});

// =========================================
// Admin Dashboard
// =========================================

exports.getDashboardStats = asyncHandler(async (req, res) => {

  const stats = await getDashboardStats();

  res.status(200).json(
    new ApiResponse(
      200,
      "Admin dashboard statistics fetched successfully.",
      stats
    )
  );

});

// =========================================
// Get All Patients
// =========================================

exports.getPatients = asyncHandler(async (req, res) => {

  const page =
    Math.max(
      parseInt(req.query.page) || 1,
      1
    );

  const limit =
    Math.min(
      Math.max(
        parseInt(req.query.limit) || 10,
        1
      ),
      100
    );

  const search =
    req.query.search || "";

  const result = await getPatients(
    page,
    limit,
    search
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Patients fetched successfully.",
      result
    )
  );

});

// =========================================
// Update Patient Account Status
// =========================================

exports.updatePatientStatus = asyncHandler(
  async (req, res) => {

    const {
      status,
    } = req.body;

    const patient = await updatePatientStatus(
  req.params.patientId,
  status,
  req.user._id
);

    res.status(200).json(
      new ApiResponse(
        200,
        `Patient account ${status} successfully.`,
        patient
      )
    );

  }
);

// =========================================
// Update Doctor Account Status
// =========================================

exports.updateDoctorStatus = asyncHandler(
  async (req, res) => {

    const { status } = req.body;

    const doctor = await updateDoctorStatus(
  req.params.id,
  status,
  req.user._id
);

    res.status(200).json(
      new ApiResponse(
        200,
        `Doctor account ${status} successfully.`,
        doctor
      )
    );

  }
);

exports.getAuditLogs = asyncHandler(async (req, res) => {

  const page = Math.max(
    parseInt(req.query.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      parseInt(req.query.limit) || 20,
      1
    ),
    100
  );

  const result = await getAuditLogs(
    page,
    limit
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Audit logs fetched successfully.",
      result
    )
  );

});
// =========================================
// Suspend Doctor
// =========================================

exports.suspendDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const { reason } = req.body;

  if (!reason?.trim()) {
    throw new ApiError(400, "Suspension reason is required.");
  }

  const doctor = await suspendDoctor(
    doctorId,
    req.user._id,
    reason
  );

  res.status(200).json(
    new ApiResponse(
      200,
      "Doctor suspended successfully.",
      {
        doctor,
      }
    )
  );
});
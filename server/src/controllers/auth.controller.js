const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const { registerSchema } = require("../validators/auth.validator");
const { loginSchema } = require("../validators/auth.validator");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");
const {
  registerUser,
  loginUser,
  loginWithGoogle,
  saveRefreshToken,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  resendVerificationEmail,
  verifyEmail: verifyEmailService,
  deleteAccount,
} = require("../services/auth.service");

exports.register = asyncHandler(async (req, res) => {
  console.log("Registration request received");
  console.log("Body:", req.body);
  console.log("Files:", req.files?.length || 0);


  const rawData = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "user",
    phone: req.body.phone || "",
    age: req.body.age ? Number(req.body.age) : undefined,
    specialization: req.body.specialization || "",
    hospital: req.body.hospital || "",
    
    // Convert yearsOfExperience to number
    yearsOfExperience: req.body.yearsOfExperience !== undefined && req.body.yearsOfExperience !== "" 
      ? Number(req.body.yearsOfExperience) 
      : undefined,
    
    pmdcRegistrationNumber: req.body.pmdcRegistrationNumber || "",
    registrationType: req.body.registrationType || undefined,
    
    // Parse qualifications from JSON string to array
    qualifications: req.body.qualifications 
      ? JSON.parse(req.body.qualifications) 
      : [],
    
    terms: req.body.terms === "true" || req.body.terms === true,
  };

  console.log("Parsed data for validation:", rawData);

  // Validate with Zod

  const validatedData = registerSchema.parse(rawData);

  console.log("Validation passed:", validatedData);


  // Handle doctor verification documents

  const uploadedFiles = req.files || {};

  if (validatedData.role === "doctor") {
    const missingDocuments = [];

    if (!uploadedFiles.pmdcCertificate?.[0]) {
      missingDocuments.push("PMDC Certificate");
    }

    if (!uploadedFiles.medicalDegree?.[0]) {
      missingDocuments.push("Medical Degree");
    }

    if (!uploadedFiles.identityDocument?.[0]) {
      missingDocuments.push("Identity Document / CNIC");
    }

    if (missingDocuments.length > 0) {
      throw new ApiError(
        400,
        `The following verification documents are required: ${missingDocuments.join(", ")}`
      );
    }
  }

  const documents = [];

  const documentFieldMap = [
    ["pmdcCertificate", "pmdc_certificate"],
    ["medicalDegree", "medical_degree"],
    ["identityDocument", "identity_document"],
    ["specialistCertificate", "specialist_certificate"],
  ];

  documentFieldMap.forEach(([fieldName, documentType]) => {
    const file = uploadedFiles[fieldName]?.[0];

    if (file) {
      documents.push({ file, documentType });
    }
  });

  console.log(`Processing ${documents.length} doctor verification documents`);

  const user = await registerUser(validatedData, documents);

  res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        requiresEmailVerification: !user.isEmailVerified,
        documentsUploaded: documents.length,
      }
    )
  );
});

exports.login = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);

  try {
    const user = await loginUser(
      validatedData.email,
      validatedData.password
    );

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(user._id, refreshToken);

    res.status(200).json(
      new ApiResponse(
        200,
        "Login successful",
        {
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          }
        }
      )
    );
  } catch (error) {
    // If it's a pending doctor verification, send the specific message
    if (error.errorCode === "PENDING_DOCTOR_VERIFICATION") {
      throw new ApiError(403, "PENDING_DOCTOR_VERIFICATION", error.message);
    }
    if (error.errorCode === "REJECTED_DOCTOR_VERIFICATION") {
      throw new ApiError(403, "REJECTED_DOCTOR_VERIFICATION", error.message);
    }
    if (error.errorCode === "SUSPENDED_DOCTOR_ACCOUNT") {
      throw new ApiError(403, "SUSPENDED_DOCTOR_ACCOUNT", error.message);
    }
    throw error;
  }
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ApiError(400, "Google token is required.");
  }

  const result = await loginWithGoogle(token);

  res.status(200).json(
    new ApiResponse(
      200,
      "Google login successful",
      {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: {
          id: result.user._id,
          fullName: result.user.fullName,
          email: result.user.email,
          role: result.user.role,
        },
      }
    )
  );
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  const jwt = require("jsonwebtoken");
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const User = require("../models/User");
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user);

  res.status(200).json(
    new ApiResponse(
      200,
      "Access token refreshed",
      {
        accessToken: newAccessToken
      }
    )
  );
});

exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "Logged out successfully", null)
  );
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  await forgotPassword(req.body.email);

  res.status(200).json(
    new ApiResponse(200, "Password reset email sent successfully")
  );
});

exports.resetPassword = asyncHandler(async (req, res) => {
  await resetPassword(req.params.token, req.body.password);

  res.status(200).json(
    new ApiResponse(200, "Password has been reset successfully")
  );
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  await verifyEmailService(req.params.token);

  res.status(200).json(
    new ApiResponse(200, "Email verified successfully", null)
  );
});

exports.resendVerification = asyncHandler(async (req, res) => {
  await resendVerificationEmail(req.body.email);

  res.status(200).json(
    new ApiResponse(200, "Verification email sent successfully")
  );
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  await deleteAccount(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Account deleted successfully", null)
  );
});
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
  try {
    // Get the form data
    let validatedData;
    
    try {
      // For FormData, we need to parse the data properly
      const rawData = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || "user",
        phone: req.body.phone || "",
        age: req.body.age ? Number(req.body.age) : undefined,
        specialization: req.body.specialization || "",
        hospital: req.body.hospital || "",
        yearsOfExperience: req.body.yearsOfExperience !== undefined && req.body.yearsOfExperience !== "" 
          ? Number(req.body.yearsOfExperience) 
          : undefined,
        pmdcRegistrationNumber: req.body.pmdcRegistrationNumber || "",
        registrationType: req.body.registrationType || undefined,
        qualifications: req.body.qualifications ? JSON.parse(req.body.qualifications) : [],
      };
      
      validatedData = registerSchema.parse(rawData);
    } catch (parseError) {
      console.error("Validation error:", parseError);
      if (parseError.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: parseError.errors,
        });
      }
      throw parseError;
    }
    
    // Handle multiple document uploads
    const files = req.files || [];
    const documentTypes = Array.isArray(req.body.documentTypes) 
      ? req.body.documentTypes 
      : req.body.documentTypes 
        ? [req.body.documentTypes] 
        : [];
    
    // Attach document types to the data
    validatedData.documentTypes = documentTypes;

    const user = await registerUser(validatedData, files);

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
        }
      )
    );
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
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
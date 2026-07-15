const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const { registerSchema } = require("../validators/auth.validator");
const { loginSchema } = require("../validators/auth.validator");
const { generateAccessToken } = require("../utils/jwt");

const {
  registerUser,
  loginUser,
} = require("../services/auth.service");

exports.register = asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);

  const user = await registerUser(validatedData);

  res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      }
    )
  );
});

exports.login = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);

  const user = await loginUser(
    validatedData.email,
    validatedData.password
  );

  const token = generateAccessToken(user);

  res.status(200).json(
    new ApiResponse(200, "Login successful", {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    })
  );
});
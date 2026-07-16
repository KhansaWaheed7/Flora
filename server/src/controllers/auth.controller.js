const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const { registerSchema } = require("../validators/auth.validator");
const { loginSchema } = require("../validators/auth.validator");
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/jwt");
const {
    registerUser,
    loginUser,
    saveRefreshToken
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

 const accessToken = generateAccessToken(user);

const refreshToken = generateRefreshToken(user);

await saveRefreshToken(
    user._id,
    refreshToken
);

  res.status(200).json(

    new ApiResponse(

        200,

        "Login successful",

        {

            accessToken,

            refreshToken,

            user:{

                id:user._id,

                fullName:user.fullName,

                email:user.email,

                role:user.role

            }

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

    const newAccessToken =
        generateAccessToken(user);

    res.status(200).json(

        new ApiResponse(

            200,

            "Access token refreshed",

            {

                accessToken:newAccessToken

            }

        )

    );

}); 

exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      "Logged out successfully",
      null
    )
  );
});
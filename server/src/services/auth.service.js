const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateResetToken = require("../utils/generateResetToken");
const registerUser = async (data) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await User.create(data);

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  return user;
};
const saveRefreshToken = async (userId, refreshToken) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.refreshToken = refreshToken;

    await user.save();

};
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = generateResetToken();

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `
      <h2>Flora Password Reset</h2>

      <p>You requested a password reset.</p>

      <a href="${resetURL}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
  `;

  await sendEmail({
    email: user.email,
    subject: "Flora Password Reset",
    message,
  });
};

const resetPassword = async (token, password) => {

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
        throw new ApiError(400, "Reset token is invalid or has expired");
    }

    user.password = password;

    user.resetPasswordToken = "";

    user.resetPasswordExpire = undefined;

    await user.save();

};

module.exports = {
  registerUser,
  loginUser,
  saveRefreshToken,
  forgotPassword,
  resetPassword
};
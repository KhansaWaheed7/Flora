const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (data.fullName) user.fullName = data.fullName;
  if (data.phone) user.phone = data.phone;
  if (data.age) user.age = data.age;

  await user.save();

  return user;
};

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;

  await user.save();

  return;
};

const deleteAccount = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await User.findByIdAndDelete(userId);
};

module.exports = {
  updateProfile,
  changePassword,
  deleteAccount,
};
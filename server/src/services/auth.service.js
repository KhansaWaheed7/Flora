const User = require("../models/User");
const ApiError = require("../utils/ApiError");

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

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return user;
};
module.exports = {
  registerUser,
  loginUser,
};
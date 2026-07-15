const jwt = require("jsonwebtoken");

const User = require("../models/User");

const ApiError = require("../utils/ApiError");

const asyncHandler = require("../utils/asyncHandler");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;

  next();
});
const Profile = require("../models/Profile");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const {
  calculateAge,
  calculateBMI,
  getBMICategory,
} = require("../utils/profile.utils");

const getProfileCompletion = require("../utils/profileCompletion");

const createProfile = async (userId) => {
  const existing = await Profile.findOne({ user: userId });

  if (existing) {
    throw new ApiError(400, "Profile already exists");
  }

  return await Profile.create({
    user: userId,
  });
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "fullName email phone profilePicture"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let profile = await Profile.findOne({ user: userId });

  if (!profile) {
    profile = await Profile.create({
      user: userId,
    });
  }

  const age = calculateAge(profile.dateOfBirth);

const bmi = calculateBMI(
  profile.height,
  profile.weight
);

const bmiCategory = getBMICategory(bmi);

const completion = getProfileCompletion(
  user,
  profile
);

return {
  user,
  profile,
  age,
  bmi,
  bmiCategory,
  completion,
};
};

const updateProfile = async (userId, body) => {
  const {
    fullName,
    phone,
    dateOfBirth,
    gender,
    bloodGroup,
    location,
    height,
    weight,
    allergies,
    medicalConditions,
  } = body;

  await User.findByIdAndUpdate(userId, {
    fullName,
    phone,
  });

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    {
      dateOfBirth,
      gender,
      bloodGroup,
      location,
      height,
      weight,
      allergies,
      medicalConditions,
    },
    {
      new: true,
      upsert: true,
    }
  );

  return profile;
};

const uploadAvatar = async (userId, file) => {

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  const result = await new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "flora/profile",
      },
      (error, result) => {

        if (error) return reject(error);

        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

  profile.avatar = result.secure_url;

  await profile.save();

  return profile.avatar;
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  uploadAvatar,
};
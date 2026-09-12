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
    dateOfBirth: dateOfBirth || undefined,
    gender: gender || undefined,
    bloodGroup: bloodGroup || undefined,
    location: location || undefined,
    height: height ?? undefined,
    weight: weight ?? undefined,
    allergies: allergies || [],
    medicalConditions: medicalConditions || [],
  },

    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return profile;
};

const uploadAvatar = async (userId, file) => {
  if (!file) {
    throw new ApiError(400, "No image file provided");
  }

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "flora/profile",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }

          resolve(result);
        }
      );

      streamifier
        .createReadStream(file.buffer)
        .pipe(stream);
    });

    console.log(
      "Cloudinary upload successful:",
      result.secure_url
    );

    // Update ONLY the avatar field
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { avatar: result.secure_url },
      { new: true }
    );

    console.log(
      "Avatar saved to profile:",
      updatedProfile.avatar
    );

    return updatedProfile.avatar;

  } catch (error) {
    console.error("Avatar upload failed:", error);

    throw new ApiError(
      500,
      error.message || "Failed to upload avatar"
    );
  }
};

const removeAvatar = async (userId) => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  // If there is no avatar, nothing to remove
  if (!profile.avatar) {
    return "";
  }

  // Extract Cloudinary public ID from the URL
  const urlParts = profile.avatar.split("/upload/");

  if (urlParts.length === 2) {
    let publicId = urlParts[1];

    // Remove version, e.g. v1786615004/
    publicId = publicId.replace(/^v\d+\//, "");

    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId);
  }

  // Remove avatar URL from database
  profile.avatar = "";
  await profile.save();

  return "";
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
};
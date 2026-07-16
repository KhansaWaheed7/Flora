const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    phone: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
    },

    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
    type: String,
    default: "",
    },

    emailVerificationExpire: {
    type: Date,
    },
    refreshToken: {
    type: String,
    default: "",
    },
    resetPasswordToken: {
    type: String,
    default: ""
    },

    resetPasswordExpire: {
    type: Date
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", userSchema);
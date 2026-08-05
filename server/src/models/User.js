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
  minlength: 8,
  select: false,
},

    googleId: {
  type: String,
  default: "",
},

provider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
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

    doctorApprovalStatus: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "approved",
},

specialization: {
  type: String,
  default: "",
},

licenseNumber: {
  type: String,
  default: "",
},

hospital: {
  type: String,
  default: "",
},

yearsOfExperience: {
  type: Number,
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
    profilePicture: {
    type: String,
    default: ""
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function () {

  if (!this.password) return;

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

});
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
module.exports = mongoose.model("User", userSchema);
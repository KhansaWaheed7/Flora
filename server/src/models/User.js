const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // =========================================
    // Basic User Information
    // =========================================

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
      trim: true,
    },

    age: {
      type: Number,
    },

    // =========================================
    // Role & Account Status
    // =========================================

    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },

    // =========================================
    // Doctor Profile
    // =========================================

    specialization: {
      type: String,
      default: "",
      trim: true,
    },

    hospital: {
      type: String,
      default: "",
      trim: true,
    },

    yearsOfExperience: {
      type: Number,
      min: 0,
    },

    // =========================================
    // Doctor Verification
    // =========================================

    doctorVerification: {
      status: {
        type: String,
        enum: [
          "pending",
          "verified",
          "rejected",
          "suspended",
        ],
        default: "pending",
      },

      // PMDC registration information
      pmdcRegistrationNumber: {
        type: String,
        default: "",
        trim: true,
      },

      registrationType: {
        type: String,
        enum: [
          "permanent",
          "provisional",
          "specialist",
          "",
        ],
        default: "",
      },

      // Academic / professional qualifications
      qualifications: [
        {
          degree: {
            type: String,
            trim: true,
          },

          institution: {
            type: String,
            trim: true,
          },

          completionYear: {
            type: Number,
          },
        },
      ],

      // Verification documents
      documents: [
        {
          type: {
            type: String,
            enum: [
              "pmdc_certificate",
              "medical_degree",
              "specialist_certificate",
              "identity_document",
              "other",
            ],
          },

          url: {
            type: String,
            default: "",
          },

          publicId: {
            type: String,
            default: "",
          },

          resourceType: {
  type: String,
  default: "auto",
},

          originalName: {
            type: String,
            default: "",
          },

          uploadedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

      // Admin verification information
      verifiedAt: {
        type: Date,
      },

      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      rejectionReason: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // =========================================
    // Email Verification
    // =========================================

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

    // =========================================
    // Authentication
    // =========================================

    refreshToken: {
      type: String,
      default: "",
    },

    // =========================================
    // Password Reset
    // =========================================

    resetPasswordToken: {
      type: String,
      default: "",
    },

    resetPasswordExpire: {
      type: Date,
    },

    // =========================================
    // Profile
    // =========================================

    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// =========================================
// Password Hashing
// =========================================

userSchema.pre("save", async function () {
  if (!this.password) return;

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// =========================================
// Password Comparison
// =========================================

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
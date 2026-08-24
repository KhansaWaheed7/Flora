const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "APPROVE_DOCTOR",
        "REJECT_DOCTOR",
        "SUSPEND_DOCTOR",
        "REACTIVATE_DOCTOR",
        "SUSPEND_PATIENT",
        "REACTIVATE_PATIENT",
      ],
      required: true,
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
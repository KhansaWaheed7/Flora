const mongoose = require("mongoose");

const pregnancyReminderSchema = new mongoose.Schema(
  {
    pregnancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pregnancy",
      required: true,
    },

    week: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PregnancyReminder",
  pregnancyReminderSchema
);
const mongoose = require("mongoose");

const pregnancySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    lastPeriodDate: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    currentWeek: {
      type: Number,
      default: 1,
      min: 1,
      max: 42,
    },

    trimester: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Pregnancy",
  pregnancySchema
);
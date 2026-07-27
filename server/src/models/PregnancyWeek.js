const mongoose = require("mongoose");

const pregnancyWeekSchema = new mongoose.Schema(
  {
    week: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 40,
    },

    babySize: {
      type: String,
      required: true,
    },

    babyWeight: {
      type: String,
      required: true,
    },

    babyLength: {
      type: String,
      required: true,
    },

    babyDevelopment: {
      type: String,
      required: true,
    },

    motherChanges: {
      type: String,
      required: true,
    },

    checklist: [
      {
        type: String,
      },
    ],

    warningSigns: [
      {
        type: String,
      },
    ],

    nutritionTips: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PregnancyWeek",
  pregnancyWeekSchema
);
const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    periodStart: {
      type: Date,
      required: true,
    },

    periodEnd: {
      type: Date,
      required: true,
    },

    cycleLength: {
      type: Number,
      min: 15,
      max: 60,
    },

    periodLength: {
      type: Number,
      min: 1,
      max: 10,
    },

    symptoms: [
      {
        type: String,
        enum: [
          "cramps",
          "headache",
          "bloating",
          "fatigue",
          "back_pain",
          "breast_tenderness",
          "mood_swings",
          "acne",
          "nausea",
          "insomnia",
          "none",
        ],
      },
    ],

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cycle", cycleSchema);
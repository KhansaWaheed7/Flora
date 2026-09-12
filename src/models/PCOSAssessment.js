const mongoose = require("mongoose");

const pcosAssessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: {
      age: {
        type: Number,
        required: true,
      },

      bmi: {
        type: Number,
        required: true,
      },

      cycleLength: {
        type: Number,
        required: true,
      },

      irregularPeriods: {
        type: Boolean,
        required: true,
      },

      weightGain: {
        type: Boolean,
        required: true,
      },

      acne: {
        type: Boolean,
        required: true,
      },

      hairLoss: {
        type: Boolean,
        required: true,
      },

      excessiveHairGrowth: {
        type: Boolean,
        required: true,
      },

      darkSkinPatches: {
        type: Boolean,
        required: true,
      },


      exerciseFrequency: {
        type: Number,
        required: true,
      },

      fastFood: {
  type: Boolean,
  required: true,
},

    },

    probability: {
      type: Number,
      default: 0,
    },

    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    prediction: {
      type: Boolean,
      default: false,
    },

    confidence: {
      type: Number,
      default: 0,
    },

    recommendations: [
      {
        type: String,
      },
    ],

    disclaimer: {
  type: String,
  default: ""
},

    topFactors: [
  {
    factor: {
      type: String,
      required: true,
    },
    impact: {
      type: String,
      enum: ["positive", "negative"],
      required: true,
    },
    shapValue: {
      type: Number,
      required: true,
    },
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PCOSAssessment",
  pcosAssessmentSchema
);
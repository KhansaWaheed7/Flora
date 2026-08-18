const mongoose = require("mongoose");

const medicalReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fileName: {
      type: String,
      required: true,
      trim: true,
    },

    fileType: {
      type: String,
      enum: ["pdf", "image", "text"],
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: "",
    },

    extractedText: {
      type: String,
      default: "",
    },

    reportType: {
      type: String,
      default: "Unknown",
    },

    extractedData: [
      {
        test: {
          type: String,
          trim: true,
        },

        value: {
          type: String,
          trim: true,
        },

        unit: {
          type: String,
          trim: true,
          default: "",
        },

        referenceRange: {
          type: String,
          trim: true,
          default: "",
        },

        status: {
          type: String,
          enum: [
            "normal",
            "low",
            "high",
            "abnormal",
            "unknown",
          ],
          default: "unknown",
        },
      },
    ],

    abnormalResults: [
      {
        test: {
          type: String,
          trim: true,
        },

        value: {
          type: String,
          trim: true,
        },

        unit: {
          type: String,
          trim: true,
          default: "",
        },

        referenceRange: {
          type: String,
          trim: true,
          default: "",
        },

        status: {
          type: String,
          enum: ["low", "high", "abnormal"],
        },
      },
    ],

    summary: {
      type: String,
      default: "",
    },

    processingStatus: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "completed",
        "failed",
      ],
      default: "uploaded",
    },

    processingError: {
      type: String,
      default: "",
    },

    disclaimer: {
      type: String,
      default:
        "This report analysis is for informational purposes only and does not constitute a medical diagnosis. Please consult a qualified healthcare professional for interpretation of your results.",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MedicalReport",
  medicalReportSchema
);
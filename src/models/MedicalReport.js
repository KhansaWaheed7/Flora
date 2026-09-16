// server/src/models/MedicalReport.js (UPDATED)
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

    // Encrypted file data (stored in DB or disk)
    encryptedData: {
      type: Buffer,
    },

    // Encryption metadata
    encryptionIV: {
      type: String,
      required: true,
    },

    encryptionAuthTag: {
      type: String,
      required: true,
    },

    // File integrity
    fileHash: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    // Extracted text
    extractedText: {
      type: String,
      default: "",
    },

    reportType: {
      type: String,
      default: "Unknown",
      enum: [
        "Blood Test",
        "Urine Test",
        "Ultrasound",
        "X-Ray",
        "CT Scan",
        "MRI",
        "Pathology",
        "Cardiology",
        "Gynecology",
        "Thyroid Test",
        "Liver Function",
        "Kidney Function",
        "Unknown",
      ],
    },

    // Structured extracted data
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

    // Range printed on the uploaded report
    reportReferenceRange: {
      type: String,
      trim: true,
      default: "",
    },

    // Range obtained from trusted medical knowledge/RAG
    knowledgeReferenceRange: {
      type: String,
      trim: true,
      default: "",
    },

    // Which source determined the range
    referenceSource: {
      type: String,
      enum: [
        "report",
        "knowledge_base",
        "none",
      ],
      default: "none",
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

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    explanation: {
      type: String,
      default: "",
    },
  },
],

    // Abnormal results
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
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
          default: "mild",
        },
        recommendation: {
          type: String,
          default: "",
        },
      },
    ],

    // Summary and insights
    summary: {
      type: String,
      default: "",
    },

    insights: {
      overview: String,
      keyFindings: [String],
      normalResults: [String],
      recommendations: [String],
      whenToSeeDoctor: String,
    },

    aiAnalysis: {
  reportType: {
    type: String,
    default: "Unknown",
  },

  overview: {
    type: String,
    default: "",
  },

  keyFindings: {
    type: [String],
    default: [],
  },

  recommendations: {
    type: [String],
    default: [],
  },

  whenToSeeDoctor: {
    type: String,
    default: "",
  },

  disclaimer: {
    type: String,
    default: "",
  },

  model: {
    type: String,
    default: "",
  },

  ragUsed: {
    type: Boolean,
    default: false,
  },

  analyzedAt: {
    type: Date,
  },
},
    // Processing status
    processingStatus: {
      type: String,
      enum: ["uploaded", "processing", "ocr_done", "parsing_done", "completed", "failed"],
      default: "uploaded",
    },

    processingError: {
      type: String,
      default: "",
    },

    // Privacy
    isPrivate: {
      type: Boolean,
      default: true,
    },

    // Access tracking
    accessLog: [
      {
        accessedBy: mongoose.Schema.Types.ObjectId,
        accessedAt: {
          type: Date,
          default: Date.now,
        },
        action: {
          type: String,
          enum: ["viewed", "downloaded", "shared"],
        },
      },
    ],

    // Metadata
    metadata: {
      uploadedFrom: {
        type: String,
        enum: ["mobile", "web", "api"],
        default: "web",
      },
      userAgent: String,
    },

    // Disclaimer
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

// Indexes
medicalReportSchema.index({ user: 1, createdAt: -1 });
medicalReportSchema.index({ processingStatus: 1 });
medicalReportSchema.index({ "abnormalResults.severity": 1 });

module.exports = mongoose.model("MedicalReport", medicalReportSchema);
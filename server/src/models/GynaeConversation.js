const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const assessmentSchema = new mongoose.Schema(
  {
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    redFlags: {
      type: [String],
      default: [],
    },

    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", null],
      default: null,
    },

    result: {
      title: {
        type: String,
        default: null,
      },

      summary: {
        type: String,
        default: null,
      },

      recommendation: {
        type: String,
        default: null,
      },
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const gynaeConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
  type: String,
  enum: [
    "missed_period",
    "pelvic_pain",
    "vaginal_discharge",
    "painful_period",
    "abnormal_bleeding",
    "urinary_symptoms",
    "general_menstrual_health",
    "general_gynae",
    "out_of_scope",
  ],
  default: null,
},

    currentQuestion: {
      type: String,
      default: null,
    },

    assessment: {
      type: assessmentSchema,
      default: () => ({}),
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "GynaeConversation",
  gynaeConversationSchema
);
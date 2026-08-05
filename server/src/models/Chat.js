const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "closed", "rejected"],
      default: "pending",
    },

    acceptedAt: {
  type: Date,
},

closedAt: {
  type: Date,
},

    lastMessage: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Message",
},

    lastMessageAt: {
      type: Date,
    },
    unreadCounts: {

  patient: {
    type: Number,
    default: 0,
  },

  doctor: {
    type: Number,
    default: 0,
  },

},
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
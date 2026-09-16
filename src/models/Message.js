const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

     sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "system"],
      default: "text",
    },

    attachment: {
  encryptedData: {
    type: Buffer,
  },
  encryptionIV: {
    type: String,
  },
  encryptionAuthTag: {
    type: String,
  },
  fileHash: {
    type: String,
  },
  originalName: {
    type: String,
    trim: true,
  },
  size: {
    type: Number,
  },
  mimeType: {
    type: String,
  },
},

    isDelivered: {
  type: Boolean,
  default: false,
},

      deliveredAt: Date,

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
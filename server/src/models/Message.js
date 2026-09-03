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
      url: String,
      publicId: String,
      originalName: String,
      size: Number,
      mimeType: String,
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
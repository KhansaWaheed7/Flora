const { z } = require("zod");

const sendMessageSchema = z.object({

  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(5000, "Message is too long."),

});

module.exports = {
  sendMessageSchema,
};
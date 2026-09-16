const { z } = require("zod");

const sendMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .max(5000, "Message is too long.")
    .optional()
    .default(""),
});

module.exports = {
  sendMessageSchema,
};
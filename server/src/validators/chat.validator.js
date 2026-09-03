const { z } = require("zod");

const createChatSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  reason: z.string().trim().min(1, "Reason is required").max(500),
});

module.exports = {
  createChatSchema,
};
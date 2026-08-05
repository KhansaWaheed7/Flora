const { z } = require("zod");

const createChatSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
});

module.exports = {
  createChatSchema,
};
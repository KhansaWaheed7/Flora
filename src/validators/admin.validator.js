const { z } = require("zod");

const doctorIdSchema = z.object({
  id: z.string().min(1, "Doctor ID is required"),
});

module.exports = {
  doctorIdSchema,
};
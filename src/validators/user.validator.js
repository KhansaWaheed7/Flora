const { z } = require("zod");

const updateProfileSchema = z.object({
  fullName: z.string().min(3).optional(),
  phone: z.string().optional(),
  age: z.number().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
};
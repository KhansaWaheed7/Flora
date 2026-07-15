const { z } = require("zod");

const registerSchema = z.object({
  fullName: z.string().min(3),

  email: z.email(),

  password: z.string().min(8),

  phone: z.string().optional(),

  age: z.number().optional(),
});
const loginSchema = z.object({
  email: z.email(),

  password: z.string().min(1),
});

module.exports = {
  registerSchema,
  loginSchema,
};
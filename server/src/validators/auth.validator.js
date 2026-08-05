const { z } = require("zod");

const registerSchema = z.object({

  fullName: z
    .string()
    .min(3, "Full name is required"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  phone: z
    .string()
    .optional(),

  age: z
    .number()
    .optional(),

  role: z
    .enum(["user", "doctor"])
    .default("user"),

  specialization: z
    .string()
    .optional(),

  licenseNumber: z
    .string()
    .optional(),

  hospital: z
    .string()
    .optional(),

  yearsOfExperience: z
    .number()
    .optional(),

}).superRefine((data, ctx) => {

  if (data.role === "doctor") {

    if (!data.specialization) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["specialization"],
        message: "Specialization is required",
      });
    }

    if (!data.licenseNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["licenseNumber"],
        message: "License number is required",
      });
    }

    if (!data.hospital) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hospital"],
        message: "Hospital is required",
      });
    }

    if (data.yearsOfExperience === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["yearsOfExperience"],
        message: "Years of experience is required",
      });
    }

  }

});
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
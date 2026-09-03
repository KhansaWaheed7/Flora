const { z } = require("zod");

// =========================================
// Register Schema
// =========================================

const registerSchema = z
  .object({
    // -----------------------------------------
    // Basic Information
    // -----------------------------------------

    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name must be less than 100 characters"),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((email) => email.toLowerCase()),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be less than 128 characters"),

    phone: z
      .string()
      .trim()
      .optional(),

    age: z
      .number()
      .int("Age must be a whole number")
      .min(13, "Age must be at least 13")
      .max(120, "Invalid age")
      .optional(),

    // -----------------------------------------
    // Role
    // -----------------------------------------

    role: z
      .enum(["user", "doctor"])
      .default("user"),

    // -----------------------------------------
    // Doctor Profile
    // -----------------------------------------

    specialization: z
      .string()
      .trim()
      .max(100, "Specialization is too long")
      .optional(),

    hospital: z
      .string()
      .trim()
      .max(200, "Hospital/clinic name is too long")
      .optional(),

    yearsOfExperience: z
      .number()
      .int("Years of experience must be a whole number")
      .min(0, "Years of experience cannot be negative")
      .max(70, "Invalid years of experience")
      .optional(),

    // -----------------------------------------
    // Doctor Registration / Verification
    // -----------------------------------------

    pmdcRegistrationNumber: z
      .string()
      .trim()
      .max(50, "PMDC registration number is too long")
      .optional(),

    registrationType: z
      .enum([
        "permanent",
        "provisional",
        "specialist",
      ])
      .optional(),

    // -----------------------------------------
    // Doctor Qualifications
    // -----------------------------------------

    qualifications: z
      .array(
        z.object({
          degree: z
            .string()
            .trim()
            .min(2, "Degree is required")
            .max(150, "Degree name is too long"),

          institution: z
            .string()
            .trim()
            .min(2, "Institution is required")
            .max(200, "Institution name is too long"),

          completionYear: z
            .number()
            .int("Completion year must be a whole number")
            .min(1950, "Invalid completion year")
            .max(
              new Date().getFullYear(),
              "Completion year cannot be in the future"
            ),
        })
      )
      .optional(),
  })

  // =========================================
  // Doctor-specific validation
  // =========================================

  .superRefine((data, ctx) => {
    if (data.role !== "doctor") {
      return;
    }

    // -----------------------------------------
    // Specialization
    // -----------------------------------------

    if (!data.specialization) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["specialization"],
        message: "Specialization is required",
      });
    }

    // -----------------------------------------
    // Hospital / Clinic
    // -----------------------------------------

    if (!data.hospital) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hospital"],
        message: "Hospital or clinic is required",
      });
    }

    // -----------------------------------------
    // Experience
    // -----------------------------------------

    if (data.yearsOfExperience === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["yearsOfExperience"],
        message: "Years of experience is required",
      });
    }

    // -----------------------------------------
    // PMDC Registration Number
    // -----------------------------------------

    if (!data.pmdcRegistrationNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pmdcRegistrationNumber"],
        message: "PMDC registration number is required",
      });
    }

    // -----------------------------------------
    // Registration Type
    // -----------------------------------------

    if (!data.registrationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["registrationType"],
        message: "Registration type is required",
      });
    }

    // -----------------------------------------
    // Qualifications
    // -----------------------------------------

    if (!data.qualifications || data.qualifications.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["qualifications"],
        message: "At least one medical qualification is required",
      });
    }
  });

// =========================================
// Login Schema
// =========================================

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required"),
});

// =========================================
// Exports
// =========================================

module.exports = {
  registerSchema,
  loginSchema,
};
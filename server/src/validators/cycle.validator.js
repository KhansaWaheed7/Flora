const { z } = require("zod");

const cycleSchema = z
  .object({
    periodStart: z.coerce.date(),

    periodEnd: z.coerce.date().nullable().optional(),

    symptoms: z.array(z.string()).optional(),

    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.periodEnd) return true;

      return data.periodEnd >= data.periodStart;
    },
    {
      message: "Period end date cannot be before start date.",
      path: ["periodEnd"],
    }
  );

module.exports = {
  cycleSchema,
};
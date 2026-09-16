const { z } = require("zod");

const cycleFields = {
  periodStart: z.coerce.date(),

  periodEnd: z.coerce.date().nullable().optional(),

  symptoms: z.array(z.string()).optional(),

  notes: z.string().optional(),
};

// Validation for creating a cycle
const cycleSchema = z
  .object(cycleFields)
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

// Validation for updating a cycle
const updateCycleSchema = z
  .object({
    periodStart: cycleFields.periodStart.optional(),

    periodEnd: cycleFields.periodEnd,

    symptoms: cycleFields.symptoms,

    notes: cycleFields.notes,
  })
  .refine(
    (data) => {
      // If either date is missing, let the service
      // handle the existing database value.
      if (!data.periodStart || !data.periodEnd) {
        return true;
      }

      return data.periodEnd >= data.periodStart;
    },
    {
      message: "Period end date cannot be before start date.",
      path: ["periodEnd"],
    }
  );

module.exports = {
  cycleSchema,
  updateCycleSchema,
};